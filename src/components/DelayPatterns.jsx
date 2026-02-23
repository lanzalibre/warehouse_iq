import { useState } from 'react'
import {
  AlertTriangle, Clock, Activity, Layers, Package,
  ChevronRight, ChevronDown, TrendingUp, TrendingDown,
  Info, Zap, Gauge, Cog, ShoppingCart, Filter,
  ArrowRight, Calendar, Timer,
} from 'lucide-react'
import { DELAY_PATTERNS, DELAY_WES_RECORDS, ACCUMULATED_DELAY, ZONE_CONFIG } from '../mockData.js'

// ─── Service Risk Badge ────────────────────────────────────────────────────────────
function ServiceRiskBadge({ risk }) {
  const config = {
    'critical': { label: 'CRITICAL', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    'high': { label: 'HIGH', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    'medium': { label: 'MEDIUM', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    'low': { label: 'LOW', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  }

  const cfg = config[risk] || config['medium']

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─── Type Icon ────────────────────────────────────────────────────────────────────
function TypeIcon({ type }) {
  const config = {
    'zone': { icon: Layers, color: 'text-blue-500', label: 'Zone' },
    'equipment': { icon: Cog, color: 'text-purple-500', label: 'Equipment' },
    'order-type': { icon: ShoppingCart, color: 'text-orange-500', label: 'Order Type' },
  }

  const cfg = config[type] || config['zone']
  const Icon = cfg.icon

  return (
    <div className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </div>
  )
}

// ─── WES Record Row ────────────────────────────────────────────────────────────────
function WESRecordRow({ record }) {
  const isHighDelay = record.delayPercent >= 45

  return (
    <div className={`flex items-center gap-4 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${
      isHighDelay ? 'bg-red-50/30' : ''
    }`}>
      <div className="w-28 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-slate-500">{record.id}</span>
          {record.taskId && (
            <span className="text-[10px] text-slate-400">{record.taskId}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock size={9} className="text-slate-400" />
          <span className="text-[10px] font-mono text-slate-600">{record.timestamp}</span>
        </div>
      </div>

      <div className="w-32 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Layers size={10} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-700">{record.zone}</span>
        </div>
        <div className="text-[10px] text-slate-500 ml-5">{record.equipment}</div>
      </div>

      <div className="w-36 flex-shrink-0">
        <div className="text-xs text-slate-700">{record.orderType}</div>
      </div>

      <div className="w-20 flex-shrink-0 text-center">
        <div className="text-[10px] text-slate-500">Expected</div>
        <div className="text-xs font-mono font-semibold text-slate-600">
          {Math.floor(record.expectedTime / 60)}:{(record.expectedTime % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="w-20 flex-shrink-0 text-center">
        <div className="text-[10px] text-slate-500">Actual</div>
        <div className={`text-xs font-mono font-semibold ${isHighDelay ? 'text-red-600' : 'text-amber-600'}`}>
          {Math.floor(record.actualTime / 60)}:{(record.actualTime % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="w-24 flex-shrink-0 text-center">
        <div className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
          isHighDelay ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
        }`}>
          <TrendingUp size={10} />
          +{record.delayPercent}%
        </div>
      </div>

      <div className="flex-1 text-right">
        <div className="text-[10px] text-slate-500">Delay</div>
        <div className={`text-xs font-mono font-semibold ${isHighDelay ? 'text-red-600' : 'text-amber-600'}`}>
          {Math.floor(record.delaySeconds / 60)}:{(record.delaySeconds % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  )
}

// ─── Delay Card ────────────────────────────────────────────────────────────────────
function DelayCard({ item, type, isExpanded, onToggle }) {
  const delayPercent = item.delayPercent
  const isCritical = delayPercent >= 45
  const isHigh = delayPercent >= 35

  return (
    <div className={`border-2 rounded-xl mb-3 transition-all overflow-hidden ${
      isCritical
        ? 'bg-red-50/50 border-red-300'
        : isHigh
          ? 'bg-amber-50/50 border-amber-300'
          : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div
        onClick={onToggle}
        className="px-4 py-3 cursor-pointer hover:bg-opacity-80 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Expand button */}
          <div className="flex-shrink-0">
            {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
          </div>

          {/* Type icon */}
          <div className="flex-shrink-0">
            <TypeIcon type={item.type} />
          </div>

          {/* Name */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">{item.name}</span>
              {item.type === 'zone' && ZONE_CONFIG[item.name] && (
                <div className={`w-2 h-2 rounded-full ${ZONE_CONFIG[item.name].dotClass}`} />
              )}
            </div>
            <div className="text-xs text-slate-500">
              {item.taskCount} tasks affected
            </div>
          </div>

          {/* Delay percent */}
          <div className="flex-shrink-0 text-center w-20">
            <div className={`text-lg font-black ${
              isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-blue-600'
            }`}>
              +{delayPercent}%
            </div>
            <div className="text-[10px] text-slate-500">delay</div>
          </div>

          {/* Average delay */}
          <div className="flex-shrink-0 text-center w-24">
            <div className="text-sm font-bold text-slate-700">
              {Math.floor(item.avgDelaySeconds / 60)}:{(item.avgDelaySeconds % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-500">avg delay</div>
          </div>

          {/* Service risk */}
          <div className="flex-shrink-0">
            <ServiceRiskBadge risk={item.wmsContext.serviceRisk} />
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* WES Context */}
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-purple-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">WES Context</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle size={12} className="text-purple-600" />
                  <span className="text-xs font-bold text-purple-700">{item.wesContext.issue}</span>
                </div>
                <p className="text-xs text-purple-700">{item.wesContext.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Impact:</span>
                  <span className="text-xs font-medium text-slate-700">{item.wesContext.impact}</span>
                </div>
              </div>
            </div>

            {/* WMS Context */}
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <Package size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">WMS Context</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">SKUs Affected</span>
                  <span className="text-xs font-bold text-slate-800">{item.wmsContext.skusAffected}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Fast-Moving Orders</span>
                  <span className="text-xs font-bold text-slate-800">{item.wmsContext.fastMovingOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Service Risk</span>
                  <ServiceRiskBadge risk={item.wmsContext.serviceRisk} />
                </div>
              </div>

              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-700">{item.wmsContext.description}</p>
              </div>
            </div>
          </div>

          {/* Alert banner for critical items */}
          {(isCritical || item.wmsContext.serviceRisk === 'critical') && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-red-700 mb-1">
                  SLA Risk Detected
                </div>
                <p className="text-xs text-red-700">
                  This {item.type} is causing critical delays for fast-moving SKUs.
                  Immediate action recommended to prevent order fulfillment SLA breaches.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────────
export default function DelayPatterns() {
  const [filter, setFilter] = useState('all') // all, zone, equipment, order-type
  const [expandedItem, setExpandedItem] = useState(null)
  const [showWESRecords, setShowWESRecords] = useState(false)

  // Combine all items
  const allItems = [
    ...DELAY_PATTERNS.zones.map(z => ({ ...z, category: 'Zones' })),
    ...DELAY_PATTERNS.equipment.map(e => ({ ...e, category: 'Equipment' })),
    ...DELAY_PATTERNS.orderTypes.map(o => ({ ...o, category: 'Order Types' })),
  ]

  // Filter items
  const filteredItems = filter === 'all'
    ? allItems
    : filter === 'zone'
      ? DELAY_PATTERNS.zones
      : filter === 'equipment'
        ? DELAY_PATTERNS.equipment
        : DELAY_PATTERNS.orderTypes

  // Stats
  const criticalCount = allItems.filter(i => i.delayPercent >= 45).length
  const highCount = allItems.filter(i => i.delayPercent >= 35 && i.delayPercent < 45).length
  const criticalServiceRisk = allItems.filter(i => i.wmsContext.serviceRisk === 'critical').length

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              &gt;30% Delay Patterns
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Areas experiencing delays exceeding expected processing times
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="text-xs text-slate-500">
              Period: <span className="font-semibold text-slate-700">{DELAY_PATTERNS.period}</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-blue-500" />
            <span className="text-xs text-slate-600">
              Total Delayed Tasks: <span className="font-semibold text-slate-800">{DELAY_PATTERNS.totalDelayedTasks}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-slate-600">
              Critical (&ge;45%): <span className="font-semibold text-slate-800">{criticalCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-600">
              High (35-44%): <span className="font-semibold text-slate-800">{highCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-xs text-slate-600">
              SLA Risk: <span className="font-semibold text-slate-800">{criticalServiceRisk}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Accumulated delay bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-amber-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer size={20} className="text-red-600" />
            <div>
              <div className="text-sm font-bold text-slate-800">Total Accumulated Delay Since Day Started</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Based on {ACCUMULATED_DELAY.totalDelayedTasks} delayed tasks
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-black text-red-600">
                {Math.floor(ACCUMULATED_DELAY.totalDelayMinutes / 60)}:{(ACCUMULATED_DELAY.totalDelayMinutes % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-600 font-medium">Total Delay</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {ACCUMULATED_DELAY.avgDelayPerTask}s
              </div>
              <div className="text-xs text-slate-600 font-medium">Avg Per Task</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {ACCUMULATED_DELAY.totalDelayedTasks}
              </div>
              <div className="text-xs text-slate-600 font-medium">Delayed Tasks</div>
            </div>
          </div>
        </div>

        {/* Delay by zone breakdown */}
        <div className="mt-4 flex gap-3">
          {ACCUMULATED_DELAY.delayByZone.map((zone, idx) => (
            <div key={idx} className="flex-1 bg-white rounded-lg border border-slate-200 p-3">
              <div className="text-xs text-slate-500 mb-1">{zone.zone}</div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-800">
                    {Math.floor(zone.delaySeconds / 60)}:{(zone.delaySeconds % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-500">delay</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700">{zone.taskCount}</div>
                  <div className="text-[10px] text-slate-500">tasks</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500 mr-2">Filter by type:</span>
            <div className="flex gap-1">
              {[
                { value: 'all', label: 'All' },
                { value: 'zone', label: 'Zones' },
                { value: 'equipment', label: 'Equipment' },
                { value: 'order-type', label: 'Order Types' },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    filter === f.value
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                      : 'bg-transparent text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowWESRecords(!showWESRecords)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              showWESRecords
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity size={14} />
            {showWESRecords ? 'Hide' : 'Show'} WES Records
          </button>
        </div>
      </div>

      {/* WES Records section */}
      {showWESRecords && (
        <div className="border-b border-slate-200">
          <div className="px-6 py-3 bg-slate-50">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-purple-500" />
              <h3 className="text-sm font-semibold text-slate-700">WES Records</h3>
              <span className="text-xs text-slate-500">({DELAY_WES_RECORDS.length} records)</span>
            </div>
          </div>
          {/* Column headers */}
          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200">
            <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              <div className="w-28">Record / Task</div>
              <div className="w-32">Zone / Equipment</div>
              <div className="w-36">Order Type</div>
              <div className="w-20 text-center">Expected</div>
              <div className="w-20 text-center">Actual</div>
              <div className="w-24 text-center">Delay %</div>
              <div className="flex-1 text-right">Delay</div>
            </div>
          </div>
          {/* Records list */}
          <div className="max-h-96 overflow-y-auto">
            {DELAY_WES_RECORDS.map(record => (
              <WESRecordRow key={record.id} record={record} />
            ))}
          </div>
        </div>
      )}

      {/* Delay cards list */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Clock size={48} className="mb-3 opacity-50" />
            <p className="text-sm">No delay patterns match current filter</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <DelayCard
              key={item.id}
              item={item}
              type={filter === 'all' ? item.type : filter}
              isExpanded={expandedItem === item.id}
              onToggle={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
            />
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info size={12} />
          <span>
            Delays are calculated as percentage over expected processing time.
            Click "Show WES Records" to see detailed individual records with expected vs actual processing times.
            Click any card to view detailed WES and WMS context including impact on fast-moving SKUs and SLA risk.
          </span>
        </div>
      </div>
    </div>
  )
}
