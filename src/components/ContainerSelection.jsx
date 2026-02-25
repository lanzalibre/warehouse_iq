import { useState, useRef, useEffect } from 'react'
import {
  AlertTriangle, Clock, Package, Truck, BarChart3,
  ChevronRight, Container, Zap,
} from 'lucide-react'
import {
  CONTAINERS_ALL, CONTAINER_PRODUCTS, ZONE_CONFIG, SITE_STATS,
  HISTORICAL_PO_CONTAINERS,
  getPriorityConfig, getCategoryAbbr,
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
        <BarChart3 size={13} />
        <span className="text-xs">Avg cycle: {SITE_STATS.avgCycleTimeHours} h/container</span>
      </div>
    </div>
  )
}

// ─── Processing Method Config ──────────────────────────────────────────────────
const PM_CONFIG = [
  { key: 'CR',      barClass: 'bg-blue-500',    chipClass: 'bg-blue-100 text-blue-700' },
  { key: 'PR',      barClass: 'bg-violet-500',  chipClass: 'bg-violet-100 text-violet-700' },
  { key: 'FBD',     barClass: 'bg-emerald-500', chipClass: 'bg-emerald-100 text-emerald-700' },
  { key: 'PTL',     barClass: 'bg-amber-500',   chipClass: 'bg-amber-100 text-amber-700' },
  { key: 'XDK',     barClass: 'bg-yellow-500',  chipClass: 'bg-yellow-100 text-yellow-700' },
  { key: 'NonCon',  barClass: 'bg-orange-500',  chipClass: 'bg-orange-100 text-orange-700' },
  { key: 'Hazard',  barClass: 'bg-red-400',     chipClass: 'bg-red-100 text-red-600' },
]

