import { useState } from 'react'
import { BarChart3, Clock, TrendingUp, TrendingDown, ArrowUp, ArrowDown, CheckCircle, AlertTriangle } from 'lucide-react'
import { WAVE_ORDER_DATA, PROJECTIONS, LABOR_PERIOD_DATA } from '../../mockData.js'
import HorizontalBarChart from './HorizontalBarChart.jsx'
import ProjectionPanel from './ProjectionPanel.jsx'

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
  const totalActual = data.waves.reduce((sum, w) => sum + w.actualHours, 0)
  const totalDiff = totalActual - totalPlanned
  const totalTasksCompleted = data.waves.reduce((sum, w) => sum + w.tasksCompleted, 0)
  const totalTasks = data.waves.reduce((sum, w) => sum + w.totalTasks, 0)

  const delayedWaves = data.waves.filter(w => w.delayType === 'delayed').length
  const aheadWaves = data.waves.filter(w => w.delayType === 'ahead').length

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
      <div className={`rounded-lg border-2 p-3 ${
        totalDiff < 0 ? 'bg-emerald-50 border-emerald-200' : totalDiff > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
      }`}>
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

// ─── Main Overview Dashboard Component ───────────────────────────────────────
export default function OverviewDashboard() {
  const [period, setPeriod] = useState('shift')

  // Get data for selected period
  const getDataForPeriod = (p) => {
    // For demo, return the same data but could be filtered by period
    return WAVE_ORDER_DATA
  }

  const currentData = getDataForPeriod(period)

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Overview Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Planned vs actual performance by wave and order
            </p>
          </div>
          <PeriodSelector period={period} setPeriod={setPeriod} />
        </div>

        {/* Period info */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Clock size={12} />
          <span>Period: <span className="font-semibold text-slate-700">{currentData.period}</span></span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Summary Statistics */}
        <SummaryStats data={currentData} />

        <div className="grid grid-cols-2 gap-6">
          {/* Waves Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-600" />
              Waves
            </h2>

            {currentData.waves.map(wave => (
              <HorizontalBarChart
                key={wave.id}
                data={wave}
                label={wave.name}
                showDelayBreakdown={wave.delayType === 'delayed'}
              />
            ))}
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              Orders
            </h2>

            <div className="space-y-2">
              {currentData.orders.map(order => {
                const isDelayed = order.delayType === 'delayed'
                return (
                  <div
                    key={order.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isDelayed
                        ? 'bg-red-50 border-red-200'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isDelayed ? 'bg-red-100' : 'bg-emerald-100'}`}>
                        {isDelayed ? <AlertTriangle size={14} className="text-red-600" /> : <CheckCircle size={14} className="text-emerald-600" />}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-slate-400">{order.id}</div>
                        <div className="text-sm font-semibold text-slate-700">
                          {isDelayed ? '+' : ''}{Math.abs(order.delayMinutes)}m {isDelayed ? 'delay' : 'ahead'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Planned</div>
                      <div className="text-sm font-semibold text-slate-700">{order.plannedHours}h</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Actual</div>
                      <div className={`text-sm font-semibold ${isDelayed ? 'text-red-600' : 'text-emerald-600'}`}>
                        {order.actualHours}h
                      </div>
                    </div>
                  </div>
                )
              })}
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
