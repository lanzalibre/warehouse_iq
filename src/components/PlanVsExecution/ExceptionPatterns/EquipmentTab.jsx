import { useState, useMemo } from 'react'
import {
  Clock, Activity, Layers, Cog, AlertTriangle,
  Filter, ChevronRight, ChevronDown, EyeOff, Wrench,
  Zap, Package, User, Route,
} from 'lucide-react'
import { DELAY_PATTERNS, ZONE_CONFIG } from '../../../mockData.js'

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

// ─── Resolution Badge ─────────────────────────────────────────────────────────────
function ResolutionBadge({ resolution }) {
  if (resolution === 'ignored') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
        <EyeOff size={9} />
        Ignored
      </span>
    )
  }
  if (resolution === 'fixed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
        <Wrench size={9} />
        Fixed
      </span>
    )
  }
  return null
}

const fmtMin = (seconds) =>
  `${Math.floor(seconds / 60)}m ${seconds % 60}s`

// ─── Delay Card ──────────────────────────────────────────────────────────────────
function DelayCard({ item, selected, onToggleSelect, isExpanded, onToggle, resolution, onResolve }) {
  const delayPercent = item.delayPercent
  const isCritical = delayPercent >= 45
  const isHigh = delayPercent >= 35
  const isResolved = resolution != null

  return (
    <div className={`border-2 rounded-xl mb-3 transition-all overflow-hidden ${
      selected && !isResolved ? 'ring-2 ring-blue-500 ring-offset-1' : ''
    } ${
      isResolved
        ? 'bg-slate-50 border-slate-200 opacity-60'
        : isCritical
          ? 'bg-red-50/50 border-red-300'
          : isHigh
            ? 'bg-amber-50/50 border-amber-300'
            : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          {!isResolved && (
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
            />
          )}
          {isResolved && <div className="w-4" />}

          {/* Expand button */}
          <button onClick={onToggle} className="flex-shrink-0">
            {isExpanded
              ? <ChevronDown size={16} className="text-slate-400" />
              : <ChevronRight size={16} className="text-slate-400" />}
          </button>

          {/* Type icon */}
          <div className="flex-shrink-0">
            <TypeIcon type={item.type} />
          </div>

          {/* Name + accumulated stats */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">{item.name}</span>
              {item.type === 'zone' && ZONE_CONFIG[item.name] && (
                <div className={`w-2 h-2 rounded-full ${ZONE_CONFIG[item.name].dotClass}`} />
              )}
              {isResolved && <ResolutionBadge resolution={resolution} />}
            </div>
            <div className="text-xs text-slate-500">
              {item.taskCount} picker routes delayed &gt;30% over expected
            </div>

            {/* Accumulated stats — only shown for active items */}
            {!isResolved && item.accumulated && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="bg-slate-50 rounded p-2">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wide">Shift so far</div>
                  <div className="text-xs font-semibold text-slate-700">
                    {fmtMin(item.accumulated.shift.delayedSeconds)} / {item.accumulated.shift.tasksAffected} tasks
                  </div>
                </div>
                <div className="bg-amber-50 rounded p-2">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wide">End-of-shift est.</div>
                  <div className="text-xs font-semibold text-amber-700">
                    {fmtMin(item.accumulated.projectedEndOfShift.delayedSeconds)} / {item.accumulated.projectedEndOfShift.tasksAffected} tasks
                  </div>
                </div>
                <div className="bg-red-50 rounded p-2">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wide">End-of-day est.</div>
                  <div className="text-xs font-semibold text-red-700">
                    {fmtMin(item.accumulated.projectedEndOfDay.delayedSeconds)} / {item.accumulated.projectedEndOfDay.tasksAffected} tasks
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delay percent */}
          <div className="flex-shrink-0 text-center w-20">
            <div className={`text-lg font-black ${
              isResolved ? 'text-slate-400' : isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-blue-600'
            }`}>
              +{delayPercent}%
            </div>
            <div className="text-[10px] text-slate-500">over plan</div>
          </div>

          {/* Avg delay */}
          <div className="flex-shrink-0 text-center w-24">
            <div className="text-sm font-bold text-slate-700">
              {Math.floor(item.avgDelaySeconds / 60)}:{(item.avgDelaySeconds % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-500">avg delay</div>
          </div>

          {/* Service risk */}
          <div className="flex-shrink-0">
            {isResolved
              ? <span className="text-[10px] text-slate-400 italic">resolved</span>
              : <ServiceRiskBadge risk={item.wmsContext.serviceRisk} />}
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
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-slate-400" />
                <span className="text-xs text-slate-500">Impact:</span>
                <span className="text-xs font-medium text-slate-700">{item.wesContext.impact}</span>
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

          {/* Affected Picker Routes */}
          {item.affectedPickerRoutes && item.affectedPickerRoutes.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Route size={14} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Affected Picker Routes — delayed &gt;30% over expected arrival
                </span>
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase">Picker</th>
                      <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase">Route ID</th>
                      <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase">Planned Stop</th>
                      <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase">Actual Arrival</th>
                      <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase">Delay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.affectedPickerRoutes.map((route, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <User size={10} className="text-slate-400" />
                            <span className="font-medium text-slate-700">{route.picker}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-500">{route.routeId}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{route.plannedStopTime}</td>
                        <td className="px-3 py-2 font-mono text-amber-700 font-semibold">{route.actualArrival}</td>
                        <td className="px-3 py-2">
                          <span className="font-semibold text-red-600">+{fmtMin(route.delaySeconds)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SLA alert for critical items */}
          {(isCritical || item.wmsContext.serviceRisk === 'critical') && !isResolved && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-red-700 mb-1">SLA Risk Detected</div>
                <p className="text-xs text-red-700">
                  This {item.type} is causing critical delays for fast-moving SKUs.
                  Immediate action recommended to prevent order fulfillment SLA breaches.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!isResolved && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => onResolve(item.id, 'ignored')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <EyeOff size={12} />
                Ignore
              </button>
              <button
                onClick={() => onResolve(item.id, 'fixed')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
              >
                <Wrench size={12} />
                Fixed
              </button>
            </div>
          )}
          {isResolved && (
            <div className="mt-3">
              <button
                onClick={() => onResolve(item.id, null)}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Undo resolution
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Equipment Tab Component ─────────────────────────────────────────────────────
export default function EquipmentTab() {
  const [filter, setFilter] = useState('all')
  const [expandedItem, setExpandedItem] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  // resolution: Map<itemId, 'ignored' | 'fixed' | null>
  const [resolutions, setResolutions] = useState({})

  const allItems = [
    ...DELAY_PATTERNS.zones.map(z => ({ ...z, category: 'Zones' })),
    ...DELAY_PATTERNS.equipment.map(e => ({ ...e, category: 'Equipment' })),
  ]

  const filteredItems = filter === 'all'
    ? allItems
    : filter === 'zone'
      ? DELAY_PATTERNS.zones.map(z => ({ ...z, category: 'Zones' }))
      : DELAY_PATTERNS.equipment.map(e => ({ ...e, category: 'Equipment' }))

  // Active items (not ignored/fixed) for accumulated totals
  const activeItems = useMemo(() =>
    allItems.filter(i => !resolutions[i.id]),
    [resolutions]
  )

  // Dynamic accumulated totals (excludes ignored/fixed)
  const dynamicShiftTotal = useMemo(() =>
    activeItems.reduce((sum, i) => sum + (i.accumulated?.shift.delayedSeconds ?? 0), 0),
    [activeItems]
  )
  const dynamicShiftTasks = useMemo(() =>
    activeItems.reduce((sum, i) => sum + (i.accumulated?.shift.tasksAffected ?? 0), 0),
    [activeItems]
  )
  const dynamicProjectedEndOfShift = useMemo(() =>
    activeItems.reduce((sum, i) => sum + (i.accumulated?.projectedEndOfShift.delayedSeconds ?? 0), 0),
    [activeItems]
  )
  const dynamicProjectedEOD = useMemo(() =>
    activeItems.reduce((sum, i) => sum + (i.accumulated?.projectedEndOfDay.delayedSeconds ?? 0), 0),
    [activeItems]
  )

  const criticalCount = allItems.filter(i => i.delayPercent >= 45 && !resolutions[i.id]).length
  const highCount = allItems.filter(i => i.delayPercent >= 35 && i.delayPercent < 45 && !resolutions[i.id]).length
  const resolvedCount = Object.values(resolutions).filter(Boolean).length

  const handleToggleSelect = (itemId) => {
    if (resolutions[itemId]) return  // can't select resolved items
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) newSet.delete(itemId)
      else newSet.add(itemId)
      return newSet
    })
  }

  const handleSelectAll = () => {
    const selectableIds = filteredItems.filter(i => !resolutions[i.id]).map(i => i.id)
    if (selectedIds.size === selectableIds.length && selectableIds.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(selectableIds))
    }
  }

  const handleResolve = (itemId, resolution) => {
    setResolutions(prev => ({ ...prev, [itemId]: resolution }))
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })
  }

  const handleBulkResolve = (resolution) => {
    const next = { ...resolutions }
    selectedIds.forEach(id => { next[id] = resolution })
    setResolutions(next)
    setSelectedIds(new Set())
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Accumulated delay summary bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-amber-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-red-600" />
            <div>
              <div className="text-sm font-bold text-slate-800">Active Accumulated Delay</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Excludes {resolvedCount} ignored/fixed pattern{resolvedCount !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-black text-red-600">
                {Math.floor(dynamicShiftTotal / 60)}:{(dynamicShiftTotal % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-600 font-medium">Shift so far ({dynamicShiftTasks} tasks)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {Math.floor(dynamicProjectedEndOfShift / 60)}:{(dynamicProjectedEndOfShift % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-600 font-medium">Est. end-of-shift</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">
                {Math.floor(dynamicProjectedEOD / 60)}:{(dynamicProjectedEOD % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-600 font-medium">Est. end-of-day</div>
            </div>
          </div>
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
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800"
          >
            <input
              type="checkbox"
              checked={
                selectedIds.size > 0 &&
                selectedIds.size === filteredItems.filter(i => !resolutions[i.id]).length
              }
              readOnly
              className="w-4 h-4 rounded border-slate-300 text-blue-500"
            />
            Select All Active
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-700">
              {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkResolve('ignored')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
              >
                <EyeOff size={12} />
                Ignore Selected
              </button>
              <button
                onClick={() => handleBulkResolve('fixed')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
              >
                <Wrench size={12} />
                Mark Fixed
              </button>
            </div>
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
              selected={selectedIds.has(item.id)}
              onToggleSelect={() => handleToggleSelect(item.id)}
              isExpanded={expandedItem === item.id}
              onToggle={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              resolution={resolutions[item.id] || null}
              onResolve={handleResolve}
            />
          ))
        )}
      </div>

      {/* Stats footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-6">
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
          {resolvedCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-600">
                Resolved (excluded): <span className="font-semibold text-slate-800">{resolvedCount}</span>
              </span>
            </div>
          )}
          <div className="ml-auto text-xs text-slate-500">
            Threshold: &gt;30% over expected time
          </div>
        </div>
      </div>
    </div>
  )
}
