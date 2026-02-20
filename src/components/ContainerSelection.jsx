import { useState } from 'react'
import {
  Star, AlertTriangle, Clock, Package, Truck, BarChart3,
  CheckCircle, ChevronRight, Info, TrendingUp, Layers,
  ShieldCheck, Zap, Scale,
} from 'lucide-react'
import {
  CONTAINERS, ZONE_CONFIG, SITE_STATS,
  getScoreColor, getScoreBarClass, getPriorityConfig, getCategoryAbbr,
} from '../mockData.js'

// ─── Site Stats Bar ────────────────────────────────────────────────────────────
function SiteStatsBar() {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-8 text-sm flex-shrink-0">
      <div className="flex items-center gap-2 text-slate-600">
        <BarChart3 size={14} className="text-blue-500" />
        <span>Today's throughput:</span>
        <span className="font-semibold text-slate-800">{SITE_STATS.todayThroughput.toLocaleString()} units</span>
      </div>
      <div className="flex items-center gap-2 text-slate-600">
        <Zap size={14} className="text-amber-500" />
        <span>Dock utilization:</span>
        <span className="font-semibold text-slate-800">{SITE_STATS.dockUtilization}%</span>
      </div>
      <div className="flex items-center gap-2 text-slate-600">
        <Package size={14} className="text-slate-500" />
        <span>Pending in yard:</span>
        <span className="font-semibold text-slate-800">{SITE_STATS.pendingContainers} containers</span>
      </div>
      <div className="flex items-center gap-2 text-slate-600">
        <AlertTriangle size={14} className="text-red-500" />
        <span>SLA risk:</span>
        <span className="font-semibold text-red-600">{SITE_STATS.slaRiskCount} containers</span>
      </div>
      <div className="ml-auto flex items-center gap-2 text-slate-500">
        <TrendingUp size={13} />
        <span className="text-xs">Avg cycle: {SITE_STATS.avgCycleTimeHours} h/container</span>
      </div>
    </div>
  )
}

// ─── Container Card (left panel) ──────────────────────────────────────────────
function ContainerCard({ container, rank, isSelected, isHighlighted, onClick }) {
  const priority = getPriorityConfig(container.priority)
  const score = container.criteria.overall

  const borderClass = isSelected
    ? 'border-blue-500 bg-blue-50'
    : isHighlighted
    ? 'border-emerald-400 bg-emerald-50 animate-pulse'
    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 p-3 mb-2 transition-all ${borderClass}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {/* AI rank badge */}
          <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
            rank === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {rank}
          </span>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-800 text-sm">{container.supplier}</span>
              {container.isRecommended && (
                <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <Star size={9} fill="white" />
                  AI REC
                </span>
              )}
              {isHighlighted && (
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <CheckCircle size={9} />
                  NEW REC
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{getCategoryAbbr(container.category)} · {container.id}</div>
          </div>
        </div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${priority.bg} ${priority.text}`}>
          {priority.label}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {container.ageInYard}d in yard
        </span>
        <span className="flex items-center gap-1">
          <Layers size={11} />
          {container.palletCount} pallets
        </span>
        <span className="flex items-center gap-1">
          <Package size={11} />
          ~{container.estimatedUnits} units
        </span>
      </div>

      {/* Score bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getScoreBarClass(score)}`}
            style={{ width: `${score * 100}%` }}
          />
        </div>
        <span className={`text-xs font-bold tabular-nums ${getScoreColor(score)}`}>
          {Math.round(score * 100)}%
        </span>
        {isSelected && <ChevronRight size={14} className="text-blue-500 flex-shrink-0" />}
      </div>
    </button>
  )
}

