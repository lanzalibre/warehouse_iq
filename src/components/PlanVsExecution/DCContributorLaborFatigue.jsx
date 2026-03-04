import { TrendingUp } from 'lucide-react'
import { DC_MANAGER_DATA } from '../../mockData.js'

const data = DC_MANAGER_DATA.contributorDetail.laborFatigue

function ZoneCard({ zone, fatigueIndex, workers, avgHours }) {
  const color = fatigueIndex >= 80 ? 'red' : fatigueIndex >= 70 ? 'amber' : 'emerald'
  const barColors = { red: 'bg-red-500', amber: 'bg-amber-500', emerald: 'bg-emerald-500' }
  const textColors = { red: 'text-red-700', amber: 'text-amber-700', emerald: 'text-emerald-700' }
  const bgColors = { red: 'bg-red-50 border-red-200', amber: 'bg-amber-50 border-amber-200', emerald: 'bg-emerald-50 border-emerald-200' }

  return (
    <div className={`rounded-xl border p-4 ${bgColors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-800">{zone}</span>
        <span className={`text-lg font-bold ${textColors[color]}`}>{fatigueIndex}</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
        <div className={`h-full ${barColors[color]} rounded-full`} style={{ width: `${fatigueIndex}%` }} />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{workers} workers</span>
        <span>Avg {avgHours}h consecutive</span>
      </div>
    </div>
  )
}

export default function DCContributorLaborFatigue() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-slate-800">Labor Fatigue Trend Analysis</h2>
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Medium Risk</span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Avg Consecutive Hours</div>
          <div className="text-2xl font-bold text-amber-600">{data.avgConsecutiveHours}h</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Zones Affected</div>
          <div className="text-2xl font-bold text-slate-800">{data.zonesAffected}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Error Rate Trend</div>
          <div className="flex items-center gap-1.5 text-2xl font-bold text-red-600">
            <TrendingUp size={20} /> Rising
          </div>
        </div>
      </div>

      {/* Zone fatigue cards */}
      <div>
        <div className="text-sm font-semibold text-slate-700 mb-3">Fatigue Index by Zone (0–100)</div>
        <div className="grid grid-cols-3 gap-4">
          {data.zoneData.map(z => (
            <ZoneCard key={z.zone} {...z} />
          ))}
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
