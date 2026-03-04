import { useState } from 'react'
import {
  Target, DollarSign, Shield, TrendingUp, AlertTriangle,
  ArrowLeft, Clock, CheckCircle, X,
} from 'lucide-react'
import { DC_MANAGER_DATA } from '../../mockData.js'
import DCContributorInboundVariability from './DCContributorInboundVariability.jsx'
import DCContributorLaborFatigue from './DCContributorLaborFatigue.jsx'
import DCContributorAutomation from './DCContributorAutomation.jsx'
import DCMitigatorOvertime from './DCMitigatorOvertime.jsx'
import DCMitigatorPullForward from './DCMitigatorPullForward.jsx'

const { kpis, riskSignal, mitigators } = DC_MANAGER_DATA

// ─── KPI icon map ─────────────────────────────────────────────────────────────
const KPI_ICONS = { target: Target, dollar: DollarSign, shield: Shield, trending: TrendingUp }

function KPICard({ label, value, delta, subtext, color, icon }) {
  const Icon = KPI_ICONS[icon] || Target
  const colorMap = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500' },
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={c.icon} />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
      {delta && <div className="text-xs text-slate-500 mt-0.5">{delta}</div>}
      {subtext && <div className="text-xs text-slate-400 mt-0.5">{subtext}</div>}
    </div>
  )
}

// ─── Risk level badge ─────────────────────────────────────────────────────────
function RiskBadge({ level }) {
  const map = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    threshold: 'bg-orange-100 text-orange-700',
  }
  const labels = { high: 'High', medium: 'Medium', threshold: 'Nearing Threshold' }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[level] || map.medium}`}>
      {labels[level] || level}
    </span>
  )
}

// ─── Contributor card ─────────────────────────────────────────────────────────
function ContributorCard({ contributor, onDrillDown, onNavigateToLabor }) {
  function handleViewAnalysis() {
    if (contributor.id === 'inboundVariability' && onNavigateToLabor) {
      onNavigateToLabor('inbound-variability')
    } else if (contributor.id === 'laborFatigue' && onNavigateToLabor) {
      onNavigateToLabor('labor-fatigue')
    } else {
      onDrillDown({ type: 'contributor', id: contributor.id })
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-slate-800">{contributor.label}</div>
          <RiskBadge level={contributor.level} />
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Impact</div>
          <div className="text-sm font-bold text-red-600">–${Math.abs(contributor.impact / 1000).toFixed(0)}K</div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Confidence</span>
          <span className="font-medium">{contributor.confidence}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${contributor.confidence}%` }} />
        </div>
      </div>

      <button
        onClick={handleViewAnalysis}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
      >
        View Analysis →
      </button>
    </div>
  )
}

