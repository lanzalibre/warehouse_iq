import { useState, useRef, useEffect } from 'react'
import {
  AlertTriangle, CheckCircle, XCircle, Clock,
  User, MapPin, Package, Filter, ChevronDown, Info,
} from 'lucide-react'
import { PICK_TASKS_ALL, getPriorityConfig, ZONE_CONFIG } from '../../mockData.js'

// ─── Exception Badge ─────────────────────────────────────────────────────────────
function ExceptionBadge({ exceptions }) {
  if (!exceptions || exceptions.length === 0) return null

  const config = {
    'no-scan': { label: 'No Scan', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    'wrong-location': { label: 'Wrong Loc', bg: 'bg-amber-100', text: 'text-amber-700', icon: MapPin },
    'under-pick': { label: 'Under Pick', bg: 'bg-amber-100', text: 'text-amber-700', icon: Package },
    'over-pick': { label: 'Over Pick', bg: 'bg-amber-100', text: 'text-amber-700', icon: Package },
    'excessive-duration': { label: 'Slow', bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  }

  return (
    <div className="flex flex-wrap gap-1">
      {exceptions.map(exc => {
        const cfg = config[exc]
        const Icon = cfg?.icon || AlertTriangle
        return (
          <span
            key={exc}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}
          >
            <Icon size={9} />
            {cfg.label}
          </span>
        )
      })}
    </div>
  )
}

// ─── Status Indicator ─────────────────────────────────────────────────────────────
function StatusIndicator({ status }) {
  if (status === 'normal') {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600">
        <CheckCircle size={14} />
        <span className="text-xs font-semibold">Normal</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-amber-600">
      <AlertTriangle size={14} />
      <span className="text-xs font-semibold">Exception</span>
    </span>
  )
}

// ─── Time Comparison ─────────────────────────────────────────────────────────────
function TimeComparison({ wes, plannedDurationSeconds }) {
  const actualSeconds = wes.travelTime + wes.dwellTime
  const isSlow = actualSeconds > 300
  const diffSeconds = plannedDurationSeconds != null ? actualSeconds - plannedDurationSeconds : null
  const isOverPlan = diffSeconds != null && diffSeconds > 0

  const fmtSec = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="space-y-1 text-xs">
      {/* Plan vs Actual total */}
      <div className="flex items-center gap-3">
        {plannedDurationSeconds != null && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 uppercase">Plan:</span>
            <span className="font-mono font-semibold text-slate-500">{fmtSec(plannedDurationSeconds)}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 uppercase">Act:</span>
          <span className={`font-mono font-bold ${isSlow ? 'text-red-600' : 'text-slate-700'}`}>
            {fmtSec(actualSeconds)}
          </span>
        </div>
        {diffSeconds != null && (
          <div className={`font-mono font-semibold text-[10px] ${isOverPlan ? 'text-red-600' : 'text-emerald-600'}`}>
            {isOverPlan ? '+' : ''}{fmtSec(Math.abs(diffSeconds))}
          </div>
        )}
      </div>
      {/* Travel / Dwell breakdown */}
      <div className="flex items-center gap-3 text-[10px] text-slate-400">
        <span>Trv: <span className="text-slate-600">{fmtSec(wes.travelTime)}</span></span>
        <span>Dwell: <span className={wes.dwellTime > 180 ? 'text-amber-600 font-semibold' : 'text-slate-600'}>{fmtSec(wes.dwellTime)}</span></span>
      </div>
    </div>
  )
}

// ─── Task Row ─────────────────────────────────────────────────────────────────────
function TaskRow({ task, isExpanded, onToggle }) {
  const isException = task.status === 'exception'
  const zone = task.wms.location.split('-')[0]
  const zoneConfig = ZONE_CONFIG[zone]

  return (
    <div className={`border-b border-slate-100 ${isException ? 'bg-amber-50/50' : 'bg-white'}`}>
      <div className="px-4 py-3">
        <div className="flex items-start gap-4">
          {/* Expand button */}
          <button
            onClick={onToggle}
            className="flex-shrink-0 mt-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Status */}
          <div className="flex-shrink-0 mt-0.5">
            <StatusIndicator status={task.status} />
          </div>

          {/* Order & SKU info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-blue-600 font-semibold">{task.id}</span>
              <span className="text-xs font-semibold text-slate-700">{task.orderId}</span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs font-mono text-slate-600">{task.sku}</span>
              {task.waveId && (
                <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{task.waveId}</span>
              )}
            </div>
            <div className="text-sm font-medium text-slate-800 truncate">{task.description}</div>
          </div>

          {/* Zone */}
          <div className="flex-shrink-0">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold ${zoneConfig?.lightClass}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${zoneConfig?.dotClass}`} />
              {zone}
            </div>
          </div>

          {/* Exceptions */}
          <div className="flex-shrink-0">
            <ExceptionBadge exceptions={task.exceptions} />
          </div>

          {/* WMS Plan */}
          <div className="flex-shrink-0 w-48">
            <div className="text-xs font-mono text-slate-600 truncate mb-0.5">{task.sku}</div>
            <div className="text-xs text-slate-700 truncate mb-1">{task.description}</div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500">Qty: <span className="font-semibold text-slate-700">{task.wms.plannedQty}</span></span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${getPriorityConfig(task.wms.priority).text}`}>
                {getPriorityConfig(task.wms.priority).label}
              </span>
            </div>
          </div>

          {/* WES Execution */}
          <div className="flex-shrink-0 w-44">
            <div className="flex items-center gap-1 text-xs mb-1">
              <User size={10} className="text-slate-400" />
              <span className="text-slate-600 truncate">{task.wes.picker.split(' - ')[1]}</span>
            </div>
            <div className="flex items-center gap-1 text-xs mb-1">
              <MapPin size={10} className="text-slate-400" />
              <span className="text-slate-500 truncate text-[10px]">{task.wms.location}</span>
            </div>
            {task.wes.actualQty !== null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Actual qty:</span>
                <span className={`text-xs font-semibold ${
                  task.wes.actualQty !== task.wms.plannedQty ? 'text-amber-600' : 'text-slate-700'
                }`}>
                  {task.wes.actualQty}
                </span>
              </div>
            )}
            {task.wes.actualQty === null && (
              <div className="text-xs font-bold text-red-600">No scan</div>
            )}
          </div>

          {/* Time summary */}
          <div className="flex-shrink-0 w-44">
            {task.wes.completeTime && (
              <TimeComparison wes={task.wes} plannedDurationSeconds={task.wms.plannedDurationSeconds} />
            )}
            {!task.wes.completeTime && (
              <div className="text-xs font-semibold text-red-600">Incomplete</div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
            {/* WMS Details */}
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">WMS Plan</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">SKU</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">{task.sku}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 flex-shrink-0">Description</span>
                  <span className="text-xs font-semibold text-slate-700 text-right">{task.description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Quantity</span>
                  <span className="text-xs font-semibold text-slate-700">{task.wms.plannedQty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Priority</span>
                  <span className={`text-xs font-semibold ${getPriorityConfig(task.wms.priority).text}`}>
                    {getPriorityConfig(task.wms.priority).label}
                  </span>
                </div>
              </div>
            </div>

            {/* WES Details */}
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">WES Execution</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Picker</span>
                  <span className="text-xs font-semibold text-slate-700">{task.wes.picker}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Station</span>
                  <span className="text-xs font-semibold text-slate-700">{task.wes.station}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Location</span>
                  <span className="text-xs font-semibold text-slate-700">{task.wms.location}</span>
                </div>
                {task.wes.scanTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Scan Time</span>
                    <span className="text-xs font-mono font-semibold text-slate-700">{task.wes.scanTime}</span>
                  </div>
                )}
                {task.wes.completeTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Complete Time</span>
                    <span className="text-xs font-mono font-semibold text-slate-700">{task.wes.completeTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exceptions detail */}
          {task.exceptions.length > 0 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-700">Exception Details</span>
              </div>
              <div className="space-y-1">
                {task.exceptions.includes('no-scan') && (
                  <div className="text-xs text-amber-700">
                    <span className="font-semibold">No Scan:</span> Item was not scanned - possible pick denial or skip
                  </div>
                )}
                {task.exceptions.includes('wrong-location') && (
                  <div className="text-xs text-amber-700">
                    <span className="font-semibold">Wrong Location:</span> Picker reported wrong location - possible slotting issue
                  </div>
                )}
                {task.exceptions.includes('under-pick') && (
                  <div className="text-xs text-amber-700">
                    <span className="font-semibold">Under Pick:</span> Picked {task.wes.actualQty} of {task.wms.plannedQty} - possible inventory shortage
                  </div>
                )}
                {task.exceptions.includes('over-pick') && (
                  <div className="text-xs text-amber-700">
                    <span className="font-semibold">Over Pick:</span> Picked {task.wes.actualQty} instead of {task.wms.plannedQty} - possible scanning error
                  </div>
                )}
                {task.exceptions.includes('excessive-duration') && (
                  <div className="text-xs text-amber-700">
                    <span className="font-semibold">Excessive Duration:</span> Task took {Math.floor((task.wes.travelTime + task.wes.dwellTime) / 60)}m {(task.wes.travelTime + task.wes.dwellTime) % 60}s - exceeds expected time
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Historical Trace Component ───────────────────────────────────────────────
export default function HistoricalTrace() {
  const [filter, setFilter] = useState('all') // all, normal, exception
  const [zoneFilter, setZoneFilter] = useState('All')
  const [exceptionTypeFilter, setExceptionTypeFilter] = useState('All')
  const [expandedTask, setExpandedTask] = useState(null)
  const [timeFilter, setTimeFilter] = useState('recent')
  const [visibleCount, setVisibleCount] = useState(10)

  const PAGE_SIZE = 10
  const ZONES = ['All', 'Zone A', 'Zone B', 'Zone C', 'Zone D', 'Crossdock']
  const TIME_FILTERS = ['recent', 'shift', 'today']
  const EXCEPTION_TYPES = ['All', 'No Scan', 'Wrong Loc', 'Under Pick', 'Over Pick', 'Slow']
  const EXCEPTION_TYPE_MAP = {
    'No Scan': 'no-scan',
    'Wrong Loc': 'wrong-location',
    'Under Pick': 'under-pick',
    'Over Pick': 'over-pick',
    'Slow': 'excessive-duration',
  }

  // Filter and sort tasks
  const filteredTasks = PICK_TASKS_ALL.filter(task => {
    // Status filter
    if (filter === 'normal' && task.status !== 'normal') return false
    if (filter === 'exception' && task.status !== 'exception') return false

    // Zone filter
    if (zoneFilter !== 'All') {
      const taskZone = task.wms.location.split('-')[0]
      if (taskZone !== zoneFilter) return false
    }

    // Exception type filter
    if (exceptionTypeFilter !== 'All') {
      const excType = EXCEPTION_TYPE_MAP[exceptionTypeFilter]
      if (!task.exceptions.includes(excType)) return false
    }

    return true
  })

  const visibleTasks = filteredTasks.slice(0, visibleCount)
  const totalCount = filteredTasks.length
  const hasMore = visibleCount < totalCount

  // Infinite scroll
  const lastElementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, totalCount))
        }
      },
      { threshold: 0.1 }
    )

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, totalCount])

  // Update visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filter, zoneFilter, exceptionTypeFilter, timeFilter])

  // Stats
  const normalTasks = PICK_TASKS_ALL.filter(t => t.status === 'normal').length
  const exceptionTasks = PICK_TASKS_ALL.filter(t => t.status === 'exception').length

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Historical Trace</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              WMS pick tasks with WES execution traces
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Time:</span>
              <div className="flex gap-1">
                {TIME_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setTimeFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      timeFilter === f
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {f === 'recent' ? 'Recent' : f === 'shift' ? 'This Shift' : 'Today'}
                  </button>
                ))}
              </div>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Status:</span>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All Tasks ({PICK_TASKS_ALL.length})</option>
                <option value="normal">Normal ({normalTasks})</option>
                <option value="exception">Exceptions ({exceptionTasks})</option>
              </select>
            </div>

            {/* Zone filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Zone:</span>
              <select
                value={zoneFilter}
                onChange={e => setZoneFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {ZONES.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            {/* Exception type filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Exception:</span>
              <select
                value={exceptionTypeFilter}
                onChange={e => setExceptionTypeFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {EXCEPTION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-600">
              Normal: <span className="font-semibold text-slate-800">{normalTasks}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-600">
              Exceptions: <span className="font-semibold text-slate-800">{exceptionTasks}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-slate-600">
              Critical: <span className="font-semibold text-slate-800">{PICK_TASKS_ALL.filter(t => t.exceptions.includes('no-scan')).length}</span>
            </span>
          </div>
          <div className="ml-auto text-xs text-slate-500">
            Showing {visibleTasks.length} of {totalCount} tasks
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <div className="w-6" />
          <div className="w-24">Status</div>
          <div className="flex-1">Task Details</div>
          <div className="w-20">Zone</div>
          <div className="w-32">Exceptions</div>
          <div className="w-48">WMS Plan</div>
          <div className="w-44">WES Execution</div>
          <div className="w-44">Timing (Plan vs Act)</div>
        </div>
      </div>

      {/* Task list with infinite scroll */}
      <div className="flex-1 overflow-y-auto">
        {visibleTasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            isExpanded={expandedTask === task.id}
            onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
          />
        ))}
        {hasMore && (
          <div ref={lastElementRef} className="py-4 text-center text-xs text-slate-400">
            Loading more tasks...
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info size={12} />
          <span>
            Tasks are ordered by volume (7-day movements). Scroll down to load more tasks.
            Exceptions include: no scan, wrong location, over/under quantity, or excessive duration (&gt;5 min).
            Click any row to view detailed WMS and WES comparison.
          </span>
        </div>
      </div>
    </div>
  )
}
