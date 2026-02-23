import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MessageSquare, Send, ChevronDown, ChevronRight,
  Users, Package, Clock, TrendingUp, AlertTriangle,
  BarChart2, Zap, Search,
} from 'lucide-react'
import {
  WORKERS,
  CONTAINERS_ALL,
  WAVE_ORDER_DATA,
  LABOR_PERIOD_DATA,
  SITE_STATS,
  ACCUMULATED_DELAY,
  ZONE_CONFIG,
} from '../mockData.js'

// ─── Module-level derived data ────────────────────────────────────────────────
const DOCK_WORKERS = WORKERS.filter(
  w => w.assignedZone === 'Zone A' || w.assignedZone === 'Crossdock'
)

const SUPPLIERS_LIST = (() => {
  const counts = CONTAINERS_ALL.reduce((acc, c) => {
    acc[c.supplier] = (acc[c.supplier] || 0) + 1
    return acc
  }, {})
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})()

const DOCK_VALUES = [...new Set(
  CONTAINERS_ALL.map(c => c.dockAssigned).filter(Boolean)
)].sort()

const CONTAINERS_BY_AGE = [...CONTAINERS_ALL].sort((a, b) => b.ageInYard - a.ageInYard)

const WAVES = WAVE_ORDER_DATA.waves
const RECENT_ORDERS = WAVE_ORDER_DATA.orders.slice(0, 5)
const PICKER_NAMES = WORKERS.map(w => ({ id: w.id, name: w.name, zone: w.assignedZone }))

// ─── Question Library ─────────────────────────────────────────────────────────
const QUESTION_LIBRARY = [
  {
    id: 'yard',
    category: 'Yard Management',
    questions: [
      'What containers have been in the yard longest?',
      'How many containers are currently in the yard?',
      'Which suppliers have the most containers waiting?',
      'What dock assignments are active right now?',
    ],
  },
  {
    id: 'labor',
    category: 'Labor Management',
    questions: [
      'Who is working the dock right now?',
      'Show me the labor breakdown by zone',
      'Which zones are understaffed this shift?',
    ],
  },
  {
    id: 'workload',
    category: 'Workload Distribution',
    questions: [
      'Show me the status of all waves',
      'Which wave is furthest behind?',
      'How is WAVE-001 performing?',
    ],
  },
  {
    id: 'performance',
    category: 'Performance',
    questions: [
      'What are the current delay patterns?',
      'Show me throughput and utilization stats',
      'Where are the biggest bottlenecks today?',
    ],
  },
]

// ─── @ Mention Suggestions ────────────────────────────────────────────────────
function getMentionSuggestions(afterAt) {
  const lower = afterAt.toLowerCase()

  const CATEGORIES = [
    { label: '@wave', insertValue: '@wave', category: 'Category', meta: 'Filter by wave', isCategory: true },
    { label: '@order', insertValue: '@order', category: 'Category', meta: 'Filter by order', isCategory: true },
    { label: '@dock', insertValue: '@dock', category: 'Category', meta: 'Filter by dock', isCategory: true },
    { label: '@container', insertValue: '@container', category: 'Category', meta: 'Filter by container', isCategory: true },
    { label: '@picker', insertValue: '@picker', category: 'Category', meta: 'Filter by picker', isCategory: true },
  ]

  if (afterAt === '') return CATEGORIES

  if (lower.startsWith('wave:') || lower === 'wave') {
    if (lower === 'wave') {
      return WAVES.map(w => ({
        label: w.name.split(' ')[0],
        insertValue: `@wave:${w.id}`,
        category: 'Wave',
        meta: w.id,
      }))
    }
    const partial = lower.slice(5)
    return WAVES
      .filter(w => w.id.toLowerCase().includes(partial) || w.name.toLowerCase().includes(partial))
      .map(w => ({
        label: w.name.split(' ')[0],
        insertValue: `@wave:${w.id}`,
        category: 'Wave',
        meta: w.id,
      }))
  }

  if (lower.startsWith('order') && lower.length >= 5) {
    return RECENT_ORDERS.slice(0, 5).map(o => ({
      label: o.id,
      insertValue: `@order:${o.id}`,
      category: 'Order',
      meta: `${o.waveId} · ${o.status}`,
    }))
  }

  if (lower.startsWith('dock') && lower.length >= 4) {
    return DOCK_VALUES.map(d => ({
      label: d,
      insertValue: `@dock:${d.replace(/\s+/g, '-')}`,
      category: 'Dock',
      meta: 'Dock assignment',
    }))
  }

  if (lower.startsWith('container') && lower.length >= 9) {
    return CONTAINERS_BY_AGE.slice(0, 5).map(c => ({
      label: c.id,
      insertValue: `@container:${c.id}`,
      category: 'Container',
      meta: `${c.supplier} · ${c.ageInYard}d`,
    }))
  }

  if (lower.startsWith('picker') && lower.length >= 6) {
    return PICKER_NAMES.slice(0, 8).map(p => ({
      label: p.name,
      insertValue: `@picker:${p.id}`,
      category: 'Picker',
      meta: p.zone,
    }))
  }

  // Partial match on category names
  return CATEGORIES.filter(c => c.label.toLowerCase().includes('@' + lower))
}

