import { useState, useRef, useEffect } from 'react'
import { BarChart3, Clock, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Package, Loader, MousePointerClick } from 'lucide-react'
import { WAVE_ORDER_DATA, PROJECTIONS, LABOR_PERIOD_DATA } from '../../mockData.js'
import HorizontalBarChart from './HorizontalBarChart.jsx'
import ProjectionPanel from './ProjectionPanel.jsx'

const PAGE_SIZE = 6

// ─── Period Selector ───────────────────────────────────────────────────────
function PeriodSelector({ period, setPeriod }) {
  const periods = ['shift', 'today', 'twodays', 'week']
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">Period:</span>
      <div className="flex gap-1">
        {periods.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              period === p
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {LABOR_PERIOD_DATA[p].label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Summary Statistics ─────────────────────────────────────────────────────
function SummaryStats({ data }) {
  const totalPlanned = data.waves.reduce((sum, w) => sum + w.plannedHours, 0)
  const totalActual  = data.waves.reduce((sum, w) => sum + w.actualHours, 0)
  const totalDiff    = totalActual - totalPlanned
  const totalTasksCompleted = data.waves.reduce((sum, w) => sum + w.tasksCompleted, 0)
  const totalTasks          = data.waves.reduce((sum, w) => sum + w.totalTasks, 0)

  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      <div className="bg-white rounded-lg border border-slate-200 p-3">
        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Planned Hours</div>
        <div className="text-xl font-bold text-blue-600">{totalPlanned.toFixed(1)}h</div>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-3">
        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Actual Hours</div>
        <div className={`text-xl font-bold ${totalDiff < 0 ? 'text-emerald-600' : totalDiff > 0 ? 'text-red-600' : 'text-slate-700'}`}>
          {totalActual.toFixed(1)}h
        </div>
      </div>
      <div className={`rounded-lg border-2 p-3 ${totalDiff < 0 ? 'bg-emerald-50 border-emerald-200' : totalDiff > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Difference</div>
        <div className={`text-xl font-bold ${totalDiff < 0 ? 'text-emerald-600' : totalDiff > 0 ? 'text-red-600' : 'text-slate-700'}`}>
          {totalDiff < 0 ? '-' : '+'}{Math.abs(totalDiff).toFixed(1)}h
        </div>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-3">
        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Tasks</div>
        <div className="text-xl font-bold text-slate-700">{totalTasksCompleted}/{totalTasks}</div>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-3">
        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Status</div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${totalDiff < 0 ? 'text-emerald-600' : totalDiff > 0 ? 'text-red-600' : 'text-slate-700'}`}>
          {totalDiff < 0 ? <TrendingDown size={14} /> : totalDiff > 0 ? <TrendingUp size={14} /> : <CheckCircle size={14} />}
          {totalDiff < 0 ? 'Ahead' : totalDiff > 0 ? 'Behind' : 'On Track'}
        </div>
      </div>
    </div>
  )
}

// ─── Order Card ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  complete: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle size={13} className="text-emerald-600" />, label: 'Complete', labelClass: 'bg-emerald-100 text-emerald-700' },
  ongoing:  { bg: 'bg-blue-50',    border: 'border-blue-200',    icon: <Loader size={13} className="text-blue-600" />,         label: 'Ongoing',  labelClass: 'bg-blue-100 text-blue-700' },
  planned:  { bg: 'bg-slate-50',   border: 'border-slate-200',   icon: <Clock size={13} className="text-slate-400" />,         label: 'Planned',  labelClass: 'bg-slate-100 text-slate-600' },
  delayed:  { bg: 'bg-red-50',     border: 'border-red-200',     icon: <AlertTriangle size={13} className="text-red-600" />,   label: 'Delayed',  labelClass: 'bg-red-100 text-red-700' },
}

function OrderCard({ order }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.planned
  const delayDiff = order.actualMinutes != null ? order.actualMinutes - order.plannedMinutes : null

  return (
    <div className={`p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {cfg.icon}
          <span className="text-xs font-mono font-semibold text-slate-700">{order.id}</span>
          <span className="text-[10px] text-slate-400">{order.waveId}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${cfg.labelClass}`}>
          {cfg.label}
        </span>
      </div>

      {/* SKU + units */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-mono text-slate-600">{order.sku}</span>
        <span className="text-xs text-slate-500">{order.units} units</span>
      </div>

      {/* Workload */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500">Plan:</span>
          <span className="text-xs font-semibold text-slate-700">{order.plannedMinutes}m</span>
        </div>
        {order.actualMinutes != null && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500">Actual:</span>
              <span className={`text-xs font-semibold ${delayDiff > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {order.actualMinutes}m
              </span>
            </div>
            <span className={`text-[10px] font-semibold ${delayDiff > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {delayDiff > 0 ? '+' : ''}{delayDiff.toFixed(1)}m
            </span>
          </>
        )}
        {order.accumulatedDurationSec != null && (
          <div className="ml-auto flex items-center gap-1.5">
            <Clock size={10} className="text-slate-400" />
            <span className="text-[10px] text-slate-500">Elapsed:</span>
            <span className="text-xs font-semibold text-slate-700">
              {Math.floor(order.accumulatedDurationSec / 60)}:{(order.accumulatedDurationSec % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Overview Dashboard Component ───────────────────────────────────────
export default function OverviewDashboard() {
  const [period, setPeriod] = useState('shift')
  const [selectedWaveId, setSelectedWaveId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef(null)

  const currentData = WAVE_ORDER_DATA

  // Filter orders by selected wave
  const filteredOrders = selectedWaveId
    ? currentData.orders.filter(o => o.waveId === selectedWaveId)
    : currentData.orders

  const visibleOrders = filteredOrders.slice(0, visibleCount)
  const hasMore = visibleCount < filteredOrders.length

  // Reset scroll when wave selection changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [selectedWaveId])

  // Infinite scroll sentinel
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredOrders.length))
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, filteredOrders.length])

  const handleWaveClick = (waveId) => {
    setSelectedWaveId(prev => prev === waveId ? null : waveId)
  }

  const selectedWave = currentData.waves.find(w => w.id === selectedWaveId)

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Overview Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Planned vs actual performance by wave and order</p>
          </div>
          <PeriodSelector period={period} setPeriod={setPeriod} />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Clock size={12} />
          <span>Period: <span className="font-semibold text-slate-700">{currentData.period}</span></span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <SummaryStats data={currentData} />

        <div className="grid grid-cols-2 gap-6">
          {/* Waves Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-600" />
              Waves
            </h2>
            <p className="text-[10px] text-slate-400 mb-4 flex items-center gap-1">
              <MousePointerClick size={10} />
              Click a wave to filter orders
            </p>

            {currentData.waves.map(wave => {
              const isSelected = selectedWaveId === wave.id
              return (
                <button
                  key={wave.id}
                  onClick={() => handleWaveClick(wave.id)}
                  className={`w-full text-left rounded-lg px-3 py-2 mb-2 transition-all border-2 ${
                    isSelected
                      ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300 ring-offset-1'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <HorizontalBarChart
                    data={wave}
                    label={wave.name}
                    showDelayBreakdown={wave.delayType === 'delayed'}
                  />
                </button>
              )
            })}
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                Orders
                {selectedWaveId && (
                  <span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {selectedWave?.name}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">
                  {visibleOrders.length} of {filteredOrders.length}
                </span>
                {selectedWaveId && (
                  <button
                    onClick={() => setSelectedWaveId(null)}
                    className="text-[10px] text-blue-500 hover:text-blue-700 underline"
                  >
                    Show all
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable orders list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ maxHeight: '480px' }}>
              {visibleOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}

              {/* Infinite scroll sentinel */}
              {hasMore && (
                <div ref={sentinelRef} className="py-3 text-center text-xs text-slate-400">
                  Loading more orders…
                </div>
              )}

              {filteredOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                  <Package size={32} className="mb-2 opacity-40" />
                  <p className="text-xs">No orders for this wave</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projections Panel */}
        <div className="mt-6">
          <ProjectionPanel projections={PROJECTIONS} />
        </div>
      </div>
    </div>
  )
}
