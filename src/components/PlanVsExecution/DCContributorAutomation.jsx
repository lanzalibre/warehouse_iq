import { DC_MANAGER_DATA } from '../../mockData.js'

const data = DC_MANAGER_DATA.contributorDetail.automationUtilization

export default function DCContributorAutomation() {
  const pct = data.current
  const threshold = data.threshold

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-slate-800">Automation Utilization Analysis</h2>
        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">Nearing Threshold</span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Current Utilization</div>
          <div className="text-2xl font-bold text-amber-600">{pct}%</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Threshold</div>
          <div className="text-2xl font-bold text-slate-800">{threshold}%</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Days &gt;85%</div>
          <div className="text-2xl font-bold text-red-600">{data.daysAbove85}</div>
        </div>
      </div>

      {/* Utilization bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="font-semibold text-slate-700">Current Utilization vs. Threshold</span>
          <span className="text-amber-600 font-bold">{pct}% / {threshold}%</span>
        </div>
        <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
          {/* Threshold marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500"
            style={{ left: `${threshold}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0%</span>
          <span className="text-red-500 font-medium">{threshold}% threshold</span>
          <span>100%</span>
        </div>
        <p className="text-xs text-amber-700 mt-3 bg-amber-50 rounded-lg px-3 py-2">
          Only 1% headroom remains. Any additional load may push automation past safe operating limits.
        </p>
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
