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
    </div>
  )
}
