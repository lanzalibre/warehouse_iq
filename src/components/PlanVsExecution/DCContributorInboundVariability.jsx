import { TrendingUp } from 'lucide-react'
import { DC_MANAGER_DATA } from '../../mockData.js'

const data = DC_MANAGER_DATA.contributorDetail.inboundVariability

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
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">7-Day Avg Variance</div>
          <div className="text-2xl font-bold text-slate-800">{data.avgVariance}%</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Trend</div>
          <div className="flex items-center gap-1.5 text-2xl font-bold text-amber-600">
            <TrendingUp size={20} /> Rising
          </div>
        </div>
      </div>

      {/* Chart: inbound mix by day */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-semibold text-slate-700 mb-4">Inbound Volume Mix by Day (%)</div>
        <div className="space-y-3">
          {data.chartData.map(row => {
            const total = row.conveyor + row.pallet + row.flat
            const conveyorPct = Math.round((row.conveyor / total) * 100)
            const palletPct = Math.round((row.pallet / total) * 100)
            const flatPct = 100 - conveyorPct - palletPct
            return (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className={row.label === 'Today' ? 'font-bold text-slate-800' : ''}>{row.label}</span>
                  <span className="text-slate-400">{total} units</span>
                </div>
                <div className="h-5 rounded-full overflow-hidden flex">
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