// ─── Workload Zone Chart ───────────────────────────────────────────────────────
function WorkloadZoneChart({ estimate, showCurrent = true }) {
  const maxHours = 20 // chart scale
  const zones = Object.entries(estimate.byZone)

  return (
    <div className="space-y-3">
      {showCurrent && (
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-slate-300" />
            Current zone load
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-blue-500" />
            This container (est.)
          </span>
        </div>
      )}
      {zones.map(([zone, data]) => {
        const cfg = ZONE_CONFIG[zone]
        const currentPct = cfg.currentLoadPct
        const addedPct = Math.min((data.hours / maxHours) * 100, 100)
        const totalPct = Math.min(currentPct + addedPct, 100)
        const isOverloaded = currentPct + addedPct > 95

        return (
          <div key={zone}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                <span className="text-xs font-medium text-slate-700">{zone}</span>
                <span className="text-xs text-slate-400">{cfg.label}</span>
                {isOverloaded && (
                  <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <AlertTriangle size={9} />
                    NEAR CAPACITY
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {data.hours > 0 && (
                  <span className={`font-semibold ${cfg.textClass}`}>+{data.hours.toFixed(1)} h</span>
                )}
                <span className="text-slate-400">{data.units > 0 ? `${data.units} units` : '—'}</span>
              </div>
            </div>
            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
              {/* Current load */}
              {showCurrent && (
                <div
                  className="absolute left-0 top-0 h-full bg-slate-300 rounded-full"
                  style={{ width: `${currentPct}%` }}
                />
              )}
              {/* Additional from this container */}
              {data.hours > 0 && (
                <div
                  className={`absolute top-0 h-full rounded-full ${cfg.barClass} opacity-90`}
                  style={{
                    left: showCurrent ? `${currentPct}%` : '0%',
                    width: `${addedPct}%`,
                  }}
                />
              )}
              {/* Capacity marker */}
              {showCurrent && currentPct + addedPct > 85 && (
                <div
                  className="absolute top-0 bottom-0 w-px bg-red-500 opacity-60"
                  style={{ left: '95%' }}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Criteria Score Card ───────────────────────────────────────────────────────
function CriteriaRow({ icon: Icon, label, description, score, label: scorelabel }) {
  const scoreLabel = score >= 0.80 ? 'Excellent' : score >= 0.60 ? 'Good' : score >= 0.40 ? 'Moderate' : 'Poor'
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${getScoreColor(score)}`}>{scoreLabel}</span>
            <span className={`text-sm font-bold tabular-nums ${getScoreColor(score)}`}>
              {Math.round(score * 100)}%
            </span>
          </div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getScoreBarClass(score)}`}
            style={{ width: `${score * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  )
}

// ─── Container Detail Panel (right side) ──────────────────────────────────────
function ContainerDetail({ container, onAccept, isHighlighted }) {
  if (!container) return null

  const { initialEstimate, criteria } = container
  const priority = getPriorityConfig(container.priority)

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{container.supplier}</h2>
              {container.isRecommended && (
                <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <Star size={11} fill="white" />
                  AI Recommended
                </span>
              )}
              {isHighlighted && (
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <CheckCircle size={11} />
                  New Recommendation
                </span>
              )}
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${priority.bg} ${priority.text}`}>
                {priority.label}
              </span>
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {getCategoryAbbr(container.category)} · {container.subcategory} · {container.id}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-3xl font-black tabular-nums ${getScoreColor(criteria.overall)}`}>
              {Math.round(criteria.overall * 100)}
            </div>
            <div className="text-xs text-slate-400 font-medium">Overall Score</div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          {[
            { label: 'PO Number',       value: container.poNumber },
            { label: 'Age in Yard',     value: `${container.ageInYard} days`, highlight: container.ageInYard >= 5 },
            { label: 'Pallets',         value: container.palletCount },
            { label: 'Est. Units',      value: `~${container.estimatedUnits.toLocaleString()}` },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">{label}</div>
              <div className={`text-sm font-bold ${highlight ? 'text-red-600' : 'text-slate-800'}`}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation panel */}
      {(container.isRecommended || isHighlighted) && container.recommendationReasons.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Why this container is recommended</span>
          </div>
          <ul className="space-y-2">
            {container.recommendationReasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                <CheckCircle size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Criteria scores */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Scale size={15} className="text-slate-500" />
          Decision Criteria
        </h3>
        <div className="space-y-5">
          <CriteriaRow
            icon={Scale}
            label="Workload Balance"
            description="How evenly this container distributes work across all warehouse zones"
            score={criteria.workloadBalance.score}
          />
          <CriteriaRow
            icon={Clock}
            label="Container Age"
            description="Priority based on time in yard — older containers carry higher SLA risk"
            score={criteria.ageScore.score}
          />
          <CriteriaRow
            icon={Zap}
            label="Processing Efficiency"
            description="Predicted speed of unloading, binning and crossdocking for this product mix"
            score={criteria.processingEfficiency.score}
          />
        </div>
      </div>

      {/* Workload by zone */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <BarChart3 size={15} className="text-slate-500" />
            Projected Workload by Zone
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Info size={11} />
            {initialEstimate.certainty}% confidence
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Based on PO data and historical similar orders. Certainty increases after item scanning.
        </p>
        <WorkloadZoneChart estimate={initialEstimate} showCurrent />
      </div>

      {/* Processing breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp size={15} className="text-slate-500" />
          Processing Time Breakdown
          <span className="ml-auto text-xs font-normal text-slate-400">
            Total: <span className="font-bold text-slate-600">{initialEstimate.totalHours} h</span>
          </span>
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Unloading',     hours: initialEstimate.breakdown.unloading,     color: 'bg-blue-100 text-blue-700 border-blue-200',    icon: Truck },
            { label: 'Binning',       hours: initialEstimate.breakdown.binning,       color: 'bg-violet-100 text-violet-700 border-violet-200', icon: Layers },
            { label: 'Crossdocking',  hours: initialEstimate.breakdown.crossdocking,  color: 'bg-amber-100 text-amber-700 border-amber-200',  icon: ChevronRight },
          ].map(({ label, hours, color, icon: Icon }) => (
            <div key={label} className={`border rounded-lg p-3 ${color}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={13} />
                <span className="text-xs font-medium">{label}</span>
              </div>
              <div className="text-xl font-black tabular-nums">{hours.toFixed(1)}</div>
              <div className="text-xs opacity-70">hours</div>
            </div>
          ))}
        </div>
      </div>

      {/* Accept button */}
      <button
        onClick={() => onAccept(container.id)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Truck size={18} />
        Accept & Start Unloading {container.id}
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ─── Main View ─────────────────────────────────────────────────────────────────
const TOP_N = 10   // number of containers surfaced by the AI priority ranking

export default function ContainerSelection({ onAccept, highlightContainerId }) {
  const recommended = CONTAINERS.find(c => c.isRecommended)
  const [selectedId, setSelectedId] = useState(highlightContainerId || recommended?.id)

  const selected = CONTAINERS.find(c => c.id === selectedId)
  // Sort by AI priority score; the full yard has 312 containers — show top 10
  const topContainers = [...CONTAINERS]
    .sort((a, b) => b.criteria.overall - a.criteria.overall)
    .slice(0, TOP_N)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <SiteStatsBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Container list */}
        <div className="w-80 xl:w-96 flex-shrink-0 bg-slate-50 border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            {/* Header with total count */}
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-700">AI Priority Queue</h2>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Top {TOP_N}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Showing {TOP_N} of {SITE_STATS.pendingContainers.toLocaleString()} containers in yard · Ranked by AI priority score
            </p>
            {topContainers.map((container, rank) => (
              <ContainerCard
                key={container.id}
                container={container}
                rank={rank + 1}
                isSelected={container.id === selectedId}
                isHighlighted={container.id === highlightContainerId && container.id !== selectedId}
                onClick={() => setSelectedId(container.id)}
              />
            ))}
            {/* Footer hint */}
            <div className="mt-2 text-center text-xs text-slate-400 py-2 border-t border-slate-200">
              + {(SITE_STATS.pendingContainers - TOP_N).toLocaleString()} more containers not shown
            </div>
          </div>
        </div>

        {/* Right panel: Detail view */}
        <div className="flex-1 overflow-y-auto p-6 xl:p-8">
          {selected ? (
            <ContainerDetail
              key={selected.id}
              container={selected}
              onAccept={onAccept}
              isHighlighted={selected.id === highlightContainerId}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Package size={48} className="mb-3 opacity-30" />
              <p>Select a container to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