// ─── Response Builders ────────────────────────────────────────────────────────
function buildDockWorkersResponse() {
  return {
    type: 'dock-workers',
    title: 'Dock Workers On Shift',
    icon: 'users',
    summary: `${DOCK_WORKERS.filter(w => w.checkedIn).length} of ${DOCK_WORKERS.length} workers checked in`,
    workers: DOCK_WORKERS,
  }
}

function buildContainerAgeResponse() {
  const top = CONTAINERS_BY_AGE.slice(0, 8)
  return {
    type: 'container-age',
    title: 'Containers by Age in Yard',
    icon: 'clock',
    summary: `Oldest: ${top[0]?.ageInYard ?? 0} days — ${top[0]?.id ?? '—'}`,
    containers: top,
  }
}

function buildYardContainersResponse() {
  const urgent = CONTAINERS_ALL.filter(c => c.priority === 'urgent').length
  return {
    type: 'yard-containers',
    title: 'Yard Container Overview',
    icon: 'package',
    summary: `${CONTAINERS_ALL.length} total containers · ${urgent} urgent`,
    total: CONTAINERS_ALL.length,
    urgent,
    containers: CONTAINERS_BY_AGE.slice(0, 8),
  }
}

function buildSuppliersResponse() {
  return {
    type: 'suppliers',
    title: 'Supplier Container Counts',
    icon: 'bar-chart',
    summary: `${SUPPLIERS_LIST.length} active suppliers in yard`,
    suppliers: SUPPLIERS_LIST.slice(0, 10),
    maxCount: SUPPLIERS_LIST[0]?.count ?? 1,
  }
}

function buildWaveResponse(waveId) {
  const waves = waveId ? WAVES.filter(w => w.id === waveId) : WAVES
  return {
    type: 'wave-status',
    title: waveId ? `Wave Status — ${waveId}` : 'All Wave Status',
    icon: 'zap',
    summary: `${waves.length} wave${waves.length !== 1 ? 's' : ''} in current shift`,
    waves,
  }
}

function buildLaborResponse() {
  const zones = LABOR_PERIOD_DATA.shift.zones
  const rows = Object.entries(zones).map(([zone, data]) => ({
    zone,
    ...data,
    surplus: data.capacity - data.estimated,
    config: ZONE_CONFIG[zone],
  }))
  return {
    type: 'labor',
    title: 'Labor by Zone — Current Shift',
    icon: 'users',
    summary: `${Object.keys(zones).length} zones · ${LABOR_PERIOD_DATA.shift.sublabel}`,
    rows,
  }
}

function buildDelaysResponse() {
  return {
    type: 'delays',
    title: 'Delay Patterns Today',
    icon: 'alert',
    summary: `${ACCUMULATED_DELAY.totalDelayMinutes} min total · ${ACCUMULATED_DELAY.totalDelayedTasks} tasks affected`,
    total: ACCUMULATED_DELAY,
    zones: ACCUMULATED_DELAY.delayByZone,
    maxDelay: Math.max(...ACCUMULATED_DELAY.delayByZone.map(z => z.delaySeconds)),
  }
}