// ─── Mitigator card ───────────────────────────────────────────────────────────
function MitigatorCard({ mitigator, accepted, onDrillDown, onAccept }) {
  return (
    <div className={`bg-white rounded-xl border p-4 flex flex-col ${accepted ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-bold text-slate-800">{mitigator.title}</div>
        {accepted && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">
            <CheckCircle size={10} /> Applied
          </span>
        )}
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Service Impact</span>
          <span className="text-xs font-medium text-slate-700">{mitigator.serviceImpact}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Cost Delta</span>
          <span className={`text-xs font-medium ${mitigator.costDelta.startsWith('+') ? 'text-amber-700' : 'text-slate-700'}`}>
            {mitigator.costDelta}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Op Risk</span>
          <span className="text-xs font-medium text-slate-700">{mitigator.opRisk}</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4 flex-1">{mitigator.detail}</p>

      <div className="flex items-center justify-between mt-auto">
        {mitigator.hasSimulation && (
          <button
            onClick={() => onDrillDown({ type: 'mitigator', id: mitigator.id })}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
          >
            View Simulation →
          </button>
        )}
        {!mitigator.hasSimulation && <span />}

        {accepted ? (
          <span className="text-xs text-emerald-600 font-medium">Confirmed</span>
        ) : (
          <button
            onClick={() => onAccept(mitigator)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Accept
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Confirmation Modal ────────────────────────────────────────────────────────
function ConfirmModal({ mitigator, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-800">Confirm Mitigation</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <div className="text-lg font-bold text-slate-800 mb-1">{mitigator.title}</div>
            <p className="text-sm text-slate-500">{mitigator.detail}</p>
          </div>

          {/* Impact summary */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Service Impact</span>
              <span className="font-medium text-slate-700">{mitigator.serviceImpact}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Cost Delta</span>
              <span className={`font-medium ${mitigator.costDelta.startsWith('+') ? 'text-amber-700' : 'text-slate-700'}`}>
                {mitigator.costDelta}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Operational Risk</span>
              <span className="font-medium text-slate-700">{mitigator.opRisk}</span>
            </div>
          </div>

          {/* Systems */}
          <div>
            <div className="text-xs text-slate-500 mb-2">This action will be dispatched to:</div>
            <div className="flex gap-2">
              {mitigator.systems.map(sys => (
                <span key={sys} className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg">
                  {sys}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Confirm & Apply
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main DCOverview ──────────────────────────────────────────────────────────
export default function DCOverview({ onNavigateToSimulation, onNavigateToLabor }) {
  const [drillDown, setDrillDown] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [acceptedIds, setAcceptedIds] = useState(new Set())
  const [history, setHistory] = useState(DC_MANAGER_DATA.actionHistory)

  function handleAccept(mitigator) {
    setConfirmTarget(mitigator)
  }

  function handleConfirm() {
    const now = new Date()
    const time = now.toTimeString().slice(0, 5)
    setHistory(prev => [
      ...prev,
      { action: confirmTarget.actionLabel, acceptedAt: time, systems: confirmTarget.systems },
    ])
    setAcceptedIds(prev => new Set([...prev, confirmTarget.id]))
    setConfirmTarget(null)
  }

  function renderDrillDown() {
    if (drillDown.type === 'contributor') {
      if (drillDown.id === 'inboundVariability') return <DCContributorInboundVariability />
      if (drillDown.id === 'laborFatigue') return <DCContributorLaborFatigue />
      if (drillDown.id === 'automation') return <DCContributorAutomation />
    }
    if (drillDown.type === 'mitigator') {
      if (drillDown.id === 'overtime') return <DCMitigatorOvertime onOpenSimulation={onNavigateToSimulation} />
      if (drillDown.id === 'pullForward') return <DCMitigatorPullForward onOpenSimulation={onNavigateToSimulation} />
    }
    return null
  }

  if (drillDown) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <button
          onClick={() => setDrillDown(null)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Overview
        </button>
        {renderDrillDown()}
      </div>
    )
  }

  return (
    <>
      {confirmTarget && (
        <ConfirmModal
          mitigator={confirmTarget}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTarget(null)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Section 1 — Executive KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map(kpi => <KPICard key={kpi.id} {...kpi} />)}
        </div>

        {/* Section 2 — Risk Signal */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" />
              <h2 className="text-base font-bold text-amber-900">{riskSignal.headline}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-xs font-semibold">
                {riskSignal.confidence}% confidence
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                –${Math.abs(riskSignal.financialImpact / 1000).toFixed(0)}K estimated exposure
              </span>
            </div>
          </div>
        </div>

        {/* Section 3 — Contributors */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">Risk Contributors</h3>
          <div className="grid grid-cols-3 gap-4">
            {riskSignal.contributors.map(c => (
              <ContributorCard key={c.id} contributor={c} onDrillDown={setDrillDown} onNavigateToLabor={onNavigateToLabor} />
            ))}
          </div>
        </div>

        {/* Section 4 — Mitigators */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">Available Mitigations</h3>
          <div className="grid grid-cols-3 gap-4">
            {mitigators.map(m => (
              <MitigatorCard
                key={m.id}
                mitigator={m}
                accepted={acceptedIds.has(m.id)}
                onDrillDown={setDrillDown}
                onAccept={handleAccept}
              />
            ))}
          </div>
        </div>

        {/* Action History */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">Action History</h3>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {history.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-slate-700 flex-1">{item.action}</span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={11} />
                  {item.acceptedAt}
                </div>
                <div className="flex gap-1">
                  {item.systems.map(sys => (
                    <span key={sys} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded">
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
