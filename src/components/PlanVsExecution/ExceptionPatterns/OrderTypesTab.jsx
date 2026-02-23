import { useState } from 'react'
import {
  Clock, Activity, AlertTriangle, ShoppingCart,
  Filter, ChevronRight, ChevronDown, Eye, EyeOff,
  Package, Zap,
} from 'lucide-react'
import { DELAY_PATTERNS } from '../../../mockData.js'

// ─── Service Risk Badge ────────────────────────────────────────────────────────────
function ServiceRiskBadge({ risk }) {
  const config = {
    'critical': { label: 'CRITICAL', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    'high': { label: 'HIGH', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    'medium': { label: 'MEDIUM', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    'low': { label: 'LOW', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  }

  const cfg = config[risk] || config['medium']

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─── Delay Card (for order types with accumulation stats and multi-select) ─────────
function DelayCard({ item, selected, onToggleSelect, isExpanded, onToggle }) {
  const delayPercent = item.delayPercent
  const isCritical = delayPercent >= 45
  const isHigh = delayPercent >= 35

  return (
    <div className={`border-2 rounded-xl mb-3 transition-all overflow-hidden ${
      selected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
    } ${
      isCritical
        ? 'bg-red-50/50 border-red-300'
        : isHigh
          ? 'bg-amber-50/50 border-amber-300'
          : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
          />

          {/* Expand button */}
          <button
            onClick={onToggle}
            className="flex-shrink-0"
          >
            {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
          </button>

          {/* Type icon */}
          <div className="flex-shrink-0">
            <div className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-orange-500`}>
              <ShoppingCart size={12} />
              Order Type
            </div>
          </div>

          {/* Name */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">{item.name}</span>
            </div>
            <div className="text-xs text-slate-500">
              {item.taskCount} tasks affected
            </div>

            {/* Accumulated stats */}
            {item.accumulated && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded p-2">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wide">Shift Accumulated</div>
                  <div className="text-xs font-semibold text-slate-700">
                    {Math.floor(item.accumulated.shift.delayedSeconds / 60)}h delay / {item.accumulated.shift.tasksAffected} tasks
                  </div>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wide">Day Projected</div>
                  <div className="text-xs font-semibold text-slate-700">
                    {Math.floor(item.accumulated.day.delayedSeconds / 60)}h delay / {item.accumulated.day.tasksAffected} tasks
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delay percent */}
          <div className="flex-shrink-0 text-center w-20">
            <div className={`text-lg font-black ${
              isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-blue-600'
            }`}>
              +{delayPercent}%
            </div>
            <div className="text-[10px] text-slate-500">delay</div>
          </div>

          {/* Average delay */}
          <div className="flex-shrink-0 text-center w-24">
            <div className="text-sm font-bold text-slate-700">
              {Math.floor(item.avgDelaySeconds / 60)}:{(item.avgDelaySeconds % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-500">avg delay</div>
          </div>

          {/* Service risk */}
          <div className="flex-shrink-0">
            <ServiceRiskBadge risk={item.wmsContext.serviceRisk} />
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* WES Context */}
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-purple-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">WES Context</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle size={12} className="text-purple-600" />
                  <span className="text-xs font-bold text-purple-700">{item.wesContext.issue}</span>
                </div>
                <p className="text-xs text-purple-700">{item.wesContext.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Impact:</span>
                  <span className="text-xs font-medium text-slate-700">{item.wesContext.impact}</span>
                </div>
              </div>
            </div>

            {/* WMS Context */}
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <Package size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">WMS Context</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">SKUs Affected</span>
                  <span className="text-xs font-bold text-slate-800">{item.wmsContext.skusAffected}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Fast-Moving Orders</span>
                  <span className="text-xs font-bold text-slate-800">{item.wmsContext.fastMovingOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Service Risk</span>
                  <ServiceRiskBadge risk={item.wmsContext.serviceRisk} />
                </div>
              </div>

              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-700">{item.wmsContext.description}</p>
              </div>
            </div>
          </div>

          {/* Alert banner for critical items */}
          {(isCritical || item.wmsContext.serviceRisk === 'critical') && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-red-700 mb-1">
                  SLA Risk Detected
                </div>
                <p className="text-xs text-red-700">
                  This order type is causing critical delays for fast-moving SKUs.
                  Immediate action recommended to prevent order fulfillment SLA breaches.
                </p>
              </div>
            </div>
          )}

          {/* Ignore action */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => console.log('Ignore', item.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            >
              <EyeOff size={12} />
              Ignore
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Order Types Tab Component ────────────────────────────────────────────────────
export default function OrderTypesTab() {
  const [expandedItem, setExpandedItem] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const orderTypes = DELAY_PATTERNS.orderTypes

  // Stats
  const criticalCount = orderTypes.filter(i => i.delayPercent >= 45).length
  const highCount = orderTypes.filter(i => i.delayPercent >= 35 && i.delayPercent < 45).length
  const criticalServiceRisk = orderTypes.filter(i => i.wmsContext.serviceRisk === 'critical').length
  const totalTasks = orderTypes.reduce((sum, i) => sum + i.taskCount, 0)

  const handleToggleSelect = (itemId) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === orderTypes.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(orderTypes.map(i => i.id)))
    }
  }

  const handleMassIgnore = () => {
    console.log('Ignore selected:', Array.from(selectedIds))
    setSelectedIds(new Set())
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header with stats */}
      <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} className="text-orange-600" />
            <div>
              <div className="text-sm font-bold text-slate-800">Order Type Delay Patterns</div>
              <div className="text-xs text-slate-600 mt-0.5">
                {totalTasks} tasks affected by delays &gt;30%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-orange-600">{orderTypes.length}</div>
              <div className="text-xs text-slate-600 font-medium">Order Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{totalTasks}</div>
              <div className="text-xs text-slate-600 font-medium">Delayed Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500">
              Showing {orderTypes.length} order types with delays
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Select all checkbox */}
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              <input
                type="checkbox"
                checked={selectedIds.size === orderTypes.length && orderTypes.length > 0}
                readOnly
                className="w-4 h-4 rounded border-slate-300 text-blue-500"
              />
              Select All
            </button>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={14} className="text-blue-600" />
              <span className="text-xs text-blue-700">
                {selectedIds.size} order type{selectedIds.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMassIgnore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all"
              >
                <EyeOff size={12} />
                Ignore Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delay cards list */}
      <div className="flex-1 overflow-y-auto p-6">
        {orderTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <ShoppingCart size={48} className="mb-3 opacity-50" />
            <p className="text-sm">No order type delay patterns found</p>
          </div>
        ) : (
          orderTypes.map(item => (
            <DelayCard
              key={item.id}
              item={item}
              selected={selectedIds.has(item.id)}
              onToggleSelect={() => handleToggleSelect(item.id)}
              isExpanded={expandedItem === item.id}
              onToggle={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
            />
          ))
        )}
      </div>

      {/* Stats bar */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-blue-500" />
            <span className="text-xs text-slate-600">
              Total Delayed Tasks: <span className="font-semibold text-slate-800">{totalTasks}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-slate-600">
              Critical (&ge;45%): <span className="font-semibold text-slate-800">{criticalCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-600">
              High (35-44%): <span className="font-semibold text-slate-800">{highCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-xs text-slate-600">
              SLA Risk: <span className="font-semibold text-slate-800">{criticalServiceRisk}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
