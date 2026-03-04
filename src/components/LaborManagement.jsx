import { useState } from 'react'
import {
  Users, Clock, AlertTriangle,
  ArrowRight, UserCheck, TrendingUp, Scale,
  Star, Info, Zap, BarChart3, X, ArrowLeft, Activity,
} from 'lucide-react'
import {
  WORKERS, ZONE_CONFIG, LABOR_PERIOD_DATA, REBALANCING_RECS,
  getExperienceLevel, DC_MANAGER_DATA,
} from '../mockData.js'

const inboundData = DC_MANAGER_DATA.contributorDetail.inboundVariability
const maxLaborHours = Math.max(
  ...inboundData.chartData.map(r => Math.max(r.laborHours.planned, r.laborHours.actual ?? 0))
)

// ─── Helpers ───────────────────────────────────────────────────────────────────
const ZONES_ORDER = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Crossdock']

function workersByZone() {
  const map = {}
  ZONES_ORDER.forEach(z => { map[z] = [] })
  WORKERS.forEach(w => {
    if (map[w.assignedZone]) map[w.assignedZone].push(w)
  })
  return map
}

function calcSurplus(data) {
  const remaining = data.estimated - data.done
  return +(data.capacity - remaining).toFixed(1)
}

// ─── Experience Dots ───────────────────────────────────────────────────────────
function ExperienceDots({ months, showLabel = false }) {
  const { dots, label, color } = getExperienceLevel(months)
  return (
    <span className="flex items-center gap-1">
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i <= dots ? 'bg-current' : 'bg-slate-200'} ${color}`}
          />
        ))}
      </span>
      {showLabel && <span className={`text-xs font-medium ${color}`}>{label}</span>}
      {months > 0 && <span className="text-xs text-slate-400">{months} mo.</span>}
    </span>
  )
}

// ─── Zone Summary Panel (left column) ─────────────────────────────────────────
function ZoneSummaryPanel({ expandedZone, onExpand }) {
  const byZone = workersByZone()
  const totalIn = WORKERS.filter(w => w.checkedIn).length

  return (
    <div className="w-56 flex-shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-slate-800">Shift Roster</span>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-black tabular-nums ${totalIn < WORKERS.length ? 'text-amber-600' : 'text-emerald-600'}`}>
              {totalIn}
            </span>
            <span className="text-sm text-slate-400">/ {WORKERS.length}</span>
            <UserCheck size={14} className="text-slate-400 ml-1" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={11} />
          <span>06:00 – 14:00</span>
        </div>
        <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${(totalIn / WORKERS.length) * 100}%` }}
          />
        </div>
        <div className="mt-1 text-[10px] text-slate-400">
          {WORKERS.length - totalIn} not checked in · Double-click zone to expand
        </div>
      </div>

      {/* Zone summary cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {ZONES_ORDER.map(zone => {
          const workers = byZone[zone] || []
          if (workers.length === 0) return null
          const cfg = ZONE_CONFIG[zone]
          const inCount = workers.filter(w => w.checkedIn).length
          const isCritical = inCount === 0
          const isExpanded = expandedZone === zone

          return (
            <div
              key={zone}
              onDoubleClick={() => onExpand(isExpanded ? null : zone)}
              className={`rounded-xl border-2 p-3 cursor-pointer transition-all select-none ${
                isExpanded
                  ? 'border-blue-400 bg-blue-50'
                  : isCritical
                  ? 'border-red-300 bg-red-50 hover:border-red-400'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                  <span className={`text-xs font-bold ${
                    isCritical ? 'text-red-700' : isExpanded ? 'text-blue-700' : 'text-slate-700'
                  }`}>
                    {zone}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {isCritical && <AlertTriangle size={10} className="text-red-500" />}
                  <span className={`text-xs font-bold ${
                    isCritical ? 'text-red-600'
                    : inCount === workers.length ? 'text-emerald-600'
                    : 'text-amber-600'
                  }`}>
                    {inCount}/{workers.length}
                  </span>
                </div>
              </div>

              <div className="h-1 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full ${isCritical ? 'bg-red-400' : 'bg-emerald-400'}`}
                  style={{ width: `${(inCount / workers.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{cfg.label}</span>
                {isCritical
                  ? <span className="text-[10px] font-bold text-red-600">0 h capacity</span>
                  : <span className="text-[10px] text-slate-400">{Math.round((inCount / workers.length) * 100)}%</span>
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Zone Detail Panel (middle column, shown on double-click) ─────────────────
function ZoneDetailPanel({ zone, onClose }) {
  const byZone = workersByZone()
  const workers = byZone[zone] || []
  const cfg = ZONE_CONFIG[zone]
  const inCount = workers.filter(w => w.checkedIn).length
  const isCritical = inCount === 0

  // Checked-in first (sorted by zone exp desc), then not-checked-in (sorted by zone exp desc)
  const sorted = [...workers].sort((a, b) => {
    if (a.checkedIn !== b.checkedIn) return Number(b.checkedIn) - Number(a.checkedIn)
    return (b.experience[zone] || 0) - (a.experience[zone] || 0)
  })

  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.dotClass}`} />
            <span className="text-sm font-bold text-slate-800">{zone}</span>
            {isCritical && <AlertTriangle size={12} className="text-red-500" />}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
          >
            <X size={14} />
          </button>
        </div>
        <div className={`text-xs ${isCritical ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
          {isCritical
            ? `0 of ${workers.length} checked in — 0 h capacity`
            : `${inCount} of ${workers.length} checked in · ${cfg.label}`
          }
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sorted.map(w => {
          const expMonths = w.experience[zone] || 0
          return (
            <div key={w.id} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border ${
              w.checkedIn ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                w.checkedIn ? `${cfg.barClass} text-white` : 'bg-slate-200 text-slate-400'
              }`}>
                {w.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold truncate ${w.checkedIn ? 'text-slate-800' : 'text-slate-400'}`}>
                  {w.name}
                </div>
                <ExperienceDots months={expMonths} />
              </div>
              <div className="flex-shrink-0">
                {w.checkedIn
                  ? <span className="text-[10px] font-mono text-emerald-600">{w.checkInTime}</span>
                  : <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded">OUT</span>
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Dual workload / capacity bar row ──────────────────────────────────────────
function ZoneChartRow({ zone, data, globalMax, isTotal = false }) {
  const cfg = isTotal ? null : ZONE_CONFIG[zone]
  const surplus = calcSurplus(data)
  const isDeficit = surplus < 0

  const estimatedW = Math.min((data.estimated / globalMax) * 100, 100)
  const doneW      = data.estimated > 0 ? (data.done / data.estimated) * estimatedW : 0
  const capacityW  = Math.min((data.capacity / globalMax) * 100, 100)

  const surplusColor = isDeficit
    ? 'bg-red-100 text-red-700 border-red-200'
    : 'bg-emerald-100 text-emerald-700 border-emerald-200'

  return (
    <div className={`mb-4 ${isTotal ? 'pb-4 border-b border-slate-200' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {cfg && <div className={`w-2.5 h-2.5 rounded-full ${cfg.dotClass}`} />}
          <span className={`text-sm font-${isTotal ? 'bold' : 'semibold'} ${isTotal ? 'text-slate-900' : 'text-slate-700'}`}>
            {isTotal ? 'All Zones — Total' : zone}
          </span>
          {cfg && <span className="text-xs text-slate-400">{cfg.label}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${surplusColor}`}>
            {isDeficit ? '' : '+'}{surplus} h
          </span>
          {isDeficit && (
            <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <AlertTriangle size={9} />
              DEFICIT
            </span>
          )}
        </div>
      </div>

      {/* Workload row */}
      <div className="flex items-center gap-3 mb-1.5">
        <span className="text-[11px] text-slate-400 w-16 flex-shrink-0 text-right">Workload</span>
        <div className="flex-1 relative h-5 bg-slate-100 rounded-md overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-slate-300 rounded-md transition-all duration-500"
            style={{ width: `${estimatedW}%` }}
          />
          <div
            className={`absolute left-0 top-0 h-full rounded-md transition-all duration-500 ${cfg ? cfg.barClass : 'bg-blue-500'}`}
            style={{ width: `${doneW}%` }}
          />
          <div className="absolute inset-0 flex items-center px-2 gap-1">
            <span className="text-[11px] font-semibold text-slate-700 select-none">
              {data.done} h done
            </span>
            <span className="text-[11px] text-slate-500 select-none">
              / {data.estimated} h est.
            </span>
          </div>
        </div>
      </div>

      {/* Capacity row */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-slate-400 w-16 flex-shrink-0 text-right">Capacity</span>
        <div className="flex-1 relative h-5 bg-slate-100 rounded-md overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full rounded-md transition-all duration-500 ${
              isDeficit ? 'bg-red-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${capacityW}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-slate-500 opacity-40"
            style={{ left: `${estimatedW}%` }}
          />
          <div className="absolute inset-0 flex items-center px-2">
            <span className="text-[11px] font-semibold text-slate-700 select-none">
              {data.capacity % 1 === 0 ? data.capacity : data.capacity.toFixed(1)} h available
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Recommendation Card ───────────────────────────────────────────────────────
function RecommendationCard({ rec }) {
  // All checked-in workers from fromZone, sorted by toZone experience desc
  const candidates = WORKERS
    .filter(w => w.checkedIn && w.assignedZone === rec.fromZone)
    .sort((a, b) => (b.experience[rec.toZone] || 0) - (a.experience[rec.toZone] || 0))

  // AI-recommended worker pinned to top
  const aiIdx = candidates.findIndex(w => w.id === rec.workerId)
  const sortedCandidates = aiIdx > 0
    ? [candidates[aiIdx], ...candidates.filter((_, i) => i !== aiIdx)]
    : candidates

  const [selectedId, setSelectedId] = useState(rec.workerId)
  const selectedWorker = WORKERS.find(w => w.id === selectedId) || sortedCandidates[0]
  const expMonths = selectedWorker ? (selectedWorker.experience[rec.toZone] || 0) : 0

  const fromCfg = ZONE_CONFIG[rec.fromZone]
  const toCfg   = ZONE_CONFIG[rec.toZone]

  const priorityConfig = rec.priority === 'critical'
    ? { bg: 'bg-red-50 border-red-300',    badge: 'bg-red-500 text-white',    label: 'CRITICAL' }
    : { bg: 'bg-amber-50 border-amber-300', badge: 'bg-amber-500 text-white', label: 'HIGH' }

  return (
    <div className={`border-2 rounded-xl p-4 mb-3 ${priorityConfig.bg}`}>
      {/* Title */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityConfig.badge}`}>
            {priorityConfig.label}
          </span>
          <span className="text-sm font-bold text-slate-800">
            Reassign from {rec.fromZone} to {rec.toZone}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`font-semibold px-2 py-0.5 rounded-md ${fromCfg.lightClass} ${fromCfg.textClass} border text-xs`}>
            {rec.fromZone}
          </span>
          <ArrowRight size={14} className="text-slate-400" />
          <span className={`font-semibold px-2 py-0.5 rounded-md ${toCfg.lightClass} ${toCfg.textClass} border text-xs`}>
            {rec.toZone}
          </span>
        </div>
      </div>

      {/* Worker selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-2.5 mb-3">
        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
          Associate to reassign
        </label>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2.5"
        >
          {sortedCandidates.map(w => (
            <option key={w.id} value={w.id}>
              {w.id === rec.workerId ? '★ ' : ''}{w.name} — {w.experience[rec.toZone] || 0} mo. {rec.toZone} exp.
            </option>
          ))}
        </select>

        {selectedWorker && (
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${fromCfg.barClass}`}>
              {selectedWorker.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                {selectedWorker.name}
                {selectedWorker.id === rec.workerId && (
                  <Star size={11} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-xs text-slate-500">{selectedWorker.role}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] text-slate-400 mb-0.5">Exp. in {rec.toZone}</div>
              <ExperienceDots months={expMonths} showLabel />
            </div>
          </div>
        )}
      </div>

      {/* Reasoning */}
      <p className="text-xs text-slate-600 leading-relaxed mb-2">{rec.reasoning}</p>

      {/* Impact */}
      <div className="flex items-center gap-1.5 text-xs">
        <TrendingUp size={12} className="text-emerald-600 flex-shrink-0" />
        <span className="text-emerald-700 font-medium">{rec.impact}</span>
      </div>
    </div>
  )
}

// ─── Inbound Variability Tab ────────────────────────────────────────────────────
function InboundVariabilityTab() {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Today's Variance</div>
          <div className="text-2xl font-bold text-red-600">{inboundData.todayVariance}%</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">3-Day Avg Variance</div>
          <div className="text-2xl font-bold text-slate-800">{inboundData.avgVariance}%</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Trend</div>
          <div className="flex items-center gap-1.5 text-2xl font-bold text-amber-600">
            <TrendingUp size={20} /> Rising
          </div>
        </div>
      </div>

      {/* Workload mix */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-bold text-slate-800 mb-1">Inbound Workload Mix (%)</div>
        <p className="text-xs text-slate-400 mb-4">Volume composition by handling type across the 5-day window</p>
        <div className="space-y-3">
          {inboundData.chartData.map(row => {
            const total = row.conveyor + row.pallet + row.flat
            const conveyorPct = Math.round((row.conveyor / total) * 100)
            const palletPct = Math.round((row.pallet / total) * 100)
            const flatPct = 100 - conveyorPct - palletPct
            const isToday = row.label === 'Today'
            const isFuture = row.label === 'Tomorrow'
            return (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={isToday ? 'font-bold text-slate-800' : isFuture ? 'text-violet-600 font-semibold' : ''}>
                      {row.label}
                    </span>
                    <span className="text-slate-300">{row.dayLabel}</span>
                    {isFuture && <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-semibold">Forecast</span>}
                  </div>
                  <span className="text-slate-400">{total} units</span>
                </div>
                <div className={`h-5 rounded-full overflow-hidden flex ${isFuture ? 'opacity-60' : ''}`}>
                  <div className="bg-blue-500 h-full" style={{ width: `${conveyorPct}%` }} title={`Conveyor ${conveyorPct}%`} />
                  <div className="bg-violet-400 h-full" style={{ width: `${palletPct}%` }} title={`Pallet ${palletPct}%`} />
                  <div className="bg-slate-300 h-full" style={{ width: `${flatPct}%` }} title={`Flat ${flatPct}%`} />
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Conveyor</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block" />Pallet</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />Flat</span>
        </div>
      </div>

      {/* Labor hours */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-bold text-slate-800 mb-1">Labor Hours — Planned vs Actual</div>
        <p className="text-xs text-slate-400 mb-4">Red bars indicate hours exceeded plan — a direct driver of OTIF risk</p>
        <div className="space-y-5">
          {inboundData.chartData.map(row => {
            const isToday = row.label === 'Today'
            const isFuture = row.label === 'Tomorrow'
            const plannedW = Math.round((row.laborHours.planned / maxLaborHours) * 100)
            const actualW = row.laborHours.actual != null
              ? Math.round((row.laborHours.actual / maxLaborHours) * 100)
              : null
            const isOver = row.laborHours.actual != null && row.laborHours.actual > row.laborHours.planned

            return (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className={isToday ? 'font-bold text-slate-800' : isFuture ? 'text-violet-600 font-semibold' : ''}>
                      {row.label}
                    </span>
                    <span className="text-slate-300">{row.dayLabel}</span>
                    {isFuture && <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-semibold">Forecast</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500">Plan: <span className="font-semibold text-slate-700">{row.laborHours.planned}h</span></span>
                    {actualW != null && (
                      <span className={isOver ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                        Actual: {row.laborHours.actual}h
                        {isOver && <span className="ml-1 text-red-400">+{row.laborHours.actual - row.laborHours.planned}h</span>}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-12 text-right flex-shrink-0">Plan</span>
                    <div className="flex-1 h-4 bg-slate-100 rounded-md overflow-hidden">
                      <div className="h-full bg-blue-300 rounded-md" style={{ width: `${plannedW}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 w-8">{row.laborHours.planned}h</span>
                  </div>
                  {actualW != null && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 w-12 text-right flex-shrink-0">Actual</span>
                      <div className="flex-1 h-4 bg-slate-100 rounded-md overflow-hidden">
                        <div className={`h-full rounded-md ${isOver ? 'bg-red-400' : 'bg-emerald-400'}`} style={{ width: `${actualW}%` }} />
                      </div>
                      <span className={`text-[10px] w-8 font-semibold ${isOver ? 'text-red-500' : 'text-emerald-600'}`}>{row.laborHours.actual}h</span>
                    </div>
                  )}
                  {isFuture && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-violet-400 w-12 text-right flex-shrink-0">Fcst.</span>
                      <div className="flex-1 h-4 bg-slate-100 rounded-md overflow-hidden">
                        <div className="h-full bg-violet-300 rounded-md opacity-60" style={{ width: `${plannedW}%` }} />
                      </div>
                      <span className="text-[10px] text-violet-400 w-8">{row.laborHours.planned}h</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-300 inline-block" />Planned</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" />Actual (on plan)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-400 inline-block" />Actual (over plan)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-violet-300 inline-block" />Forecast</span>
        </div>
      </div>

      {/* Impact card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="text-sm font-semibold text-amber-800 mb-2">OTIF Risk Contribution</div>
        <div className="flex items-center gap-6">
          <div>
            <div className="text-3xl font-bold text-amber-700">{inboundData.impactPct}%</div>
            <div className="text-xs text-amber-600">of total OTIF risk</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-700">–${(inboundData.impactDollars / 1000).toFixed(0)}K</div>
            <div className="text-xs text-red-600">estimated exposure</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main View ─────────────────────────────────────────────────────────────────
export default function LaborManagement({ initialTab, onBack }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'workload')
  const [period, setPeriod] = useState('shift')
  const [expandedZone, setExpandedZone] = useState(null)
  const periodData = LABOR_PERIOD_DATA[period]

  const checkedIn = WORKERS.filter(w => w.checkedIn).length
  const totalWorkers = WORKERS.length

  const totals = ZONES_ORDER.reduce(
    (acc, z) => {
      const d = periodData.zones[z]
      return {
        estimated: acc.estimated + d.estimated,
        done:      acc.done      + d.done,
        capacity:  +(acc.capacity  + d.capacity).toFixed(1),
      }
    },
    { estimated: 0, done: 0, capacity: 0 }
  )

  const globalMax = Math.max(
    totals.estimated, totals.capacity,
    ...ZONES_ORDER.map(z => Math.max(periodData.zones[z].estimated, periodData.zones[z].capacity)),
    1
  )

  const deficitZones = ZONES_ORDER.filter(z => calcSurplus(periodData.zones[z]) < 0)

  const TABS = [
    { id: 'workload', label: 'Workload & Capacity', icon: BarChart3 },
    { id: 'inbound-variability', label: 'Inbound Variability', icon: Activity },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Back banner (when navigated from another screen) */}
      {onBack && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Plan Overview
          </button>
        </div>
      )}

      {/* Tab navigation */}
      <div className="bg-white border-b border-slate-200 px-6 pt-3 pb-0 flex items-end gap-1 flex-shrink-0">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Inbound Variability tab */}
      {activeTab === 'inbound-variability' && <InboundVariabilityTab />}

      {/* Workload tab content */}
      {activeTab === 'workload' && <>

      {/* Top stats bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-8 flex-shrink-0 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Users size={14} className="text-blue-500" />
          <span>Shift roster:</span>
          <span className="font-bold text-slate-800">{checkedIn} / {totalWorkers} checked in</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock size={14} className="text-slate-400" />
          <span>Shift:</span>
          <span className="font-semibold text-slate-800">06:00 – 14:00</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <BarChart3 size={14} className="text-amber-500" />
          <span>Remaining workload:</span>
          <span className="font-bold text-slate-800">{totals.estimated - totals.done} h</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Zap size={14} className="text-emerald-500" />
          <span>Available capacity:</span>
          <span className="font-bold text-slate-800">{totals.capacity} h</span>
        </div>
        {deficitZones.length > 0 && (
          <div className="ml-auto flex items-center gap-1.5 text-red-600 font-semibold text-xs bg-red-50 border border-red-200 rounded-full px-3 py-1">
            <AlertTriangle size={12} />
            {deficitZones.length} zone{deficitZones.length > 1 ? 's' : ''} with labor deficit
          </div>
        )}
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Zone summaries */}
        <ZoneSummaryPanel expandedZone={expandedZone} onExpand={setExpandedZone} />

        {/* Middle: Zone detail (appears on double-click) */}
        {expandedZone && (
          <ZoneDetailPanel zone={expandedZone} onClose={() => setExpandedZone(null)} />
        )}

        {/* Right: Charts + Recommendations */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Period selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600 flex-shrink-0">View period:</span>
            <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
              {Object.entries(LABOR_PERIOD_DATA).map(([key, pd]) => (
                <button
                  key={key}
                  onClick={() => setPeriod(key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    period === key
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {pd.label}
                  <span className="text-xs text-slate-400 ml-1">{pd.sublabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Workload vs Capacity Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Workload vs. Available Capacity</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gray bar = total estimated hours · Color = hours completed · Green/Red bar = labor capacity
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-2.5 rounded-sm bg-slate-300 inline-block" />
                  Estimated
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-2.5 rounded-sm bg-blue-500 inline-block" />
                  Done
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-2.5 rounded-sm bg-emerald-400 inline-block" />
                  Capacity
                </span>
              </div>
            </div>

            <ZoneChartRow zone="total" data={totals} globalMax={globalMax} isTotal />
            {ZONES_ORDER.map(zone => (
              <ZoneChartRow
                key={zone}
                zone={zone}
                data={periodData.zones[zone]}
                globalMax={globalMax}
              />
            ))}

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 pt-3 border-t border-slate-100">
              <Info size={12} />
              The thin vertical line on capacity bars marks the workload level — bars falling short of it indicate a deficit.
            </div>
          </div>

          {/* Balancing Opportunities */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-1">
              <Scale size={16} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-800">Balancing Opportunities</h2>
              <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                Based on current shift data
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Recommendations are ranked by deficit severity and target-zone experience of available associates.
            </p>

            {REBALANCING_RECS.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}

            {/* Experience legend */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2">Experience rating guide</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { months: 1,  label: '1 mo. — Beginner' },
                  { months: 8,  label: '8 mo. — Developing' },
                  { months: 18, label: '18 mo. — Proficient' },
                  { months: 28, label: '28 mo. — Senior' },
                  { months: 40, label: '36+ mo. — Expert' },
                ].map(({ months, label }) => (
                  <div key={months} className="flex items-center gap-2">
                    <ExperienceDots months={months} />
                    <span className="text-xs text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      </>}
    </div>
  )
}
