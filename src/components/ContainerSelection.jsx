import { useState, useRef, useEffect } from 'react'
import {
  Star, AlertTriangle, Clock, Package, Truck, BarChart3,
  CheckCircle, ChevronRight, Info, TrendingUp, Layers,
  ShieldCheck, Zap, Scale, ArrowUpDown, Filter,
  Percent, Gauge, Container,
} from 'lucide-react'
import {
  CONTAINERS_ALL, CONTAINER_PRODUCTS, ZONE_CONFIG, SITE_STATS,
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
function ContainerCard({ container, rank, isSelected, isHighlighted, onClick, onDoubleClick }) {
  const priority = getPriorityConfig(container.priority)
  const score = container.criteria.overall

  const borderClass = isSelected
    ? 'border-blue-500 bg-blue-50'
    : isHighlighted
    ? 'border-emerald-400 bg-emerald-50 animate-pulse'
    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'

  const crossdockPercent = container.initialEstimate
    ? (container.initialEstimate.breakdown.crossdocking / container.initialEstimate.totalHours * 100).toFixed(0)
    : 0

  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
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

      {/* Additional metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Scale size={10} />
          <span>Balance:</span>
          <span className="font-semibold text-slate-700">{Math.round(container.criteria.workloadBalance.score * 100)}%</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <BarChart3 size={10} />
          <span>Total:</span>
          <span className="font-semibold text-slate-700">{container.initialEstimate?.totalHours?.toFixed(1)}h</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Percent size={10} />
          <span>Crossdock:</span>
          <span className="font-semibold text-slate-700">{crossdockPercent}%</span>
        </div>
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
function CriteriaRow({ icon: Icon, label, description, score }) {
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

// ─── Container Product Details (for double-click view) ────────────────────────────
function ContainerProductDetails({ container }) {
  const containerProducts = CONTAINER_PRODUCTS.find(cp => cp.containerId === container.id)

  if (!containerProducts || containerProducts.products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
          <Package size={48} className="mb-3 opacity-30" />
          <p className="text-sm">No product details available for this container</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <Container size={15} className="text-slate-500" />
        Products in {container.id}
      </h3>

      <div className="space-y-3">
        {containerProducts.products.map((product, idx) => (
          <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            {/* Product header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-xs font-mono text-slate-500 mb-1">{product.sku}</div>
                <div className="text-sm font-semibold text-slate-800">{product.description}</div>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Package size={11} />
                    <span>Qty: <span className="font-semibold">{product.quantity}</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={11} />
                    <span>7d Vol: <span className="font-semibold">{product.volume7Days}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone workload */}
            <div className="mt-3">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Expected Workload by Zone
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(product.zoneWorkload).map(([zone, workload]) => {
                  const zoneConfig = ZONE_CONFIG[zone]
                  return (
                    <div key={zone} className={`p-2 rounded-lg ${zoneConfig.lightClass} border ${zoneConfig.lightClass.replace('bg-', 'border-')}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${zoneConfig.dotClass}`} />
                        <span className="text-[10px] font-medium text-slate-700">{zone}</span>
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {workload}
                      </div>
                      <div className="text-[10px] text-slate-500">hours</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Container Detail Panel (right side) ──────────────────────────────────────
function ContainerDetail({ container, onAccept, isHighlighted, showProductDetails, onToggleProductDetails }) {
  if (!container) return null

  const { initialEstimate, criteria } = container
  const priority = getPriorityConfig(container.priority)
  const crossdockPercent = initialEstimate
    ? (initialEstimate.breakdown.crossdocking / initialEstimate.totalHours * 100).toFixed(0)
    : 0

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

      {/* Product details toggle */}
      <button
        onClick={onToggleProductDetails}
        className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
          showProductDetails
            ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
            : 'bg-slate-100 text-slate-700 border-2 border-slate-200 hover:bg-slate-200'
        }`}
      >
        <Container size={16} />
        {showProductDetails ? 'Hide' : 'Show'} Product Details
        <span className="text-xs text-slate-500">(Double-click to view)</span>
      </button>

      {/* Product details section */}
      {showProductDetails && (
        <ContainerProductDetails container={container} />
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
const PAGE_SIZE = 10
const SORT_OPTIONS = [
  { value: 'score-desc', label: 'Score (High to Low)' },
  { value: 'score-asc', label: 'Score (Low to High)' },
  { value: 'age-desc', label: 'Age (Oldest First)' },
  { value: 'age-asc', label: 'Age (Newest First)' },
  { value: 'workload-desc', label: 'Workload (High to Low)' },
  { value: 'workload-asc', label: 'Workload (Low to High)' },
  { value: 'balance-desc', label: 'Balance (Best First)' },
  { value: 'balance-asc', label: 'Balance (Worst First)' },
  { value: 'crossdock-desc', label: 'Crossdock % (High to Low)' },
  { value: 'crossdock-asc', label: 'Crossdock % (Low to High)' },
]

const ZONES = ['All', 'Zone A', 'Zone B', 'Zone C', 'Zone D', 'Crossdock']

export default function ContainerSelection({ onAccept, highlightContainerId }) {
  const [sortBy, setSortBy] = useState('score-desc')
  const [zoneFilter, setZoneFilter] = useState('All')
  const [minWorkload, setMinWorkload] = useState('')
  const [maxWorkload, setMaxWorkload] = useState('')
  const [minCrossdock, setMinCrossdock] = useState('')
  const [maxCrossdock, setMaxCrossdock] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const recommended = CONTAINERS_ALL.find(c => c.isRecommended)
  const [selectedId, setSelectedId] = useState(highlightContainerId || recommended?.id)
  const [showProductDetails, setShowProductDetails] = useState(false)

  const selected = CONTAINERS_ALL.find(c => c.id === selectedId)

  // Filter containers
  const filteredContainers = CONTAINERS_ALL.filter(container => {
    // Zone filter
    if (zoneFilter !== 'All') {
      const hasWorkloadInZone = Object.entries(container.initialEstimate.byZone).some(
        ([zone, data]) => zone === zoneFilter && data.hours > 0
      )
      if (!hasWorkloadInZone) return false
    }

    // Workload filter
    if (minWorkload !== '' && container.initialEstimate.totalHours < parseFloat(minWorkload)) return false
    if (maxWorkload !== '' && container.initialEstimate.totalHours > parseFloat(maxWorkload)) return false

    // Crossdock percentage filter
    const crossdockPercent = (container.initialEstimate.breakdown.crossdocking / container.initialEstimate.totalHours * 100)
    if (minCrossdock !== '' && crossdockPercent < parseFloat(minCrossdock)) return false
    if (maxCrossdock !== '' && crossdockPercent > parseFloat(maxCrossdock)) return false

    return true
  })

  // Sort containers
  const sortedContainers = [...filteredContainers].sort((a, b) => {
    switch (sortBy) {
      case 'score-desc':
        return b.criteria.overall - a.criteria.overall
      case 'score-asc':
        return a.criteria.overall - b.criteria.overall
      case 'age-desc':
        return b.ageInYard - a.ageInYard
      case 'age-asc':
        return a.ageInYard - b.ageInYard
      case 'workload-desc':
        return b.initialEstimate.totalHours - a.initialEstimate.totalHours
      case 'workload-asc':
        return a.initialEstimate.totalHours - b.initialEstimate.totalHours
      case 'balance-desc':
        return b.criteria.workloadBalance.score - a.criteria.workloadBalance.score
      case 'balance-asc':
        return a.criteria.workloadBalance.score - b.criteria.workloadBalance.score
      case 'crossdock-desc':
        return (b.initialEstimate.breakdown.crossdocking / b.initialEstimate.totalHours) - (a.initialEstimate.breakdown.crossdocking / a.initialEstimate.totalHours)
      case 'crossdock-asc':
        return (a.initialEstimate.breakdown.crossdocking / a.initialEstimate.totalHours) - (b.initialEstimate.breakdown.crossdocking / b.initialEstimate.totalHours)
      default:
        return 0
    }
  })

  const visibleContainers = sortedContainers.slice(0, visibleCount)
  const totalCount = sortedContainers.length
  const hasMore = visibleCount < totalCount

  // Infinite scroll
  const lastElementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, totalCount))
        }
      },
      { threshold: 0.1 }
    )

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, totalCount])

  // Update visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [sortBy, zoneFilter, minWorkload, maxWorkload, minCrossdock, maxCrossdock])

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
                Top {PAGE_SIZE}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Showing {visibleContainers.length} of {totalCount} containers in yard · Scroll for more
            </p>

            {/* Filters */}
            <div className="mb-3 p-3 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={12} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">Filters</span>
              </div>

              {/* Sort by */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">Sort by</span>
                  <ArrowUpDown size={10} className="text-slate-400" />
                </div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Zone filter */}
              <div className="mb-2">
                <span className="text-[10px] text-slate-500 block mb-1">Zone with workload</span>
                <select
                  value={zoneFilter}
                  onChange={e => setZoneFilter(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {ZONES.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              {/* Workload range */}
              <div className="mb-2">
                <span className="text-[10px] text-slate-500 block mb-1">Total workload (hours)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minWorkload}
                    onChange={e => setMinWorkload(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-xs text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxWorkload}
                    onChange={e => setMaxWorkload(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Crossdock percentage range */}
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">Crossdock %</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="100"
                    value={minCrossdock}
                    onChange={e => setMinCrossdock(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-xs text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="100"
                    value={maxCrossdock}
                    onChange={e => setMaxCrossdock(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Container cards */}
            {visibleContainers.map((container, rank) => (
              <ContainerCard
                key={container.id}
                container={container}
                rank={rank + 1}
                isSelected={container.id === selectedId}
                isHighlighted={container.id === highlightContainerId && container.id !== selectedId}
                onClick={() => setSelectedId(container.id)}
                onDoubleClick={() => {
                  setSelectedId(container.id)
                  setShowProductDetails(true)
                }}
              />
            ))}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={lastElementRef} className="py-4 text-center text-xs text-slate-400">
                Loading more containers...
              </div>
            )}

            {/* Footer hint */}
            <div className="mt-2 text-center text-xs text-slate-400 py-2 border-t border-slate-200">
              +{(totalCount - visibleContainers.length).toLocaleString()} more containers not shown
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
              showProductDetails={showProductDetails}
              onToggleProductDetails={() => setShowProductDetails(!showProductDetails)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Package size={48} className="mb-3 opacity-30" />
              <p>Select a container to see details</p>
              <p className="text-xs mt-2 text-slate-500">Double-click to view product details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
