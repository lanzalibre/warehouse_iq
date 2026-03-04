import { CheckCircle, ExternalLink } from 'lucide-react'
import { DC_MANAGER_DATA } from '../../mockData.js'

const sim = DC_MANAGER_DATA.mitigatorSimResults.overtime

export default function DCMitigatorOvertime({ onOpenSimulation }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-slate-800">Mitigation: Add Overtime</h2>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1">
          <CheckCircle size={11} /> Recommended
        </span>
      </div>

      {/* Scenario description */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Scenario</div>
        <p className="text-sm text-slate-700">Add overtime labor until SLA breaks fall below threshold. Applied to Zones A & C where fatigue index is highest.</p>
      </div>

      {/* Simulation KPIs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-semibold text-slate-700 mb-4">Pre-Run Simulation Results</div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-20 text-xs text-slate-500 uppercase tracking-wide pt-0.5 flex-shrink-0">Service</div>
            <div className="flex-1 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{sim.service}</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-20 text-xs text-slate-500 uppercase tracking-wide pt-0.5 flex-shrink-0">Cost</div>
            <div className="flex-1 text-sm font-semibold text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{sim.cost}</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-20 text-xs text-slate-500 uppercase tracking-wide pt-0.5 flex-shrink-0">Risk</div>
            <div className="flex-1 text-sm font-semibold text-slate-700 bg-slate-50 rounded-lg px-3 py-2">{sim.risk}</div>
          </div>
        </div>
      </div>

      {/* Open full simulation link */}
      <button
        onClick={onOpenSimulation}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
      >
        <ExternalLink size={14} />
        Open full simulation →
      </button>
    </div>
  )
}