function buildThroughputResponse() {
  return {
    type: 'throughput',
    title: 'Site Throughput & Utilization',
    icon: 'trending-up',
    summary: `${SITE_STATS.todayThroughput.toLocaleString()} units processed today`,
    stats: SITE_STATS,
  }
}

function buildFallbackResponse(text) {
  return {
    type: 'fallback',
    title: 'Query understood',
    icon: 'search',
    summary: null,
    text,
    hints: [
      'Ask about containers in the yard',
      'Ask about labor and shift staffing',
      'Ask about wave status or delays',
    ],
  }
}

function matchQuery(text) {
  const t = text.toLowerCase()
  const waveMatch = text.match(/@wave:(WAVE-\d+)/i)
  if (waveMatch) return buildWaveResponse(waveMatch[1].toUpperCase())
  if (/dock|receiving|who.*work|work.*dock/.test(t)) return buildDockWorkersResponse()
  if (/how long|waiting|age|oldest/.test(t)) return buildContainerAgeResponse()
  if (/container.*yard|yard.*container|how many container/.test(t)) return buildYardContainersResponse()
  if (/supplier|vendor/.test(t)) return buildSuppliersResponse()
  if (/wave|adidas|nike|b2b/.test(t)) return buildWaveResponse(null)
  if (/labor|shift|roster|staff|zone.*worker/.test(t)) return buildLaborResponse()
  if (/delay|slow|behind|bottleneck/.test(t)) return buildDelaysResponse()
  if (/throughput|utilization|stat|performance/.test(t)) return buildThroughputResponse()
  return buildFallbackResponse(text)
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function AgeBadge({ days }) {
  if (days >= 7) return <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">{days}d</span>
  if (days >= 3) return <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">{days}d</span>
  return <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">{days}d</span>
}

function PriorityBadge({ priority }) {
  const map = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    normal: 'bg-slate-100 text-slate-600',
    low: 'bg-slate-100 text-slate-400',
  }
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${map[priority] ?? map.normal}`}>
      {priority}
    </span>
  )
}

function ResponseCard({ icon, title, summary, children }) {
  const ICONS = {
    users: Users,
    package: Package,
    clock: Clock,
    'bar-chart': BarChart2,
    zap: Zap,
    alert: AlertTriangle,
    'trending-up': TrendingUp,
    search: Search,
  }
  const Icon = ICONS[icon] ?? MessageSquare
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl">
      <div className="flex items-start gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={14} className="text-blue-600" />
        </div>
        <div>
          <div className="font-semibold text-slate-800 text-sm">{title}</div>
          {summary && <div className="text-xs text-slate-500 mt-0.5">{summary}</div>}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function DockWorkersTable({ data }) {
  const checkedIn = data.workers.filter(w => w.checkedIn)
  const notIn = data.workers.filter(w => !w.checkedIn)
  return (
    <ResponseCard icon={data.icon} title={data.title} summary={data.summary}>
      <div className="space-y-1">
        {[...checkedIn, ...notIn].map(w => (
          <div key={w.id} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${w.checkedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
              {w.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-800 truncate">{w.name}</div>
              <div className="text-xs text-slate-400">{w.role} · {w.assignedZone}</div>
            </div>
            {w.checkedIn ? (
              <div className="text-right flex-shrink-0">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-medium">In</span>
                <span className="text-xs text-slate-400 ml-1.5">{w.checkInTime}</span>
              </div>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 text-xs">Out</span>
            )}
          </div>
        ))}
      </div>
    </ResponseCard>
  )
}

function ContainerTable({ containers, title, icon, summary }) {
  return (
    <ResponseCard icon={icon} title={title} summary={summary}>
      <div className="space-y-1">
        {containers.map(c => (
          <div key={c.id} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
            <div className="font-mono text-xs text-slate-600 w-20 flex-shrink-0">{c.id}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-700 truncate">{c.supplier}</div>
              <div className="text-xs text-slate-400">{c.dockAssigned ?? 'No dock'}</div>
            </div>
            <AgeBadge days={c.ageInYard} />
            <PriorityBadge priority={c.priority} />
          </div>
        ))}
      </div>
    </ResponseCard>
  )
}

function YardContainersCard({ data }) {
  return (
    <ResponseCard icon={data.icon} title={data.title} summary={data.summary}>
      <div className="flex gap-3 mb-3">
        <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-800">{data.total}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total containers</div>
        </div>
        <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{data.urgent}</div>
          <div className="text-xs text-red-500 mt-0.5">Urgent priority</div>
        </div>
      </div>
      <div className="space-y-1">
        {data.containers.map(c => (
          <div key={c.id} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
            <div className="font-mono text-xs text-slate-600 w-20 flex-shrink-0">{c.id}</div>
            <div className="flex-1 min-w-0 text-sm text-slate-700 truncate">{c.supplier}</div>
            <AgeBadge days={c.ageInYard} />
            <PriorityBadge priority={c.priority} />
          </div>
        ))}
      </div>
    </ResponseCard>
  )
}

function SuppliersTable({ data }) {
  return (
    <ResponseCard icon={data.icon} title={data.title} summary={data.summary}>
      <div className="space-y-2">
        {data.suppliers.map(s => (
          <div key={s.name} className="flex items-center gap-3">
            <div className="w-28 text-sm text-slate-700 truncate flex-shrink-0">{s.name}</div>
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${(s.count / data.maxCount) * 100}%` }}
              />
            </div>
            <div className="text-sm font-semibold text-slate-600 w-8 text-right flex-shrink-0">{s.count}</div>
          </div>
        ))}
      </div>
    </ResponseCard>
  )
}