// ─── Container Card (left panel) ──────────────────────────────────────────────
function ContainerCard({ container, rank, isSelected, onClick, onDoubleClick }) {
  const priority = getPriorityConfig(container.priority)

  const borderClass = isSelected
    ? 'border-blue-500 bg-blue-50'
    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'

  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`w-full text-left rounded-xl border-2 p-3 mb-2 transition-all ${borderClass}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {/* Rank badge */}
          <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
            rank === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {rank}
          </span>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-800 text-sm">{container.supplier}</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{getCategoryAbbr(container.category)} · {container.id}</div>
          </div>
        </div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${priority.bg} ${priority.text}`}>
          {priority.label}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-600 mb-2">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {container.ageInYard}d in yard
        </span>
        <span className="flex items-center gap-1 text-slate-500">
          <BarChart3 size={11} />
          {container.initialEstimate?.totalHours?.toFixed(1)}h total
        </span>
      </div>

      {/* Processing method pills + stacked bar */}
      <div className="mb-2">
        <div className="flex flex-wrap gap-1 mb-1">
          {PM_CONFIG.filter(pm => (container.initialEstimate.processingMethods?.[pm.key] ?? 0) > 0)
            .map(pm => (
              <span key={pm.key} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${pm.chipClass}`}>
                {pm.key} {container.initialEstimate.processingMethods[pm.key].toFixed(1)}h
              </span>
            ))}
        </div>
        <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100">
          {PM_CONFIG.filter(pm => (container.initialEstimate.processingMethods?.[pm.key] ?? 0) > 0)
            .map(pm => {
              const pct = (container.initialEstimate.processingMethods[pm.key] / container.initialEstimate.totalHours) * 100
              return <div key={pm.key} className={pm.barClass} style={{ width: `${pct}%` }} />
            })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSelected && <ChevronRight size={14} className="text-blue-500 flex-shrink-0" />}
      </div>
    </button>
  )
}

// ─── PO Contents Box ──────────────────────────────────────────────────────────
function POContentsBox({ container }) {
  const [activeTab, setActiveTab] = useState('this')

  const containerProducts = CONTAINER_PRODUCTS.find(cp => cp.containerId === container.id)
  const siblingContainers = CONTAINERS_ALL.filter(
    c => c.poNumber === container.poNumber && c.id !== container.id
  )
  const historicalPO = HISTORICAL_PO_CONTAINERS.find(h => h.poNumber === container.poNumber)
  const hasSamePOData = siblingContainers.length > 0 || (historicalPO?.pastContainers?.length ?? 0) > 0

  const getMethodChip = (method) => {
    const cfg = PM_CONFIG.find(p => p.key === method)
    return cfg?.chipClass ?? 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Package size={15} className="text-slate-500" />
          PO Contents
        </h3>
        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          {container.poNumber}
        </span>
      </div>

      {/* Tab bar — only shown if same-PO data exists */}
      {hasSamePOData && (
        <div className="flex gap-1 mb-4 border-b border-slate-100 pb-2">
          <button
            onClick={() => setActiveTab('this')}
            className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
              activeTab === 'this' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            This Container
          </button>
          <button
            onClick={() => setActiveTab('same-po')}
            className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
              activeTab === 'same-po' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Same PO ({siblingContainers.length + (historicalPO?.pastContainers?.length ?? 0)})
          </button>
        </div>
      )}

      {/* Tab: This Container */}
      {activeTab === 'this' && (
        <>
          {!containerProducts || containerProducts.products.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No SKU details available</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 border-b border-slate-100">
                  <th className="text-left pb-1.5 font-medium">SKU</th>
                  <th className="text-left pb-1.5 font-medium">Division</th>
                  <th className="text-right pb-1.5 font-medium">Qty</th>
                  <th className="text-right pb-1.5 font-medium">Fcst. hrs</th>
                  <th className="text-right pb-1.5 font-medium">Method</th>
                </tr>
              </thead>
              <tbody>
                {containerProducts.products.map((p, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0">
                    <td className="py-1.5 font-mono text-[10px] text-slate-600">{p.sku}</td>
                    <td className="py-1.5 text-slate-500">{p.division ?? '—'}</td>
                    <td className="py-1.5 text-right font-semibold text-slate-700">{p.quantity}</td>
                    <td className="py-1.5 text-right text-slate-600">{p.forecastedProcessingHours?.toFixed(1) ?? '—'}h</td>
                    <td className="py-1.5 text-right">
                      {p.processingMethod ? (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getMethodChip(p.processingMethod)}`}>
                          {p.processingMethod}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Tab: Same PO */}
      {activeTab === 'same-po' && (
        <div className="space-y-4">
          {/* In Yard (Not Yet Processed) */}
          {siblingContainers.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                In Yard (Not Yet Processed)
              </div>
              {siblingContainers.map(sibling => {
                const siblingProducts = CONTAINER_PRODUCTS.find(cp => cp.containerId === sibling.id)
                return (
                  <div key={sibling.id} className="mb-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700">{sibling.id}</span>
                      <span className="text-[10px] text-slate-400">{sibling.supplier} · {sibling.ageInYard}d in yard</span>
                    </div>
                    {siblingProducts?.products?.length ? (
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-[10px] text-slate-400 border-b border-slate-100">
                            <th className="text-left pb-1 font-medium">SKU</th>
                            <th className="text-right pb-1 font-medium">Qty</th>
                            <th className="text-right pb-1 font-medium">Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          {siblingProducts.products.map((p, idx) => (
                            <tr key={idx} className="border-b border-slate-50 last:border-0">
                              <td className="py-1 font-mono text-[10px] text-slate-600">{p.sku}</td>
                              <td className="py-1 text-right font-semibold text-slate-700">{p.quantity}</td>
                              <td className="py-1 text-right">
                                {p.processingMethod ? (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getMethodChip(p.processingMethod)}`}>
                                    {p.processingMethod}
                                  </span>
                                ) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-[10px] text-slate-400">No SKU details</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Previously Processed */}
          {historicalPO?.pastContainers?.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Previously Processed
              </div>
              {historicalPO.pastContainers.map(past => (
                <div key={past.containerId} className="mb-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">{past.containerId}</span>
                    <span className="text-[10px] text-slate-400">Processed {past.processedDate}</span>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[10px] text-slate-400 border-b border-slate-100">
                        <th className="text-left pb-1 font-medium">SKU</th>
                        <th className="text-left pb-1 font-medium">Division</th>
                        <th className="text-right pb-1 font-medium">Qty</th>
                        <th className="text-right pb-1 font-medium">Actual hrs</th>
                        <th className="text-right pb-1 font-medium">Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {past.skus.map((s, idx) => (
                        <tr key={idx} className="border-b border-slate-50 last:border-0">
                          <td className="py-1 font-mono text-[10px] text-slate-600">{s.sku}</td>
                          <td className="py-1 text-slate-500">{s.division}</td>
                          <td className="py-1 text-right font-semibold text-slate-700">{s.quantity}</td>
                          <td className="py-1 text-right text-slate-600">{s.actualTimeHours.toFixed(1)}h</td>
                          <td className="py-1 text-right">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getMethodChip(s.actualMethod)}`}>
                              {s.actualMethod}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


// ─── Container Detail Panel (right side) ──────────────────────────────────────
function ContainerDetail({ container, onAccept }) {
  if (!container) return null

  const { initialEstimate } = container
  const priority = getPriorityConfig(container.priority)

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{container.supplier}</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${priority.bg} ${priority.text}`}>
                {priority.label}
              </span>
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {getCategoryAbbr(container.category)} · {container.subcategory} · {container.id}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
          {[
            { label: 'PO Number',   value: container.poNumber },
            { label: 'Age in Yard', value: `${container.ageInYard} days`, highlight: container.ageInYard >= 5 },
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

      {/* PO Contents */}
      <POContentsBox container={container} />

      {/* Workload by Zone */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <BarChart3 size={15} className="text-slate-500" />
          Workload Distribution by Zone
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(container.initialEstimate.byZone).map(([zone, data]) => {
            const cfg = ZONE_CONFIG[zone]
            return (
              <div key={zone} className={`p-3 rounded-lg ${cfg.lightClass} border ${cfg.lightClass.replace('bg-', 'border-')}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                  <span className="text-[10px] font-medium text-slate-700">{zone}</span>
                  <span className="text-[10px] text-slate-400">{cfg.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="text-xl font-bold text-slate-800">{data.hours.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-500">hours</div>
                  </div>
                  <div className="text-xs text-slate-400">{data.units > 0 ? `${data.units} units` : '—'}</div>
                </div>
              </div>
            )
          })}
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

export default function ContainerSelection({ onAccept }) {
  const [prioritizeBy, setPrioritizeBy] = useState('none')
  const [filterOutMethods, setFilterOutMethods] = useState([])
  const [autoLaunch, setAutoLaunch] = useState(false)
  const [visibleCount, setVisibleCount] = useState(50)

  const recommended = CONTAINERS_ALL.find(c => c.isRecommended)
  const [selectedId, setSelectedId] = useState(recommended?.id)

  const selected = CONTAINERS_ALL.find(c => c.id === selectedId)

  // Filter containers
  const filteredContainers = CONTAINERS_ALL.filter(container => {
    if (filterOutMethods.length === 0) return true
    const pm = container.initialEstimate.processingMethods
    if (!pm) return true
    const topMethod = Object.entries(pm).sort((a, b) => b[1] - a[1])[0]?.[0]
    return !filterOutMethods.includes(topMethod)
  })

  // Sort containers
  const sortedContainers = [...filteredContainers].sort((a, b) => {
    if (prioritizeBy === 'age') return b.ageInYard - a.ageInYard
    if (prioritizeBy === 'xdk') {
      const xA = a.initialEstimate.processingMethods?.XDK ?? 0
      const xB = b.initialEstimate.processingMethods?.XDK ?? 0
      return xB - xA
    }
    return b.criteria.overall - a.criteria.overall
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
          setVisibleCount(prev => Math.min(prev + 10, totalCount))
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
    setVisibleCount(50)
  }, [prioritizeBy, filterOutMethods])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <SiteStatsBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Container list */}
        <div className="w-80 xl:w-96 flex-shrink-0 bg-slate-50 border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Containers in Yard</h2>
            </div>

            {/* Filters */}
            <div className="mb-3 p-3 bg-white rounded-lg border border-slate-200 space-y-3">
              {/* Prioritize by */}
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Prioritize by</label>
                <select
                  value={prioritizeBy}
                  onChange={e => setPrioritizeBy(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="none">Default (Score)</option>
                  <option value="age">Age (Oldest First)</option>
                  <option value="xdk">XDK Hours (Highest First)</option>
                </select>
              </div>

              {/* Filter out by processing method */}
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Filter out by processing method</label>
                <div className="flex flex-wrap gap-1">
                  {['FBD','PTL','CR','PR','XDK','NonCon','Hazard'].map(method => (
                    <button
                      key={method}
                      onClick={() => setFilterOutMethods(prev =>
                        prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method])}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                        filterOutMethods.includes(method)
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Launch toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div>
                  <div className="text-xs font-medium text-slate-700">Auto Launch to Yard</div>
                  <div className="text-[10px] text-slate-400">Follows selected priority order</div>
                </div>
                <button
                  onClick={() => setAutoLaunch(prev => !prev)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    autoLaunch ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    autoLaunch ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              {autoLaunch && (
                <p className="text-[10px] text-blue-600 bg-blue-50 rounded px-2 py-1">
                  Auto-launch ON — containers will be queued in {prioritizeBy === 'age' ? 'age' : prioritizeBy === 'xdk' ? 'XDK hours' : 'score'} order
                </p>
              )}
            </div>

            {/* Container cards */}
            {visibleContainers.map((container, rank) => (
              <ContainerCard
                key={container.id}
                container={container}
                rank={rank + 1}
                isSelected={container.id === selectedId}
                onClick={() => setSelectedId(container.id)}
              />
            ))}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={lastElementRef} className="py-4 text-center text-xs text-slate-400">
                Loading more containers...
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Detail view */}
        <div className="flex-1 overflow-y-auto p-6 xl:p-8">
          {selected ? (
            <ContainerDetail
              key={selected.id}
              container={selected}
              onAccept={onAccept}
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
