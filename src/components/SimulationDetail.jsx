import { ArrowLeft, BarChart3 } from 'lucide-react'

// ─── Simulated per-zone impact data ──────────────────────────────────────────
const ZONE_IMPACTS = [
  { zone: 'Zone A', otifDelta: '+0.4%', laborUtilization: '88%', slaBreaks: 0, status: 'Protected' },
  { zone: 'Zone B', otifDelta: '+0.1%', laborUtilization: '72%', slaBreaks: 0, status: 'Stable' },
  { zone: 'Zone C', otifDelta: '+0.3%', laborUtilization: '91%', slaBreaks: 1, status: 'Watch' },
  { zone: 'Zone D', otifDelta: '0.0%', laborUtilization: '89%', slaBreaks: 0, status: 'Stable' },
  { zone: 'Crossdock', otifDelta: '+0.0%', laborUtilization: '65%', slaBreaks: 0, status: 'Stable' },
]

const HOURLY_TIMELINE = [
  { hour: '14:00', load: 62 }, { hour: '15:00', load: 71 }, { hour: '16:00', load: 84 },
  { hour: '17:00', load: 88 }, { hour: '18:00', load: 79 }, { hour: '19:00', load: 68 },
  { hour: '20:00', load: 55 }, { hour: '21:00', load: 44 },
]

export default function SimulationDetail({ scenario, onBack }) {
  const name = scenario?.name || 'Add Overtime'

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Simulation
      </button>

      {/* Title */}
      <div className="flex items-center gap-3">
        <BarChart3 size={18} className="text-blue-600" />
        <h2 className="text-base font-bold text-slate-800">Detailed Outputs — {name}</h2>
      </div>

      {/* KPI breakdown table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="text-sm font-semibold text-slate-700">Full KPI Breakdown</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <th className="text-left px-4 py-2">Metric</th>
              <th className="text-right px-4 py-2">Baseline</th>
              <th className="text-right px-4 py-2">Simulated</th>
              <th className="text-right px-4 py-2">Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-2.5 text-slate-700">OTIF Rate</td>
              <td className="px-4 py-2.5 text-right text-slate-500">97.3%</td>
              <td className="px-4 py-2.5 text-right font-semibold text-emerald-700">98.1%</td>
              <td className="px-4 py-2.5 text-right text-emerald-600">+0.8%</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-slate-700">SLA Breaks</td>
              <td className="px-4 py-2.5 text-right text-slate-500">8</td>
              <td className="px-4 py-2.5 text-right font-semibold text-emerald-700">1</td>
              <td className="px-4 py-2.5 text-right text-emerald-600">–7</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-slate-700">Labor Utilization (avg)</td>
              <td className="px-4 py-2.5 text-right text-slate-500">72%</td>
              <td className="px-4 py-2.5 text-right font-semibold text-slate-700">81%</td>
              <td className="px-4 py-2.5 text-right text-amber-600">+9%</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-slate-700">Labor Cost</td>
              <td className="px-4 py-2.5 text-right text-slate-500">$0</td>
              <td className="px-4 py-2.5 text-right font-semibold text-amber-700">+$12K</td>
              <td className="px-4 py-2.5 text-right text-amber-600">+$12,000</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-slate-700">Cost per Unit</td>
              <td className="px-4 py-2.5 text-right text-slate-500">$2.47</td>
              <td className="px-4 py-2.5 text-right font-semibold text-amber-700">$2.54</td>
              <td className="px-4 py-2.5 text-right text-amber-600">+$0.07</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-slate-700">Financial Exposure</td>
              <td className="px-4 py-2.5 text-right text-slate-500">–$34K</td>
              <td className="px-4 py-2.5 text-right font-semibold text-emerald-700">–$6K</td>
              <td className="px-4 py-2.5 text-right text-emerald-600">+$28K recovered</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Per-zone impact */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="text-sm font-semibold text-slate-700">Per-Zone Impact</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <th className="text-left px-4 py-2">Zone</th>
              <th className="text-right px-4 py-2">OTIF Delta</th>
              <th className="text-right px-4 py-2">Labor Util.</th>
              <th className="text-right px-4 py-2">SLA Breaks</th>
              <th className="text-right px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ZONE_IMPACTS.map(z => (
              <tr key={z.zone}>
                <td className="px-4 py-2.5 text-slate-700 font-medium">{z.zone}</td>
                <td className="px-4 py-2.5 text-right text-emerald-600">{z.otifDelta}</td>
                <td className="px-4 py-2.5 text-right text-slate-600">{z.laborUtilization}</td>
                <td className="px-4 py-2.5 text-right text-slate-600">{z.slaBreaks}</td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    z.status === 'Protected' ? 'bg-emerald-100 text-emerald-700'
                    : z.status === 'Watch' ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                  }`}>{z.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hourly timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-semibold text-slate-700 mb-4">Projected Load Timeline (% of capacity)</div>
        <div className="flex items-end gap-2 h-32">
          {HOURLY_TIMELINE.map(h => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-md transition-all ${h.load >= 85 ? 'bg-amber-400' : 'bg-blue-400'}`}
                style={{ height: `${h.load}%` }}
              />
              <span className="text-[10px] text-slate-400">{h.hour}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-400 inline-block" />Normal</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />High (&gt;85%)</span>
        </div>
      </div>
    </div>
  )
}
