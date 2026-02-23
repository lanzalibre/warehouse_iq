import { TrendingUp, TrendingDown, Minus, Clock, Target, Activity } from 'lucide-react'

// ─── Projection Card ───────────────────────────────────────────────────────
function ProjectionCard({ title, currentDiff, projectedDiff, projectedEnd, trend, confidence }) {
  const isAhead = currentDiff < 0
  const isBehind = currentDiff > 0

  return (
    <div className={`rounded-xl p-4 border-2 ${
      isAhead
        ? 'bg-emerald-50 border-emerald-200'
        : isBehind
          ? 'bg-red-50 border-red-200'
          : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        {trend === 'improving' && <TrendingDown size={16} className="text-emerald-600" />}
        {trend === 'worsening' && <TrendingUp size={16} className="text-red-600" />}
        {trend === 'stable' && <Minus size={16} className="text-slate-500" />}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Current Difference */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Current</div>
          <div className={`text-lg font-bold ${
            isAhead ? 'text-emerald-600' : isBehind ? 'text-red-600' : 'text-slate-700'
          }`}>
            {isAhead ? '-' : '+'}{Math.abs(currentDiff).toFixed(1)}h
          </div>
          <div className="text-[10px] text-slate-500">{isAhead ? 'ahead' : isBehind ? 'behind' : 'on track'}</div>
        </div>

        {/* Projected Difference */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Projected</div>
          <div className={`text-lg font-bold ${
            projectedDiff < 0 ? 'text-emerald-600' : projectedDiff > 0 ? 'text-red-600' : 'text-slate-700'
          }`}>
            {projectedDiff < 0 ? '-' : '+'}{Math.abs(projectedDiff).toFixed(1)}h
          </div>
          <div className="text-[10px] text-slate-500">{projectedDiff < 0 ? 'ahead' : projectedDiff > 0 ? 'behind' : 'on track'}</div>
        </div>

        {/* Projected End / Confidence */}
        <div>
          {projectedEnd && (
            <>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Projected End</div>
              <div className="text-lg font-bold text-slate-700">{projectedEnd}</div>
            </>
          )}
          {!projectedEnd && (
            <>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Confidence</div>
              <div className="text-lg font-bold text-slate-700">{confidence}%</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Projection Panel ───────────────────────────────────────────────────────
export default function ProjectionPanel({ projections }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-blue-600" />
        <h2 className="text-base font-bold text-slate-800">Projections</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ProjectionCard
          title="Current Shift"
          currentDiff={projections.shift.currentDifference}
          projectedDiff={projections.shift.projectedDifference}
          projectedEnd={projections.shift.projectedEndHour}
          trend={projections.shift.trend}
          confidence={projections.shift.confidence}
        />
        <ProjectionCard
          title="End of Day"
          currentDiff={projections.day.currentDifference}
          projectedDiff={projections.day.projectedDifference}
          projectedEnd={null}
          trend={projections.day.trend}
          confidence={projections.day.confidence}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <TrendingDown size={12} className="text-emerald-600" />
          Improving
        </span>
        <span className="flex items-center gap-1.5">
          <TrendingUp size={12} className="text-red-600" />
          Worsening
        </span>
        <span className="flex items-center gap-1.5">
          <Minus size={12} className="text-slate-500" />
          Stable
        </span>
      </div>
    </div>
  )
}
