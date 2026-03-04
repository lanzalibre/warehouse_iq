import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import { DC_MANAGER_DATA } from '../../mockData.js'

const { daySummary } = DC_MANAGER_DATA

function StatusCard({ label, value, color }) {
  const colors = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  }
  const valueColors = {
    emerald: 'text-emerald-800',
    amber: 'text-amber-800',
    red: 'text-red-800',
  }
  return (
    <div className={`rounded-xl border-2 p-5 ${colors[color]}`}>
      <div className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70">{label}</div>
      <div className={`text-xl font-bold ${valueColors[color]}`}>{value}</div>
    </div>
  )
}

export default function DCDaySummary() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Status cards */}
      <div className="grid grid-cols-3 gap-4">
        {daySummary.statusCards.map(card => (
          <StatusCard key={card.label} {...card} />
        ))}
      </div>

      {/* Executive summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        {/* Risks Mitigated */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">Risks Mitigated</h3>
          </div>
          <ul className="space-y-2">
            {daySummary.mitigated.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-100" />

        {/* Decisions Taken */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Decisions Taken</h3>
          </div>
          <ul className="space-y-2">
            {daySummary.decisions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">›</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-100" />

        {/* Tomorrow's Outlook */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-violet-600" />
            <h3 className="text-sm font-bold text-slate-800">Tomorrow's Outlook</h3>
          </div>
          <ul className="space-y-2">
            {daySummary.outlook.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-violet-400 mt-0.5 flex-shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
