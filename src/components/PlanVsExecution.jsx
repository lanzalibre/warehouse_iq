import { useState } from 'react'
import {
  AlertTriangle, CheckCircle, XCircle, Clock,
  ArrowRight, User, MapPin, Package, Calendar,
  Filter, ChevronDown, Eye, EyeOff, Info,
} from 'lucide-react'
import { PICK_TASK_COMPARISON, getPriorityConfig } from '../mockData.js'

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
function TimeComparison({ wes }) {
  const totalSeconds = wes.travelTime + wes.dwellTime
  const isSlow = totalSeconds > 300

  return (
    <div className="flex items-center gap-4 text-xs">
      <div className="flex items-center gap-1">
        <Clock size={11} />
        <span className="text-slate-500">Travel:</span>
        <span className={`font-mono font-semibold ${isSlow ? 'text-amber-600' : 'text-slate-700'}`}>
          {Math.floor(wes.travelTime / 60)}:{(wes.travelTime % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Clock size={11} />
        <span className="text-slate-500">Dwell:</span>
        <span className={`font-mono font-semibold ${wes.dwellTime > 180 ? 'text-amber-600' : 'text-slate-700'}`}>
          {Math.floor(wes.dwellTime / 60)}:{(wes.dwellTime % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-slate-500">Total:</span>
        <span className={`font-mono font-bold ${isSlow ? 'text-red-600' : 'text-slate-700'}`}>
          {Math.floor(totalSeconds / 60)}:{(totalSeconds % 60).toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

// ─── Task Row ─────────────────────────────────────────────────────────────────────
function TaskRow({ task, isExpanded, onToggle }) {
  const isException = task.status === 'exception'

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
              <span className="text-xs font-mono text-slate-400">{task.id}</span>
              <span className="text-xs font-semibold text-slate-700">{task.orderId}</span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs font-mono text-slate-600">{task.sku}</span>
            </div>
            <div className="text-sm font-medium text-slate-800 truncate">{task.description}</div>
          </div>

          {/* Exceptions */}
          <div className="flex-shrink-0">
            <ExceptionBadge exceptions={task.exceptions} />
          </div>

          {/* WMS Summary */}
          <div className="flex-shrink-0 w-40">
            <div className="flex items-center gap-1 text-xs mb-1">
              <MapPin size={10} className="text-slate-400" />
              <span className="text-slate-600 truncate">{task.wms.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Qty:</span>
              <span className="text-xs font-semibold text-slate-700">{task.wms.plannedQty}</span>
            </div>
          </div>

          {/* WES Summary */}
          <div className="flex-shrink-0 w-44">
            <div className="flex items-center gap-1 text-xs mb-1">
              <User size={10} className="text-slate-400" />
              <span className="text-slate-600 truncate">{task.wes.picker.split(' - ')[1]}</span>
            </div>
            {task.wes.actualQty !== null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Actual:</span>
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
              <TimeComparison wes={task.wes} />
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
                  <span className="text-xs text-slate-500">Location</span>
                  <span className="text-xs font-semibold text-slate-700">{task.wms.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Quantity</span>
                  <span className="text-xs font-semibold text-slate-700">{task.wms.plannedQty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Time Window</span>
                  <span className="text-xs font-semibold text-slate-700">{task.wms.plannedWindow}</span>
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

// ─── Main Component ───────────────────────────────────────────────────────────────
export default function PlanVsExecution() {
  const [filter, setFilter] = useState('all') // all, normal, exception
  const [expandedTask, setExpandedTask] = useState(null)

  const filteredTasks = filter === 'all'
    ? PICK_TASK_COMPARISON.tasks
    : filter === 'normal'
      ? PICK_TASK_COMPARISON.tasks.filter(t => t.status === 'normal')
      : PICK_TASK_COMPARISON.tasks.filter(t => t.status === 'exception')

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Plan vs. Execution</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare WMS pick tasks with WES execution traces
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter:</span>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All Tasks ({PICK_TASK_COMPARISON.totalTasks})</option>
                <option value="normal">Normal ({PICK_TASK_COMPARISON.normalTasks})</option>
                <option value="exception">Exceptions ({PICK_TASK_COMPARISON.exceptionTasks})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-600">
              Normal: <span className="font-semibold text-slate-800">{PICK_TASK_COMPARISON.normalTasks}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-600">
              Exceptions: <span className="font-semibold text-slate-800">{PICK_TASK_COMPARISON.exceptionTasks}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-slate-600">
              Critical: <span className="font-semibold text-slate-800">{PICK_TASK_COMPARISON.tasks.filter(t => t.exceptions.includes('no-scan')).length}</span>
            </span>
          </div>
          <div className="ml-auto text-xs text-slate-500">
            Period: <span className="font-semibold text-slate-700">{PICK_TASK_COMPARISON.period}</span>
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <div className="w-6" />
          <div className="w-24">Status</div>
          <div className="flex-1">Task Details</div>
          <div className="w-32">Exceptions</div>
          <div className="w-40">WMS Plan</div>
          <div className="w-44">WES Execution</div>
          <div className="w-44">Timing</div>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        {filteredTasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            isExpanded={expandedTask === task.id}
            onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
          />
        ))}
      </div>

      {/* Footer info */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info size={12} />
          <span>
            Exceptions include: no scan, wrong location, over/under quantity, or excessive duration (&gt;5 min).
            Click any row to view detailed WMS and WES comparison.
          </span>
        </div>
      </div>
    </div>
  )
}
