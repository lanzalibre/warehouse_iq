import { Clock, ArrowDown, ArrowUp } from 'lucide-react'

// ─── Horizontal Bar Chart for Planned vs Actual Hours ──────────────────────
function HorizontalBarChart({ data, label, showDelayBreakdown = false }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Planned: {data.plannedHours}h
          </span>
          <span className={`flex items-center gap-1.5 ${data.delayHours < 0 ? 'text-emerald-600' : data.delayHours > 0 ? 'text-red-600' : 'text-slate-500'}`}>
            {data.delayHours < 0 ? <ArrowDown size={12} /> : data.delayHours > 0 ? <ArrowUp size={12} /> : <Clock size={12} />}
            Actual: {data.actualHours}h
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${Math.min((data.plannedHours / 50) * 100, 100)}%` }} />
      </div>

      {/* Delay breakdown */}
      {showDelayBreakdown && data.delayBreakdown && data.delayBreakdown.delayMinutes > 0 && (
        <div className="mt-2 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-amber-600">
            <Clock size={10} />
            Delays: {Math.floor(data.delayBreakdown.delayMinutes / 60)}h {data.delayBreakdown.delayMinutes % 60}m
          </span>
          {data.delayBreakdown.denialMinutes > 0 && (
            <span className="flex items-center gap-1 text-red-600">
              Pick Denials: {Math.floor(data.delayBreakdown.denialMinutes / 60)}h {data.delayBreakdown.denialMinutes % 60}m
            </span>
          )}
        </div>
      )}

      {/* Tasks completed */}
      {data.tasksCompleted && (
        <div className="mt-2 text-xs text-slate-500">
          {data.tasksCompleted} of {data.totalTasks} tasks completed
        </div>
      )}
    </div>
  )
}

export default HorizontalBarChart
