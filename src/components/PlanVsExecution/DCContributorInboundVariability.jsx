import { TrendingUp } from 'lucide-react'
import { DC_MANAGER_DATA } from '../../mockData.js'

const data = DC_MANAGER_DATA.contributorDetail.inboundVariability

// Max labor hours across all days (for bar scaling)
const maxLabor = Math.max(
  ...data.chartData.map(r => Math.max(r.laborHours.planned, r.laborHours.actual ?? 0))
)

export default function DCContributorInboundVariability() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-slate-800">Inbound Variability Analysis</h2>
        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">High Risk</span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Today's Variance</div>
          <div className="text-2xl font-bold text-red-600">{data.todayVariance}%</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">3-Day Avg Variance</div>
          <div className="text-2xl font-bold text-slate-800">{data.avgVariance}%</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Trend</div>
          <div className="flex items-center gap-1.5 text-2xl font-bold text-amber-600">
            <TrendingUp size={20} /> Rising
          </div>
        </div>
      </div>

      {/* Workload Mix chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-semibold text-slate-700 mb-4">Inbound Workload Mix (%)</div>
        <div className="space-y-3">
          {data.chartData.map(row => {
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
                    {isFuture && (
                      <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-semibold">Forecast</span>
                    )}
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

      {/* Labor Hours chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-semibold text-slate-700 mb-4">Labor Hours — Planned vs Actual</div>
        <div className="space-y-4">
          {data.chartData.map(row => {
            const isToday = row.label === 'Today'
            const isFuture = row.label === 'Tomorrow'
            const plannedW = Math.round((row.laborHours.planned / maxLabor) * 100)
            const actualW = row.laborHours.actual != null
              ? Math.round((row.laborHours.actual / maxLabor) * 100)
              : null
            const isOver = row.laborHours.actual != null && row.laborHours.actual > row.laborHours.planned

            return (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={isToday ? 'font-bold text-slate-800' : isFuture ? 'text-violet-600 font-semibold' : ''}>
                      {row.label}
                    </span>
                    <span className="text-slate-300">{row.dayLabel}</span>
                    {isFuture && (
                      <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-semibold">Forecast</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">Plan: <span className="font-semibold text-slate-700">{row.laborHours.planned}h</span></span>
                    {actualW != null && (
                      <span className={isOver ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                        Actual: {row.laborHours.actual}h
                        {isOver && <span className="ml-1 text-red-500">+{row.laborHours.actual - row.laborHours.planned}h</span>}
                      </span>
                    )}
                  </div>
                </div>

                {/* Planned bar */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-12 text-right flex-shrink-0">Plan</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-300 rounded-full" style={{ width: `${plannedW}%` }} />
                    </div>
                  </div>
                  {actualW != null && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 w-12 text-right flex-shrink-0">Actual</span>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isOver ? 'bg-red-400' : 'bg-emerald-400'}`}
                          style={{ width: `${actualW}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {isFuture && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-violet-400 w-12 text-right flex-shrink-0">Fcst.</span>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-300 rounded-full opacity-60" style={{ width: `${plannedW}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
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
            <div className="text-3xl font-bold text-amber-700">{data.impactPct}%</div>
            <div className="text-xs text-amber-600">of total OTIF risk</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-700">–${(data.impactDollars / 1000).toFixed(0)}K</div>
            <div className="text-xs text-red-600">estimated exposure</div>
          </div>
        </div>
      </div>
    </div>
  )
}
