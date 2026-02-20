import { useState, useCallback } from 'react'
import {
  Package, Scan, AlertTriangle, CheckCircle, Thermometer,
  Maximize2, Truck, Clock, BarChart3, ArrowRight,
  RefreshCw, Star, ChevronRight, Layers, Zap, Scale,
  Box, Weight, Ruler, ShieldAlert,
} from 'lucide-react'
import {
  CONTAINERS, ZONE_CONFIG, SCAN_ITEMS,
  getScoreColor, getScoreBarClass, getPriorityConfig, getCategoryAbbr,
} from '../mockData.js'

// ─── Certainty Meter ───────────────────────────────────────────────────────────
function CertaintyMeter({ value }) {
  const color = value >= 85 ? 'bg-green-500' : value >= 70 ? 'bg-blue-500' : 'bg-amber-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">Estimate certainty</span>
        <span className={`text-sm font-bold tabular-nums ${value >= 85 ? 'text-green-600' : value >= 70 ? 'text-blue-600' : 'text-amber-600'}`}>
          {value}%
        </span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

// ─── Updated Workload Chart ────────────────────────────────────────────────────
function LiveWorkloadChart({ container, phase }) {
  const initial = container.initialEstimate
  const updated = container.updatedEstimate
  const estimate = phase === 'updated' ? updated : initial
  const maxHours = 20

  return (
    <div className="space-y-3">
      {Object.entries(estimate.byZone).map(([zone, data]) => {
        const cfg = ZONE_CONFIG[zone]
        const initialData = initial.byZone[zone]
        const updatedData = updated?.byZone[zone]

        const barWidth = Math.min((data.hours / maxHours) * 100, 100)
        const initialWidth = Math.min((initialData.hours / maxHours) * 100, 100)
        const isChanged = updatedData && Math.abs(updatedData.hours - initialData.hours) > 0.5
        const isNew = phase === 'updated' && isChanged && updatedData.hours > initialData.hours

        return (
          <div key={zone}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                <span className="text-xs font-medium text-slate-700">{zone}</span>
                {isNew && (
                  <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <AlertTriangle size={8} />
                    UPDATED
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs">
                {phase === 'updated' && isChanged && (
                  <span className="text-slate-400 line-through tabular-nums">{initialData.hours.toFixed(1)} h</span>
                )}
                <span className={`font-semibold tabular-nums ${isNew ? 'text-red-600' : cfg.textClass}`}>
                  {data.hours > 0 ? `${data.hours.toFixed(1)} h` : '—'}
                </span>
              </div>
            </div>
            <div className="relative h-3.5 bg-slate-100 rounded-full overflow-hidden">
              {/* Initial estimate (shown faded when updated) */}
              {phase === 'updated' && isChanged && (
                <div
                  className={`absolute left-0 top-0 h-full rounded-full opacity-25 ${cfg.barClass}`}
                  style={{ width: `${initialWidth}%` }}
                />
              )}
              {/* Current estimate */}
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${isNew ? 'bg-red-500' : cfg.barClass}`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Scanned Item Card ─────────────────────────────────────────────────────────
function ScannedItemCard({ item, index, isLatest }) {
  const alertColors = {
    'cold-chain': 'border-l-blue-500 bg-blue-50',
    'oversized':  'border-l-amber-500 bg-amber-50',
    'critical':   'border-l-red-500 bg-red-50',
  }
  const alertBg = item.alert
    ? (item.alert.severity === 'critical' ? alertColors.critical : alertColors[item.alert.type])
    : 'border-l-slate-200 bg-white'

  return (
    <div className={`border-l-4 rounded-r-lg p-3 mb-2 animate-fade-in ${alertBg} ${isLatest ? 'ring-1 ring-inset ring-slate-300' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-slate-400">{item.id}</span>
            {item.requiresColdChain && (
              <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                <Thermometer size={9} />
                COLD CHAIN
              </span>
            )}
            {item.oversized && (
              <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                <Maximize2 size={9} />
                OVERSIZED
              </span>
            )}
            {item.fragile && (
              <span className="inline-flex items-center gap-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                <ShieldAlert size={9} />
                FRAGILE
              </span>
            )}
          </div>
          <div className="font-semibold text-sm text-slate-800 mt-0.5">{item.brand}</div>
          <div className="text-xs text-slate-500">{item.description}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-xs font-bold px-2 py-1 rounded-lg ${ZONE_CONFIG[item.destination]?.lightClass || 'bg-slate-100'} ${ZONE_CONFIG[item.destination]?.textClass || 'text-slate-600'} border`}>
            {item.destination}
          </div>
          <div className="text-xs text-slate-400 mt-1">{item.handlingMinutes} min</div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <Weight size={10} className="text-slate-400" />
          {item.weightKg} kg
        </span>
        <span className="flex items-center gap-1">
          <Ruler size={10} className="text-slate-400" />
          {item.dimensions}
        </span>
        <span className="flex items-center gap-1">
          <Box size={10} className="text-slate-400" />
          {item.color}
        </span>
      </div>

      {item.requiresColdChain && item.coldChainTemp && (
        <div className="flex items-center gap-1 mt-1.5 text-xs text-blue-700 font-medium">
          <Thermometer size={11} />
          Required temperature: {item.coldChainTemp}
        </div>
      )}

      {/* Alert */}
      {item.alert && (
        <div className={`mt-2 flex items-start gap-1.5 text-xs rounded p-1.5 ${
          item.alert.severity === 'critical'
            ? 'bg-red-100 text-red-700'
            : item.alert.type === 'cold-chain'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" />
          {item.alert.message}
        </div>
      )}
    </div>
  )
}

// ─── Recommendation Change Banner ──────────────────────────────────────────────
function RecommendationChangeBanner({ currentContainer, newContainer, onSwitch, onContinue }) {
  return (
    <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5 animate-slide-down">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
          <AlertTriangle size={18} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-amber-900 text-sm">Workload Re-estimation Complete — Recommendation Changed</div>
          <div className="text-xs text-amber-700">Scan data revealed undeclared cold-chain requirements</div>
        </div>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-xs text-red-500 font-bold mb-1 flex items-center gap-1">
            <AlertTriangle size={10} />
            CURRENT CONTAINER
          </div>
          <div className="font-bold text-slate-800 text-sm">{currentContainer.id}</div>
          <div className="text-xs text-slate-500 mb-2">{currentContainer.category}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Est. workload:</span>
            <span className="text-xs line-through text-slate-400">{currentContainer.initialEstimate.totalHours} h</span>
            <span className="text-sm font-bold text-red-600">→ {currentContainer.updatedEstimate.totalHours} h</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500">Score:</span>
            <span className="text-xs line-through text-slate-400">{Math.round(currentContainer.criteria.overall * 100)}%</span>
            <span className="text-sm font-bold text-red-600">→ {Math.round(currentContainer.updatedCriteria.overall * 100)}%</span>
          </div>
          <div className="mt-2 text-xs text-red-600 bg-red-100 rounded p-1.5 leading-tight">
            Zone D (Cold Storage) will exceed 100% capacity
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="text-xs text-emerald-600 font-bold mb-1 flex items-center gap-1">
            <Star size={10} fill="currentColor" />
            NEW RECOMMENDATION
          </div>
          <div className="font-bold text-slate-800 text-sm">{newContainer.id}</div>
          <div className="text-xs text-slate-500 mb-2">{newContainer.category}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Est. workload:</span>
            <span className="text-sm font-bold text-emerald-700">{newContainer.initialEstimate.totalHours} h</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500">Score:</span>
            <span className="text-sm font-bold text-emerald-700">{Math.round(newContainer.criteria.overall * 100)}%</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 bg-emerald-100 rounded p-1.5 leading-tight">
            Zero cold-chain requirements — avoids Zone D overload
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onContinue}
          className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors"
        >
          Continue with {currentContainer.id}
        </button>
        <button
          onClick={onSwitch}
          className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          Switch to {newContainer.id}
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ─── Main View ─────────────────────────────────────────────────────────────────
export default function UnloadingBay({ containerId, onBack, onSwitchContainer }) {
  const container = CONTAINERS.find(c => c.id === containerId)
  const newRecContainer = CONTAINERS.find(c => c.isUpdatedRecommended)

  const [scannedItems, setScannedItems] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [estimationPhase, setEstimationPhase] = useState('initial')  // 'initial' | 'recalculating' | 'updated'
  const [showRecommendationBanner, setShowRecommendationBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const coldChainCount = scannedItems.filter(i => i.requiresColdChain).length
  const alertCount = scannedItems.filter(i => i.alert).length
  const totalHandlingMinutes = scannedItems.reduce((sum, i) => sum + i.handlingMinutes, 0)

  const allScanned = scannedItems.length >= SCAN_ITEMS.length
  const canScan = !isScanning && !allScanned && estimationPhase !== 'recalculating'

  // Certainty increases as more items are scanned
  const certainty = Math.min(
    container.initialEstimate.certainty + Math.round(scannedItems.length * 3.2),
    estimationPhase === 'updated' ? container.updatedEstimate.certainty : 88
  )

  const handleScan = useCallback(() => {
    if (!canScan) return
    const nextIndex = scannedItems.length
    const nextItem = SCAN_ITEMS[nextIndex]
    if (!nextItem) return

    setIsScanning(true)

    setTimeout(() => {
      setIsScanning(false)
      setScannedItems(prev => [nextItem, ...prev])  // prepend so latest is on top

      // Check if this item triggers re-estimation
      if (nextItem.triggersReestimation) {
        setTimeout(() => {
          setEstimationPhase('recalculating')
          setTimeout(() => {
            setEstimationPhase('updated')
            setShowRecommendationBanner(true)
          }, 2400)
        }, 600)
      }
    }, 1700)
  }, [canScan, scannedItems.length])

  if (!container) return null

  const priority = getPriorityConfig(container.priority)
  const currentEstimate = estimationPhase === 'updated' ? container.updatedEstimate : container.initialEstimate
  const currentCriteria = estimationPhase === 'updated' ? container.updatedCriteria : container.criteria

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Container header bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{container.supplier}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priority.bg} ${priority.text}`}>
                {priority.label}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {container.dockAssigned}
              </span>
            </div>
            <div className="text-xs text-slate-500">{getCategoryAbbr(container.category)} · {container.id} · PO {container.poNumber}</div>
          </div>
        </div>
        <div className="flex items-center gap-6 ml-6 pl-6 border-l border-slate-200 text-sm">
          <div className="text-center">
            <div className="font-bold text-slate-800">{scannedItems.length} / {SCAN_ITEMS.length}</div>
            <div className="text-xs text-slate-400">Items scanned</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${coldChainCount > 0 ? 'text-blue-600' : 'text-slate-800'}`}>{coldChainCount}</div>
            <div className="text-xs text-slate-400">Cold-chain</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${alertCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>{alertCount}</div>
            <div className="text-xs text-slate-400">Alerts</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-800">{totalHandlingMinutes} min</div>
            <div className="text-xs text-slate-400">Handling so far</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 ml-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Unloading progress</span>
            <span>{Math.round((scannedItems.length / SCAN_ITEMS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(scannedItems.length / SCAN_ITEMS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Scanning area */}
        <div className="w-[52%] flex flex-col overflow-hidden border-r border-slate-200">
          {/* Recommendation change banner */}
          {showRecommendationBanner && !dismissed && (
            <div className="p-4 border-b border-amber-200 bg-amber-50 flex-shrink-0">
              <RecommendationChangeBanner
                currentContainer={container}
                newContainer={newRecContainer}
                onSwitch={() => onSwitchContainer(newRecContainer.id)}
                onContinue={() => setDismissed(true)}
              />
            </div>
          )}

          {/* Scanner interface */}
          <div className="p-4 border-b border-slate-200 flex-shrink-0 bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Scan size={16} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-200">Vision Scanner — Conveyor Belt</span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">LIVE</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{container.truckId}</span>
            </div>

            {/* Scanner viewport */}
            <div className="relative bg-slate-800 rounded-lg overflow-hidden mb-3" style={{ height: 120 }}>
              {isScanning ? (
                <>
                  {/* Scanning animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-slate-400 text-xs">Analyzing item…</div>
                  </div>
                  {/* Scan line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-red-500 opacity-80 animate-scan-line shadow-lg shadow-red-500/50" />
                  {/* Corner brackets */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-red-500" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-red-500" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-red-500" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-red-500" />
                </>
              ) : scannedItems.length > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <CheckCircle size={28} className="text-green-400 mx-auto mb-1" />
                    <div className="text-green-400 text-xs font-semibold">{scannedItems[0]?.id} captured</div>
                    <div className="text-slate-400 text-xs mt-0.5">{scannedItems[0]?.brand}</div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-600">
                    <Package size={28} className="mx-auto mb-1" />
                    <div className="text-xs">Ready to scan</div>
                  </div>
                </div>
              )}
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            <button
              onClick={handleScan}
              disabled={!canScan}
              className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                isScanning
                  ? 'bg-red-900 text-red-300 cursor-not-allowed'
                  : estimationPhase === 'recalculating'
                  ? 'bg-amber-900 text-amber-300 cursor-not-allowed'
                  : allScanned
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Scanning…
                </>
              ) : estimationPhase === 'recalculating' ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Re-estimating workload…
                </>
              ) : allScanned ? (
                <>
                  <CheckCircle size={15} />
                  All items scanned
                </>
              ) : (
                <>
                  <Scan size={15} />
                  Scan Next Item
                  <span className="text-blue-300 text-xs ml-1">
                    ({SCAN_ITEMS.length - scannedItems.length} remaining)
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Scanned items list */}
          <div className="flex-1 overflow-y-auto p-4">
            {scannedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Package size={40} className="mb-3 opacity-30" />
                <p className="text-sm">No items scanned yet</p>
                <p className="text-xs text-slate-300 mt-1">Press "Scan Next Item" to begin unloading</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-600">
                    Scanned Items ({scannedItems.length})
                  </span>
                  <span className="text-xs text-slate-400">Most recent first</span>
                </div>
                {scannedItems.map((item, i) => (
                  <ScannedItemCard key={item.id} item={item} index={i} isLatest={i === 0} />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right: Live estimates */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Estimation status */}
          <div className={`rounded-xl border p-4 ${
            estimationPhase === 'updated'
              ? 'bg-red-50 border-red-200'
              : estimationPhase === 'recalculating'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {estimationPhase === 'recalculating' ? (
                  <RefreshCw size={15} className="text-amber-500 animate-spin" />
                ) : estimationPhase === 'updated' ? (
                  <AlertTriangle size={15} className="text-red-500" />
                ) : (
                  <BarChart3 size={15} className="text-slate-500" />
                )}
                <span className={`text-sm font-semibold ${
                  estimationPhase === 'updated' ? 'text-red-800'
                  : estimationPhase === 'recalculating' ? 'text-amber-800'
                  : 'text-slate-700'
                }`}>
                  {estimationPhase === 'recalculating'
                    ? 'Recalculating workload estimate…'
                    : estimationPhase === 'updated'
                    ? 'Estimate Updated — Significant Deviation'
                    : 'Live Workload Estimate'}
                </span>
              </div>
              <span className={`text-xl font-black tabular-nums ${
                estimationPhase === 'updated' ? 'text-red-600' : 'text-slate-800'
              }`}>
                {currentEstimate.totalHours} h
                {estimationPhase === 'updated' && (
                  <span className="text-sm font-medium text-red-500 ml-1">
                    (+{(container.updatedEstimate.totalHours - container.initialEstimate.totalHours).toFixed(1)})
                  </span>
                )}
              </span>
            </div>

            {estimationPhase === 'updated' && (
              <p className="text-xs text-red-600 mb-3 bg-red-100 rounded-lg p-2">
                3 undeclared cold-chain items detected. Original estimate: {container.initialEstimate.totalHours} h.
                Updated: <strong>{container.updatedEstimate.totalHours} h (+{Math.round(((container.updatedEstimate.totalHours - container.initialEstimate.totalHours) / container.initialEstimate.totalHours) * 100)}%)</strong>.
                Zone D (Cold Storage) projected to exceed capacity.
              </p>
            )}

            <CertaintyMeter value={certainty} />
          </div>

          {/* Workload by zone */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BarChart3 size={14} className="text-slate-500" />
              Workload by Zone
              {estimationPhase === 'updated' && (
                <span className="ml-auto text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                  REVISED
                </span>
              )}
            </h3>
            {estimationPhase === 'recalculating' ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <RefreshCw size={28} className="animate-spin mb-3 text-amber-400" />
                <p className="text-sm text-amber-600 font-medium">Re-estimating based on scan data…</p>
                <p className="text-xs text-slate-400 mt-1">Integrating cold-chain routing constraints</p>
              </div>
            ) : (
              <LiveWorkloadChart container={container} phase={estimationPhase} />
            )}
          </div>

          {/* Updated criteria (only shown after re-estimation) */}
          {estimationPhase === 'updated' && currentCriteria && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Scale size={14} className="text-slate-500" />
                Updated Decision Criteria
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'workloadBalance', icon: Scale, label: 'Workload Balance' },
                  { key: 'ageScore', icon: Clock, label: 'Container Age' },
                  { key: 'processingEfficiency', icon: Zap, label: 'Processing Efficiency' },
                ].map(({ key, icon: Icon, label }) => {
                  const original = container.criteria[key].score
                  const updated = currentCriteria[key].score
                  const changed = Math.abs(updated - original) > 0.05
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-700">{label}</span>
                          <div className="flex items-center gap-1.5 text-xs">
                            {changed && (
                              <span className="line-through text-slate-400 tabular-nums">
                                {Math.round(original * 100)}%
                              </span>
                            )}
                            <span className={`font-bold tabular-nums ${getScoreColor(updated)}`}>
                              {Math.round(updated * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${getScoreBarClass(updated)}`}
                            style={{ width: `${updated * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
                {/* Overall score */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-700">Overall Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm line-through text-slate-400">
                      {Math.round(container.criteria.overall * 100)}%
                    </span>
                    <span className={`text-lg font-black tabular-nums ${getScoreColor(currentCriteria.overall)}`}>
                      {Math.round(currentCriteria.overall * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Truck size={14} className="text-slate-500" />
              Processing Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Unloading',    hours: currentEstimate.breakdown.unloading,    color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: 'Binning',      hours: currentEstimate.breakdown.binning,      color: 'bg-violet-50 text-violet-700 border-violet-200' },
                { label: 'Crossdocking', hours: currentEstimate.breakdown.crossdocking, color: 'bg-amber-50 text-amber-700 border-amber-200' },
              ].map(({ label, hours, color }) => (
                <div key={label} className={`border rounded-lg p-2 ${color}`}>
                  <div className="text-xs font-medium opacity-80 mb-0.5">{label}</div>
                  <div className="text-lg font-black tabular-nums">{hours.toFixed(1)}</div>
                  <div className="text-xs opacity-60">h</div>
                </div>
              ))}
            </div>
          </div>

          {/* New recommendation hint (before banner appears) */}
          {estimationPhase === 'initial' && coldChainCount === 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 animate-fade-in">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-medium">
                <Thermometer size={14} />
                Cold-chain item detected. Continue scanning to update workload estimates…
              </div>
            </div>
          )}
          {estimationPhase === 'initial' && coldChainCount === 2 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-medium">
                <AlertTriangle size={14} />
                2nd cold-chain item detected. Zone D utilization risk increasing…
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