function WaveStatusCard({ data }) {
  return (
    <ResponseCard icon={data.icon} title={data.title} summary={data.summary}>
      <div className="space-y-3">
        {data.waves.map(w => {
          const pct = Math.round((w.tasksCompleted / w.totalTasks) * 100)
          return (
            <div key={w.id} className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{w.name}</div>
                  <div className="text-xs text-slate-500">{w.id}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  w.delayType === 'ahead' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {w.delayType === 'ahead' ? `${Math.abs(w.delayHours)}h ahead` : `${w.delayHours}h delay`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${w.delayType === 'ahead' ? 'bg-emerald-500' : 'bg-amber-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-24 text-right flex-shrink-0">
                  {w.tasksCompleted}/{w.totalTasks} tasks
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </ResponseCard>
  )
}

function LaborTable({ data }) {
  return (
    <ResponseCard icon={data.icon} title={data.title} summary={data.summary}>
      <div className="space-y-1.5">
        {data.rows.map(r => (
          <div key={r.zone} className="flex items-center gap-3 py-1 border-b border-slate-50 last:border-0">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: r.config?.color ?? '#94a3b8' }}
            />
            <div className="w-24 text-sm text-slate-700 flex-shrink-0">{r.zone}</div>
            <div className="flex-1 text-xs text-slate-500 truncate">{r.config?.label}</div>
            <div className="text-xs text-slate-600 flex-shrink-0">
              {r.estimated}h est · {r.done}h done
            </div>
            {r.surplus > 0 ? (
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-medium flex-shrink-0">
                +{r.surplus.toFixed(1)}h
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium flex-shrink-0">
                {r.surplus.toFixed(1)}h
              </span>
            )}
          </div>
        ))}
      </div>
    </ResponseCard>
  )
}

function DelaysCard({ data }) {
  return (
    <ResponseCard icon={data.icon} title={data.title} summary={data.summary}>
      <div className="flex gap-3 mb-3">
        <div className="flex-1 bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">{data.total.totalDelayMinutes}</div>
          <div className="text-xs text-orange-500 mt-0.5">Total delay (min)</div>
        </div>
        <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-800">{data.total.totalDelayedTasks}</div>
          <div className="text-xs text-slate-500 mt-0.5">Tasks affected</div>
        </div>
        <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-800">{data.total.avgDelayPerTask}s</div>
          <div className="text-xs text-slate-500 mt-0.5">Avg delay/task</div>
        </div>
      </div>
      <div className="space-y-2">
        {data.zones.map(z => (
          <div key={z.zone} className="flex items-center gap-3">
            <div className="w-32 text-sm text-slate-700 truncate flex-shrink-0">{z.zone}</div>
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full"
                style={{ width: `${(z.delaySeconds / data.maxDelay) * 100}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 w-20 text-right flex-shrink-0">
              {Math.round(z.delaySeconds / 60)}m · {z.taskCount} tasks
            </div>
          </div>
        ))}
      </div>
    </ResponseCard>
  )
}

function ThroughputCard({ data }) {
  const s = data.stats
  const cells = [
    { label: 'Units Processed', value: s.todayThroughput.toLocaleString(), sub: 'today' },
    { label: 'Dock Utilization', value: `${s.dockUtilization}%`, sub: 'current' },
    { label: 'Active Teams', value: s.activeTeams, sub: 'on shift' },
    { label: 'Pending Containers', value: s.pendingContainers, sub: 'in yard' },
    { label: 'SLA Risk', value: s.slaRiskCount, sub: 'orders', warn: s.slaRiskCount > 0 },
    { label: 'Avg Cycle Time', value: `${s.avgCycleTimeHours}h`, sub: 'per container' },
  ]
  return (
    <ResponseCard icon={data.icon} title={data.title} summary={data.summary}>
      <div className="grid grid-cols-3 gap-2">
        {cells.map(c => (
          <div key={c.label} className={`rounded-lg p-3 ${c.warn ? 'bg-red-50' : 'bg-slate-50'}`}>
            <div className={`text-xl font-bold ${c.warn ? 'text-red-600' : 'text-slate-800'}`}>{c.value}</div>
            <div className="text-xs text-slate-500 mt-0.5 leading-tight">{c.label}</div>
            <div className="text-xs text-slate-400">{c.sub}</div>
          </div>
        ))}
      </div>
    </ResponseCard>
  )
}

function FallbackCard({ data }) {
  return (
    <ResponseCard icon={data.icon} title={data.title} summary={data.summary}>
      <p className="text-sm text-slate-500 mb-3">
        I couldn&apos;t find an exact match for your query. Try one of these:
      </p>
      <div className="flex flex-wrap gap-2">
        {data.hints.map(h => (
          <span key={h} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs border border-slate-200">
            {h}
          </span>
        ))}
      </div>
    </ResponseCard>
  )
}

function renderResponse(response) {
  switch (response.type) {
    case 'dock-workers': return <DockWorkersTable data={response} />
    case 'container-age': return <ContainerTable containers={response.containers} title={response.title} icon={response.icon} summary={response.summary} />
    case 'yard-containers': return <YardContainersCard data={response} />
    case 'suppliers': return <SuppliersTable data={response} />
    case 'wave-status': return <WaveStatusCard data={response} />
    case 'labor': return <LaborTable data={response} />
    case 'delays': return <DelaysCard data={response} />
    case 'throughput': return <ThroughputCard data={response} />
    case 'fallback': return <FallbackCard data={response} />
    default: return null
  }
}

// ─── Category Section for Sidebar ────────────────────────────────────────────
function CategorySection({ cat, isOpen, onToggle, onQuestion }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-colors"
      >
        {cat.category}
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {isOpen && (
        <div className="px-2 pb-2 space-y-0.5">
          {cat.questions.map(q => (
            <button
              key={q}
              onClick={() => onQuestion(q)}
              className="w-full text-left text-xs text-slate-600 px-2 py-1.5 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors leading-snug"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Thinking Indicator ───────────────────────────────────────────────────────
function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <MessageSquare size={13} className="text-white" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onQuestion }) {
  const examples = [
    'What containers have been in the yard longest?',
    'Who is working the dock right now?',
    'Show me the status of all waves',
  ]
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <MessageSquare size={48} className="text-slate-200 mb-4" />
      <h3 className="text-slate-600 font-semibold text-lg mb-1">Ask anything about your warehouse</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-sm">
        Ask about containers, workers, waves, delays, or performance. Use <span className="font-mono bg-slate-100 px-1 rounded">@</span> to scope to specific entities.
      </p>
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {examples.map(q => (
          <button
            key={q}
            onClick={() => onQuestion(q)}
            className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 text-sm hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NLQueryScreen() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [openCats, setOpenCats] = useState(['yard', 'labor', 'workload', 'performance'])
  const [mentionSuggestions, setMentionSuggestions] = useState([])
  const [mentionToken, setMentionToken] = useState(null) // { start, end }

  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)
  const dropdownRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  // Textarea auto-grow
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 96) + 'px'
  }, [inputText])

  // Dismiss dropdown on outside click
  useEffect(() => {
    function handleMouseDown(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMentionSuggestions([])
        setMentionToken(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const submitQuery = useCallback((text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const now = new Date()
    const ts = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

    const userMsg = { id: Date.now(), role: 'user', text: trimmed, response: null, timestamp: ts }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setMentionSuggestions([])
    setMentionToken(null)
    setIsThinking(true)

    setTimeout(() => {
      const response = matchQuery(trimmed)
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: null,
        response,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      }
      setIsThinking(false)
      setMessages(prev => [...prev, assistantMsg])
    }, 300 + Math.random() * 500)
  }, [])

  function handleInputChange(e) {
    const val = e.target.value
    setInputText(val)

    // Detect @ mention
    const cursor = e.target.selectionStart
    const before = val.slice(0, cursor)
    const match = before.match(/@(\S*)$/)
    if (match) {
      const afterAt = match[1]
      const tokenStart = before.length - match[0].length
      setMentionToken({ start: tokenStart, end: cursor })
      setMentionSuggestions(getMentionSuggestions(afterAt))
    } else {
      setMentionSuggestions([])
      setMentionToken(null)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setMentionSuggestions([])
      setMentionToken(null)
      return
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputText.trim()) submitQuery(inputText)
    }
  }

  function selectMention(suggestion) {
    if (!mentionToken) return
    const before = inputText.slice(0, mentionToken.start)
    const after = inputText.slice(mentionToken.end)
    const newVal = before + suggestion.insertValue + ' ' + after
    setInputText(newVal)
    setMentionSuggestions([])
    setMentionToken(null)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  function toggleCat(id) {
    setOpenCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const hasSuggestions = mentionSuggestions.length > 0

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-50">
      {/* Main column */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Screen header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-800">Natural Language Queries</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ask questions in plain English · Use <span className="font-mono bg-slate-100 px-1 rounded text-slate-600">@</span> to scope to specific waves, orders, docks, containers, or pickers
          </p>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 && !isThinking ? (
            <EmptyState onQuestion={submitQuery} />
          ) : (
            <div className="space-y-4 max-w-2xl">
              {messages.map(msg => (
                <div key={msg.id}>
                  {msg.role === 'user' ? (
                    <div className="flex justify-end mb-1">
                      <div className="max-w-md">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-sm text-sm leading-relaxed">
                          {msg.text}
                        </div>
                        <div className="text-right text-xs text-slate-400 mt-1 pr-1">{msg.timestamp}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <MessageSquare size={13} className="text-white" />
                      </div>
                      <div>
                        {renderResponse(msg.response)}
                        <div className="text-xs text-slate-400 mt-1 pl-1">{msg.timestamp}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isThinking && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 border-t border-slate-200 bg-white px-4 py-3 relative">
          {/* Mention dropdown */}
          {hasSuggestions && (
            <div
              ref={dropdownRef}
              className="absolute bottom-full left-4 right-4 mb-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 max-h-52 overflow-y-auto"
            >
              {mentionSuggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => { e.preventDefault(); selectMention(s) }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 text-left transition-colors"
                >
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{s.category}</span>
                  <span className="text-sm text-slate-800 font-medium flex-1">{s.label}</span>
                  {s.meta && <span className="text-xs text-slate-400">{s.meta}</span>}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask about containers, workers, waves, delays… (@ to mention)"
              className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
              style={{ maxHeight: '96px' }}
            />
            <button
              onClick={() => submitQuery(inputText)}
              disabled={!inputText.trim() || isThinking}
              className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
          <div className="text-xs text-slate-400 mt-1.5 px-1">
            Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">Shift+Enter</kbd> for new line
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Questions</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {QUESTION_LIBRARY.map(cat => (
            <CategorySection
              key={cat.id}
              cat={cat}
              isOpen={openCats.includes(cat.id)}
              onToggle={() => toggleCat(cat.id)}
              onQuestion={submitQuery}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
