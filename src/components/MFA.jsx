import { useState, useEffect } from 'react'
import {
  LayoutGrid, TrendingUp, ArrowRight, Check, X,
  Package, Clock, BarChart3, DollarSign, ArrowUp,
  ArrowDown, Move, Eye, EyeOff, Calendar,
  ChevronDown, MapPin, Timer, TrendingDown,
} from 'lucide-react'

import {
  SINGLE_PRODUCT_OPPORTUNITIES,
  PRODUCT_PAIRS_OPPORTUNITIES,
  PRODUCT_TRIPLETS_OPPORTUNITIES,
  TRIP_DATA,
  DELAY_DATA,
  ALTERNATIVE_LOCATION_DATA,
  ZONE_DISTANCE_FROM_STAGING,
  PRODUCT_PAIRS_TRIP_DATA,
} from '../mockData.js'

// ─── Helper Functions ─────────────────────────────────────────────────────

// Calculate net savings for an opportunity
function calculateNetSavings(opportunity, timePeriod) {
  const trips = opportunity.tripFrequency?.[`days${timePeriod}`] || 0
  const savingsPerTrip = opportunity.timeSavingsMinutes || 0

  // Get the suggested location to find the alt SKU
  const suggestedLocationStr = opportunity.suggestedLocation
    ? `${opportunity.suggestedLocation.zone}-${opportunity.suggestedLocation.rack}-${opportunity.suggestedLocation.level}`
    : null

  // Get cost data for the alt SKU that would be displaced
  const delayInfo = suggestedLocationStr ? ALTERNATIVE_LOCATION_DATA[suggestedLocationStr] : null
  const delayTrips = delayInfo?.frequency?.[`days${timePeriod}`] || 0
  const costPerTrip = delayInfo?.avgImpactMinutes || 0

  // Calculate net
  const totalSavings = trips * savingsPerTrip
  const totalCosts = delayTrips * costPerTrip
  const netSavings = totalSavings - totalCosts

  return {
    totalSavings,
    totalCosts,
    netSavings,
    savingsTrips: trips,
    costTrips: delayTrips,
    savingsPerTrip,
    costPerTrip
  }
}

// Calculate time savings for time window
function calculateTimeSavings(opportunity, alternative, timePeriod) {
  const trips = opportunity.tripFrequency?.[`days${timePeriod}`] || 0
  const perTrip = alternative?.timeSavingsMinutes ?? opportunity.timeSavingsMinutes
  return { totalMinutes: trips * perTrip, avgPerTrip: perTrip, trips }
}

// Format minutes to hours and minutes
function formatTime(minutes) {
  if (Math.abs(minutes) < 60) {
    return `${minutes.toFixed(1)}m`
  }
  const hours = Math.floor(Math.abs(minutes) / 60)
  const mins = Math.abs(minutes) % 60
  const sign = minutes < 0 ? '-' : ''
  return `${sign}${hours}h ${mins.toFixed(0)}m`
}

// ─── Tab Button ─────────────────────────────────────────────────────────────
function TabButton({ activeTab, setActiveTab, id, label, icon: Icon }) {
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        activeTab === id
          ? 'bg-blue-500 text-white'
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}

// ─── Sub-Tab Button for Reslotting ───────────────────────────────────────
function SubTabButton({ activeSubTab, setActiveSubTab, id, label }) {
  return (
    <button
      onClick={() => setActiveSubTab(id)}
      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
        activeSubTab === id
          ? 'bg-blue-500 text-white'
          : 'bg-transparent text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  )
}

// ─── KPI Card ───────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, subtext, trend }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${trend === 'up' ? 'bg-emerald-100' : trend === 'down' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Icon size={18} className={trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-blue-600'} />
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">{label}</div>
            <div className="text-2xl font-bold text-slate-800">{value}</div>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-blue-600'}`}>
            {trend === 'up' && <ArrowUp size={14} />}
            {trend === 'down' && <ArrowDown size={14} />}
            {trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : '+8%'}
          </div>
        )}
      </div>
      {subtext && <div className="text-xs text-slate-500">{subtext}</div>}
    </div>
  )
}

// ─── Time Period Selector Component ───────────────────────────────────────
function TimePeriodSelector({ timePeriod, setTimePeriod }) {
  return (
    <div className="flex items-center gap-2">
      <Calendar size={14} className="text-slate-500" />
      <div className="flex gap-1">
        {['7', '30', '90'].map(period => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              timePeriod === period
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {period}D
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Time Savings Summary Component ───────────────────────────────────────
function TimeSavingsSummary({ opportunity, selectedAlternative, timePeriod }) {
  const savings = calculateTimeSavings(opportunity, selectedAlternative, timePeriod)

  // Get location strings
  const currentLocationStr = `${opportunity.currentLocation?.zone}-${opportunity.currentLocation?.rack}-${opportunity.currentLocation?.level}`
  const selectedLocationStr = selectedAlternative
    ? `${selectedAlternative.zone}-${selectedAlternative.rack}-${selectedAlternative.level}`
    : `${opportunity.suggestedLocation?.zone}-${opportunity.suggestedLocation?.rack}-${opportunity.suggestedLocation?.level}`

  // Get SKU at alternative location
  const skuAtAlternative = ALTERNATIVE_LOCATION_DATA[selectedLocationStr]?.currentSku || 'Unknown SKU'

  // Get delay/cost data
  const delayInfo = ALTERNATIVE_LOCATION_DATA[selectedLocationStr] || DELAY_DATA[opportunity.id]
  const delayTrips = delayInfo?.frequency?.[`days${timePeriod}`] || 0
  const baseAvgDelay = delayInfo?.avgImpactMinutes || 0

  // Calculate delay multiplier based on selected alternative's zone
  const selectedZone = selectedAlternative?.zone || opportunity.suggestedLocation?.zone
  const suggestedZone = opportunity.suggestedLocation?.zone
  let delayMultiplier = 1
  if (selectedZone && suggestedZone) {
    const selectedDistance = ZONE_DISTANCE_FROM_STAGING[selectedZone] ?? 2
    const suggestedDistance = ZONE_DISTANCE_FROM_STAGING[suggestedZone] ?? 2
    delayMultiplier = 1 + (suggestedDistance - selectedDistance) * 0.3
  }

  const avgDelayPerTrip = baseAvgDelay * delayMultiplier
  const totalDelayMinutes = delayTrips * avgDelayPerTrip

  // Calculate net impact
  const netMinutes = savings.totalMinutes - totalDelayMinutes
  const isNetPositive = netMinutes >= 0

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-slate-500" />
          <span className="text-sm font-bold text-slate-800">Impact Summary</span>
        </div>
        <span className="text-xs text-slate-500">Last {timePeriod} days</span>
      </div>

      {/* Savings Section */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={14} className="text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">
            <span className="text-blue-600">{opportunity.currentSku}</span> at <span className="text-emerald-600">{selectedLocationStr}</span> instead of <span className="text-slate-600">{currentLocationStr}</span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">Total Savings</div>
            <div className="text-lg font-bold text-emerald-600">
              +{formatTime(Math.abs(savings.totalMinutes))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">Avg Per Trip</div>
            <div className="text-lg font-bold text-emerald-600">
              +{savings.avgPerTrip.toFixed(1)}m
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">Trips</div>
            <div className="text-lg font-bold text-slate-700">{savings.trips}</div>
          </div>
        </div>
      </div>

      {/* Costs Section */}
      {delayInfo && (
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-red-600" />
            <span className="text-xs font-semibold text-red-700">
              <span className="text-purple-600">{skuAtAlternative}</span> at <span className="text-red-600">{currentLocationStr}</span> instead of <span className="text-slate-600">{selectedLocationStr}</span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-[10px] text-slate-400 mb-0.5">Total Cost</div>
              <div className="text-lg font-bold text-red-600">
                {totalDelayMinutes >= 0 ? '+' : ''}{formatTime(totalDelayMinutes)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-0.5">Avg Per Trip</div>
              <div className="text-lg font-bold text-red-600">
                {avgDelayPerTrip >= 0 ? '+' : ''}{avgDelayPerTrip.toFixed(1)}m
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-0.5">Trips</div>
              <div className="text-lg font-bold text-slate-700">{delayTrips}</div>
            </div>
          </div>
        </div>
      )}

      {/* Net Impact */}
      <div className={`px-4 py-3 ${isNetPositive ? 'bg-emerald-50' : 'bg-red-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isNetPositive ? (
              <Check size={16} className="text-emerald-600" />
            ) : (
              <X size={16} className="text-red-600" />
            )}
            <span className="text-sm font-semibold text-slate-700">Net Impact</span>
          </div>
          <div className={`text-xl font-bold ${isNetPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {netMinutes >= 0 ? '+' : ''}{formatTime(netMinutes)}
          </div>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {isNetPositive
            ? `Net savings of ${formatTime(netMinutes)} over ${timePeriod} days`
            : `Net cost of ${formatTime(Math.abs(netMinutes))} over ${timePeriod} days`
          }
        </div>
      </div>
    </div>
  )
}

// ─── Alternative Location Selector Component ───────────────────────────────
function AlternativeLocationSelector({ opportunity, selectedAlternative, onSelectAlternative }) {
  const alternatives = opportunity.alternativeLocations || []
  const suggestedLocation = opportunity.suggestedLocation

  // Include the suggested location as the first option
  const allOptions = [
    { id: 'suggested', ...suggestedLocation, timeSavingsMinutes: opportunity.timeSavingsMinutes, isSuggested: true },
    ...alternatives
  ]

  // Get SKU at a location from ALTERNATIVE_LOCATION_DATA
  const getSkuAtLocation = (option) => {
    const locationStr = `${option.zone}-${option.rack}-${option.level}`
    return ALTERNATIVE_LOCATION_DATA[locationStr]?.currentSku || 'Empty'
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={16} className="text-slate-500" />
        <span className="text-sm font-semibold text-slate-700">Alternative Locations</span>
      </div>
      <div className="relative">
        <select
          value={selectedAlternative?.id || 'suggested'}
          onChange={(e) => {
            const selected = allOptions.find(opt => opt.id === e.target.value)
            onSelectAlternative(selected)
          }}
          className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-200 text-sm font-medium bg-white text-slate-700 appearance-none cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {allOptions.map((option) => {
            const skuAtLocation = getSkuAtLocation(option)
            return (
              <option key={option.id} value={option.id}>
                {option.zone}-{option.rack}-{option.level} ({skuAtLocation}) - {option.timeSavingsMinutes > 0 ? '+' : ''}{option.timeSavingsMinutes.toFixed(1)}m/trip
                {option.isSuggested ? ' [Suggested]' : ''}
              </option>
            )
          })}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      {selectedAlternative && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-slate-500">Selected:</span>
          <span className={`font-bold ${selectedAlternative.timeSavingsMinutes > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {selectedAlternative.zone}-{selectedAlternative.rack}-{selectedAlternative.level}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">
            {getSkuAtLocation(selectedAlternative)}
          </span>
          <span className="text-slate-400">|</span>
          <span className={selectedAlternative.timeSavingsMinutes > 0 ? 'text-emerald-600' : 'text-red-600'}>
            {selectedAlternative.timeSavingsMinutes > 0 ? '+' : ''}{selectedAlternative.timeSavingsMinutes.toFixed(1)}m per trip
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Delays Grid Component ───────────────────────────────────────────────────
function DelaysGrid({ opportunity, timePeriod, selectedAlternative }) {
  // Get the selected alternative location string
  const selectedLocationStr = selectedAlternative
    ? `${selectedAlternative.zone}-${selectedAlternative.rack}-${selectedAlternative.level}`
    : opportunity.suggestedLocation
      ? `${opportunity.suggestedLocation.zone}-${opportunity.suggestedLocation.rack}-${opportunity.suggestedLocation.level}`
      : null

  // Get data for the SKU at the selected alternative location
  const locationData = selectedLocationStr ? ALTERNATIVE_LOCATION_DATA[selectedLocationStr] : null

  // Current location of the main SKU
  const currentLocationStr = `${opportunity.currentLocation.zone}-${opportunity.currentLocation.rack}-${opportunity.currentLocation.level}`

  // If no data for this location, try to use DELAY_DATA as fallback
  const delayInfo = locationData || DELAY_DATA[opportunity.id]

  if (!delayInfo || !delayInfo.trips || delayInfo.trips.length === 0) {
    return null
  }

  const trips = delayInfo.trips
  const avgImpact = delayInfo.avgImpactMinutes || delayInfo.avgDelayMinutes || 2.0
  const frequency = delayInfo.frequency || { days7: 5, days30: 20, days90: 60 }
  const skuAtLocation = locationData?.currentSku || 'SKU at location'
  const totalImpact = frequency[`days${timePeriod}`] * avgImpact
  const isNegativeImpact = avgImpact < 0

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Time of routes for <span className="text-purple-600">{skuAtLocation}</span> if assigned to location <span className="text-red-600">{currentLocationStr}</span>
        </h3>
        <span className="text-xs text-slate-500">Last {timePeriod} days</span>
      </div>

      <div className={`rounded-lg p-3 mb-3 ${isNegativeImpact ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-500">Total {isNegativeImpact ? 'Savings' : 'Cost'}:</span>
            <span className={`font-bold ml-1 ${isNegativeImpact ? 'text-emerald-600' : 'text-red-600'}`}>
              {isNegativeImpact ? '' : '+'}{formatTime(totalImpact)}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Avg per trip:</span>
            <span className={`font-bold ml-1 ${isNegativeImpact ? 'text-emerald-600' : 'text-red-600'}`}>
              {isNegativeImpact ? '' : '+'}{avgImpact.toFixed(1)}m
            </span>
          </div>
          <div>
            <span className="text-slate-500">Affected trips:</span>
            <span className="font-bold ml-1 text-slate-700">{frequency[`days${timePeriod}`]}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="text-left py-2 px-3 font-semibold">Employee</th>
              <th className="text-left py-2 px-3 font-semibold">Date</th>
              <th className="text-right py-2 px-3 font-semibold">Order ID</th>
              <th className="text-right py-2 px-3 font-semibold">Picks</th>
              <th className="text-right py-2 px-3 font-semibold">Current (at {selectedLocationStr})</th>
              <th className="text-right py-2 px-3 font-semibold">If at {currentLocationStr}</th>
              <th className="text-right py-2 px-3 font-semibold">Added</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, idx) => {
              const isImprovement = trip.timeAdded.startsWith('-')
              return (
                <tr key={idx} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 px-3 font-medium text-slate-700">{trip.employee}</td>
                  <td className="py-2.5 px-3">{trip.date}</td>
                  <td className="py-2.5 font-mono">{trip.orderId}</td>
                  <td className="py-2.5 text-right">{trip.picksInRoute}</td>
                  <td className="py-2.5 text-right text-slate-500">{trip.currentRouteLength}</td>
                  <td className="py-2.5 text-right text-slate-700">{trip.alternativeRouteLength}</td>
                  <td className={`py-2.5 text-right font-semibold ${isImprovement ? 'text-emerald-600' : 'text-red-600'}`}>
                    {trip.timeAdded}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Opportunity Card (Master List Item) ────────────────────────────────────
function OpportunityCard({ opportunity, isSelected, onSelect, selectedIds, onToggleSelect, timePeriod, type }) {
  // Calculate net savings for display
  const netSavings = calculateNetSavings(opportunity, timePeriod)
  const netSavingsPerDay = netSavings.netSavings / parseInt(timePeriod)

  // Get the alt SKU at suggested location
  const suggestedLocationStr = opportunity.suggestedLocation
    ? `${opportunity.suggestedLocation.zone}-${opportunity.suggestedLocation.rack}-${opportunity.suggestedLocation.level}`
    : ''
  const altSku = ALTERNATIVE_LOCATION_DATA[suggestedLocationStr]?.currentSku || '—'

  return (
    <div
      onClick={() => onSelect(opportunity.id)}
      className={`w-full text-left rounded-xl border-2 p-3 mb-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelect(opportunity.id)
            }}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
              selectedIds.has(opportunity.id)
                ? 'border-blue-500 bg-blue-500'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            {selectedIds.has(opportunity.id) && <Check size={12} className="text-white" />}
          </div>

          <div className="flex-1 min-w-0">
            {/* SKU and location info */}
            <div className="flex items-center gap-2 mb-1.5">
              <Package size={14} className="text-blue-500" />
              <span className="text-sm font-bold text-slate-700">{opportunity.currentSku}</span>
              <span className="text-xs text-slate-400">→</span>
              <span className="text-xs font-semibold text-emerald-600">{suggestedLocationStr}</span>
            </div>

            {/* Location details */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
              <span className="font-medium">Current:</span>
              <span>{opportunity.currentLocation?.zone}-{opportunity.currentLocation?.rack}-{opportunity.currentLocation?.level}</span>
              <span className="text-slate-300">|</span>
              <span className="font-medium">Alt SKU:</span>
              <span className="text-purple-600">{altSku}</span>
            </div>

            {/* Demand badge */}
            {opportunity.demandLevel && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                opportunity.demandLevel === 'high'
                  ? 'bg-blue-100 text-blue-700'
                  : opportunity.demandLevel === 'low'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-slate-50 text-slate-500'
              }`}>
                {opportunity.demandLevel.toUpperCase()} DEMAND
              </span>
            )}
          </div>
        </div>

        {/* Net savings per day */}
        <div className="flex-shrink-0 text-right">
          <div className="text-[10px] text-slate-400 mb-0.5">Net Savings</div>
          <div className={`text-lg font-bold ${netSavingsPerDay >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {netSavingsPerDay >= 0 ? '+' : ''}{netSavingsPerDay.toFixed(1)}m
          </div>
          <div className="text-[10px] text-slate-500">per day</div>
        </div>
      </div>
    </div>
  )
}

// ─── Product Pair/Triplet Card ───────────────────────────────────────────────
function ProductGroupCard({ opportunity, isSelected, onSelect, selectedIds, onToggleSelect, timePeriod }) {
  const isPair = opportunity.skuA && opportunity.skuB && !opportunity.skuC

  // Compute net savings/day for pairs using PRODUCT_PAIRS_TRIP_DATA
  let netPerDay = null
  if (isPair && PRODUCT_PAIRS_TRIP_DATA[opportunity.id]) {
    const td = PRODUCT_PAIRS_TRIP_DATA[opportunity.id]
    const savings = td.table1.reduce((s, r) => s + r.timeDifferenceMinutes, 0) // negative
    const costs = td.table2.reduce((s, r) => s + r.timeDifferenceMinutes, 0)   // positive
    const period = parseInt(timePeriod) || 7
    netPerDay = Math.abs(savings + costs) / period
  }

  // Suggested location (for pairs = alternativeLocations[0] = suggested)
  const suggestedAlt = isPair ? opportunity.alternativeLocations?.find(a => a.isSuggested) : null

  return (
    <div
      onClick={() => onSelect(opportunity.id)}
      className={`w-full text-left rounded-xl border-2 p-3 mb-2 cursor-pointer transition-all ${
        isPair
          ? isSelected
            ? 'border-emerald-500 bg-emerald-100'
            : 'border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100'
          : isSelected
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelect(opportunity.id)
            }}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
              selectedIds.has(opportunity.id)
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            {selectedIds.has(opportunity.id) && <Check size={12} className="text-white" />}
          </div>

          <div className="flex-1 min-w-0">
            {/* Product pairs — enhanced layout */}
            {isPair && (
              <>
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <div className="flex items-center gap-1 bg-white border border-emerald-200 rounded px-1.5 py-0.5">
                    <Package size={11} className="text-blue-500 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[110px]">{opportunity.skuA}</span>
                  </div>
                  <span className="text-slate-400 text-xs">↔</span>
                  <div className="flex items-center gap-1 bg-white border border-emerald-200 rounded px-1.5 py-0.5">
                    <Package size={11} className="text-purple-500 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[110px]">{opportunity.skuB}</span>
                  </div>
                </div>
                {suggestedAlt && (
                  <div className="text-[10px] text-slate-500 mb-1.5">
                    → {suggestedAlt.zone}-{suggestedAlt.rack}-{suggestedAlt.level}
                    <span className="text-slate-400"> (currently: {suggestedAlt.skuAtLocation})</span>
                  </div>
                )}
              </>
            )}

            {/* Product triplets */}
            {!isPair && opportunity.skuA && opportunity.skuB && opportunity.skuC && (
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Package size={12} className="text-blue-500" />
                  <span className="text-xs font-semibold text-slate-700">{opportunity.skuA}</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
                <div className="flex items-center gap-1.5 bg-slate-50 rounded px-2 py-1">
                  <Package size={12} className="text-purple-500" />
                  <span className="text-xs font-semibold text-slate-700">{opportunity.skuB}</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
                <div className="flex items-center gap-1.5 bg-slate-50 rounded px-2 py-1">
                  <Package size={12} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">{opportunity.skuC}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                opportunity.status === 'accepted'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {opportunity.status}
              </span>
            </div>
          </div>
        </div>

        {/* Net savings per day (pairs) or per order (triplets) */}
        <div className="flex-shrink-0 text-right">
          {isPair && netPerDay !== null ? (
            <>
              <div className="text-[10px] text-slate-400 mb-0.5">Net Savings</div>
              <div className="text-lg font-bold text-emerald-600">+{netPerDay.toFixed(1)}m</div>
              <div className="text-[10px] text-slate-500">per day</div>
            </>
          ) : (
            <>
              <div className="text-xs text-slate-400 mb-1">
                {opportunity.timeSavingsMinutes < 0 ? 'Time Cost' : 'Time Savings'}
              </div>
              <div className={`text-lg font-bold ${opportunity.timeSavingsMinutes < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {opportunity.timeSavingsMinutes ? `${opportunity.timeSavingsMinutes > 0 ? '+' : ''}${opportunity.timeSavingsMinutes.toFixed(1)}m` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-500">per order</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Detail Panel ───────────────────────────────────────────────────────
function DetailPanel({ opportunity, timePeriod, onClose }) {
  const [selectedAlternative, setSelectedAlternative] = useState(null)

  // Reset selected alternative when opportunity changes
  const opportunityId = opportunity?.id
  useEffect(() => {
    setSelectedAlternative(null)
  }, [opportunityId])

  const isSingleProduct = opportunity.currentSku && !opportunity.skuA

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="text-xs text-slate-400 mb-1">Selected Opportunity</div>
          <div className="text-lg font-bold text-slate-800">{opportunity.id}</div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-100 transition-colors"
        >
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Opportunity Info */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Opportunity Details</h3>

          {/* Single Product */}
          {opportunity.currentSku && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Current Location</div>
                  <div className="text-sm font-bold text-slate-700">
                    {opportunity.currentLocation?.zone}-{opportunity.currentLocation?.rack}-{opportunity.currentLocation?.level}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Current SKU</div>
                  <div className="flex items-center gap-1.5">
                    <Package size={14} className="text-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">{opportunity.currentSku}</span>
                  </div>
                </div>
              </div>
              {opportunity.demandLevel && (
                <div className="mb-3">
                  <div className="text-xs text-slate-400 mb-1">Demand Level</div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    opportunity.demandLevel === 'high'
                      ? 'bg-blue-100 text-blue-700'
                      : opportunity.demandLevel === 'low'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-slate-50 text-slate-500'
                  }`}>
                    {opportunity.demandLevel.toUpperCase()} DEMAND
                  </span>
                </div>
              )}

              {/* Alternative Location Selector for Single Products */}
              {isSingleProduct && opportunity.alternativeLocations && (
                <AlternativeLocationSelector
                  opportunity={opportunity}
                  selectedAlternative={selectedAlternative}
                  onSelectAlternative={setSelectedAlternative}
                />
              )}
            </div>
          )}

          {/* Product Pairs */}
          {opportunity.skuA && opportunity.skuB && !opportunity.skuC && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Product A</div>
                  <div className="text-sm font-bold text-slate-700">{opportunity.skuA}</div>
                  <div className="text-xs text-slate-500">{opportunity.locationA?.zone}-{opportunity.locationA?.rack}-{opportunity.locationA?.level}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Product B</div>
                  <div className="text-sm font-bold text-slate-700">{opportunity.skuB}</div>
                  <div className="text-xs text-slate-500">{opportunity.locationB?.zone}-{opportunity.locationB?.rack}-{opportunity.locationB?.level}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Suggested A</div>
                  <div className="text-sm font-bold text-emerald-600">{opportunity.suggestedLocationA?.zone}-{opportunity.suggestedLocationA?.rack}-{opportunity.suggestedLocationA?.level}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Suggested B</div>
                  <div className="text-sm font-bold text-purple-600">{opportunity.suggestedLocationB?.zone}-{opportunity.suggestedLocationB?.rack}-{opportunity.suggestedLocationB?.level}</div>
                </div>
              </div>
            </div>
          )}

          {/* Product Triplets */}
          {opportunity.skuA && opportunity.skuB && opportunity.skuC && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Product A</div>
                  <div className="text-sm font-bold text-slate-700">{opportunity.skuA}</div>
                  <div className="text-xs text-slate-500">{opportunity.locationA?.zone}-{opportunity.locationA?.rack}-{opportunity.locationA?.level}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Product B</div>
                  <div className="text-sm font-bold text-slate-700">{opportunity.skuB}</div>
                  <div className="text-xs text-slate-500">{opportunity.locationB?.zone}-{opportunity.locationB?.rack}-{opportunity.locationB?.level}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Product C</div>
                  <div className="text-sm font-bold text-slate-700">{opportunity.skuC}</div>
                  <div className="text-xs text-slate-500">{opportunity.locationC?.zone}-{opportunity.locationC?.rack}-{opportunity.locationC?.level}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Suggested A</div>
                  <div className="text-sm font-bold text-emerald-600">{opportunity.suggestedLocationA?.zone}-{opportunity.suggestedLocationA?.rack}-{opportunity.suggestedLocationA?.level}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Suggested B</div>
                  <div className="text-sm font-bold text-purple-600">{opportunity.suggestedLocationB?.zone}-{opportunity.suggestedLocationB?.rack}-{opportunity.suggestedLocationB?.level}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Suggested C</div>
                  <div className="text-sm font-bold text-emerald-600">{opportunity.suggestedLocationC?.zone}-{opportunity.suggestedLocationC?.rack}-{opportunity.suggestedLocationC?.level}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Impact Summary - before tables for single products */}
        {isSingleProduct && opportunity.tripFrequency && (
          <div className="mb-4">
            <TimeSavingsSummary
              opportunity={opportunity}
              selectedAlternative={selectedAlternative}
              timePeriod={timePeriod}
            />
          </div>
        )}

        {/* First Table - Savings for current SKU at new location */}
        {TRIP_DATA[opportunity.id] && isSingleProduct && (() => {
          const selectedSavings = selectedAlternative?.timeSavingsMinutes ?? opportunity.timeSavingsMinutes
          const selectedLocationStr = selectedAlternative
            ? `${selectedAlternative.zone}-${selectedAlternative.rack}-${selectedAlternative.level}`
            : `${opportunity.suggestedLocation?.zone}-${opportunity.suggestedLocation?.rack}-${opportunity.suggestedLocation?.level}`

          return (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  Time of routes for <span className="text-blue-600">{opportunity.currentSku}</span> if assigned to location <span className="text-emerald-600">{selectedLocationStr}</span>
                </h3>
                <span className="text-xs text-slate-500">Last {timePeriod} days</span>
              </div>

              {/* Summary bar */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Total Savings:</span>
                    <span className="font-bold ml-1 text-emerald-600">
                      +{formatTime((opportunity.tripFrequency?.[`days${timePeriod}`] || 0) * selectedSavings)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Avg per trip:</span>
                    <span className="font-bold ml-1 text-emerald-600">+{selectedSavings.toFixed(1)}m</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Trips:</span>
                    <span className="font-bold ml-1 text-slate-700">{opportunity.tripFrequency?.[`days${timePeriod}`] || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="text-left py-2 px-3 font-semibold">Employee</th>
                      <th className="text-left py-2 px-3 font-semibold">Date</th>
                      <th className="text-right py-2 px-3 font-semibold">Order ID</th>
                      <th className="text-right py-2 px-3 font-semibold">Picks</th>
                      <th className="text-right py-2 px-3 font-semibold">Current</th>
                      <th className="text-right py-2 px-3 font-semibold">If at {selectedLocationStr}</th>
                      <th className="text-right py-2 px-3 font-semibold">Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRIP_DATA[opportunity.id].slice(0, 5).map((trip, idx) => {
                      const originalSavedStr = trip.timeSaved || '0m 00s'
                      const originalMinutes = parseFloat(originalSavedStr.replace('m', '.').replace('s', '').trim())
                      const baseSavings = opportunity.timeSavingsMinutes || 4.5
                      const ratio = selectedSavings / baseSavings
                      const adjustedSaved = originalMinutes * ratio

                      return (
                        <tr key={idx} className="border-b border-slate-100 last:border-0">
                          <td className="py-2.5 px-3 font-medium text-slate-700">{trip.employee}</td>
                          <td className="py-2.5 px-3">{trip.date}</td>
                          <td className="py-2.5 font-mono">{trip.orderId}</td>
                          <td className="py-2.5 text-right">{trip.picksInRoute}</td>
                          <td className="py-2.5 text-right text-slate-500">{trip.routeLength}</td>
                          <td className="py-2.5 text-right text-slate-700">{trip.updatedRouteLength}</td>
                          <td className="py-2.5 text-right text-emerald-600 font-semibold">+{adjustedSaved.toFixed(1)}m</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })()}

        {/* Second Table - Delays/Costs for alt SKU at current location */}
        {isSingleProduct && (
          <DelaysGrid opportunity={opportunity} timePeriod={timePeriod} selectedAlternative={selectedAlternative} />
        )}

        {/* Non-single product trips table (pairs/triplets) */}
        {TRIP_DATA[opportunity.id] && !isSingleProduct && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-800">Recent Trips</h3>
                <span className="text-xs text-slate-400">(Route improvements)</span>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="text-left py-2 px-3 font-semibold">Employee</th>
                    <th className="text-left py-2 px-3 font-semibold">Date</th>
                    <th className="text-right py-2 px-3 font-semibold">Order ID</th>
                    <th className="text-right py-2 px-3 font-semibold">Picks</th>
                    <th className="text-right py-2 px-3 font-semibold">Route</th>
                    <th className="text-right py-2 px-3 font-semibold">Updated</th>
                    <th className="text-right py-2 px-3 font-semibold">Saved</th>
                    <th className="text-right py-2 px-3 font-semibold">Same Route</th>
                  </tr>
                </thead>
                <tbody>
                  {TRIP_DATA[opportunity.id].map((trip, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0">
                      <td className="py-2.5 px-3 font-medium text-slate-700">{trip.employee}</td>
                      <td className="py-2.5 px-3">{trip.date}</td>
                      <td className="py-2.5 font-mono">{trip.orderId}</td>
                      <td className="py-2.5 text-right">{trip.picksInRoute}</td>
                      <td className="py-2.5 text-right text-slate-500">{trip.routeLength}</td>
                      <td className="py-2.5 text-right text-emerald-600 font-semibold">{trip.updatedRouteLength}</td>
                      <td className="py-2.5 text-right text-emerald-600">{trip.timeSaved}</td>
                      {(opportunity.skuB || opportunity.skuC) && (
                        <td className="py-2.5 text-center">
                          {trip.sameRoute ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                              <Check size={12} className="text-white" />
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Pair Stats */}
        {opportunity.skuA && opportunity.skuB && !opportunity.skuC && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Joint Order Statistics</h3>
            <div className="grid grid-cols-4 gap-4 mb-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Total Joint Orders (30d)</div>
                <div className="text-lg font-bold text-slate-800">127</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">% of Product A's Total</div>
                <div className="text-lg font-bold text-blue-600">34%</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">% of Product B's Total</div>
                <div className="text-lg font-bold text-purple-600">28%</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Expected Savings</div>
                <div className="text-lg font-bold text-emerald-600">{opportunity.timeSavingsMinutes?.toFixed(1)}m</div>
              </div>
            </div>
          </div>
        )}

        {/* Basic Time Savings (for pairs/triplets without trip frequency) */}
        {!isSingleProduct && (
          <div className={`rounded-lg p-4 ${
            opportunity.timeSavingsMinutes < 0
              ? 'bg-red-50 border border-red-200'
              : 'bg-emerald-50 border border-emerald-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className={opportunity.timeSavingsMinutes < 0 ? 'text-red-600' : 'text-emerald-600'} />
              <span className="text-sm font-bold text-slate-800">
                {opportunity.timeSavingsMinutes < 0 ? 'Expected Time Cost' : 'Expected Time Savings'}
              </span>
            </div>
            <div className={`text-2xl font-bold ${opportunity.timeSavingsMinutes < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {opportunity.timeSavingsMinutes ? `${opportunity.timeSavingsMinutes > 0 ? '+' : ''}${opportunity.timeSavingsMinutes.toFixed(1)} minutes per order` : 'N/A'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Pair Detail Panel ──────────────────────────────────────────────────────
function PairDetailPanel({ opportunity, timePeriod, onClose }) {
  const [selectedAlt, setSelectedAlt] = useState(
    opportunity.alternativeLocations?.find(a => a.isSuggested) ?? opportunity.alternativeLocations?.[0]
  )

  // Reset when opportunity changes
  const oppId = opportunity?.id
  useEffect(() => {
    setSelectedAlt(
      opportunity.alternativeLocations?.find(a => a.isSuggested) ?? opportunity.alternativeLocations?.[0]
    )
  }, [oppId])

  const tripData = PRODUCT_PAIRS_TRIP_DATA[opportunity.id]
  const locationBStr = `${opportunity.locationB?.zone}-${opportunity.locationB?.rack}-${opportunity.locationB?.level}`
  const selectedAltStr = selectedAlt ? `${selectedAlt.zone}-${selectedAlt.rack}-${selectedAlt.level}` : '—'

  // Impact calculations
  const table1Sum = tripData ? tripData.table1.reduce((s, r) => s + r.timeDifferenceMinutes, 0) : 0
  const table2Sum = tripData ? tripData.table2.reduce((s, r) => s + r.timeDifferenceMinutes, 0) : 0
  const period = parseInt(timePeriod) || 7
  const netMinutesTotal = Math.abs(table1Sum) - table2Sum
  const netPerDay = netMinutesTotal / period
  const isNetPositive = netPerDay >= 0

  const demandLevelColor = (level) =>
    level === 'high' ? 'text-blue-600 bg-blue-50' : level === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-100'

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-[600px] flex-shrink-0">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-emerald-50">
        <div>
          <div className="text-xs text-slate-400 mb-1">Product Pair Opportunity</div>
          <div className="text-lg font-bold text-slate-800">{opportunity.id}</div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-emerald-100 transition-colors">
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ── Opportunity Details ── */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3">Opportunity Details</h3>

          {/* SKU A / B grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-[10px] text-blue-400 font-semibold mb-1">SKU A</div>
              <div className="flex items-center gap-1.5 mb-1">
                <Package size={13} className="text-blue-500" />
                <span className="text-sm font-bold text-slate-800">{opportunity.skuA}</span>
              </div>
              <div className="text-xs text-slate-500 mb-2">
                Location: <span className="font-semibold text-slate-700">{opportunity.locationA?.zone}-{opportunity.locationA?.rack}-{opportunity.locationA?.level}</span>
              </div>
              {opportunity.demandRateA && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${demandLevelColor(opportunity.demandRateA.level)}`}>
                  {opportunity.demandRateA.unitsPerDay} u/day · {opportunity.demandRateA.level.toUpperCase()}
                </span>
              )}
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-[10px] text-purple-400 font-semibold mb-1">SKU B</div>
              <div className="flex items-center gap-1.5 mb-1">
                <Package size={13} className="text-purple-500" />
                <span className="text-sm font-bold text-slate-800">{opportunity.skuB}</span>
              </div>
              <div className="text-xs text-slate-500 mb-2">
                Location: <span className="font-semibold text-slate-700">{locationBStr}</span>
              </div>
              {opportunity.demandRateB && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${demandLevelColor(opportunity.demandRateB.level)}`}>
                  {opportunity.demandRateB.unitsPerDay} u/day · {opportunity.demandRateB.level.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Orders + distance */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-[10px] text-slate-400 font-semibold mb-1">JOINT ORDERS LAST {timePeriod} DAYS</div>
              <div className="text-xl font-bold text-slate-800">{opportunity.ordersInPeriod?.[`days${timePeriod}`] ?? '—'}</div>
              <div className="text-xs text-slate-500">orders demanding both {opportunity.skuA} and {opportunity.skuB}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-[10px] text-slate-400 font-semibold mb-1">CURRENT DISTANCE A↔B</div>
              <div className="text-xl font-bold text-slate-800">{opportunity.distanceAB}m</div>
              <div className="text-xs text-slate-500">between current slot locations</div>
            </div>
          </div>

          {/* Alternative location combobox */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alternative location for {opportunity.skuB}
            </label>
            <div className="relative">
              <select
                value={selectedAlt?.id || 'suggested'}
                onChange={(e) => {
                  const found = opportunity.alternativeLocations?.find(a => a.id === e.target.value)
                  setSelectedAlt(found)
                }}
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 appearance-none cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {opportunity.alternativeLocations?.map(alt => (
                  <option key={alt.id} value={alt.id}>
                    {alt.zone}-{alt.rack}-{alt.level} ({alt.skuAtLocation}) — new dist from A: {alt.distanceAC}m — {alt.demandRateC?.unitsPerDay} u/day ({alt.demandRateC?.level?.toUpperCase()}){alt.isSuggested ? ' [Suggested]' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {selectedAlt && (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs bg-emerald-50 rounded-lg px-3 py-2">
                <div>
                  <span className="text-slate-500">New A↔B distance: </span>
                  <span className="font-bold text-emerald-700">{selectedAlt.distanceAC}m</span>
                </div>
                <div>
                  <span className="text-slate-500">SKU C demand: </span>
                  <span className={`font-bold ${demandLevelColor(selectedAlt.demandRateC?.level)}`}>
                    {selectedAlt.demandRateC?.unitsPerDay} u/day ({selectedAlt.demandRateC?.level?.toUpperCase()})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Savings/trip: </span>
                  <span className="font-bold text-emerald-700">+{selectedAlt.timeSavingsMinutes}m</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Impact Summary ── */}
        {tripData && selectedAlt && (
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-slate-500" />
                <span className="text-sm font-bold text-slate-800">Impact Summary</span>
              </div>
              <span className="text-xs text-slate-500">Last {timePeriod} days</span>
            </div>

            {/* Block 1: SKU B savings */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700">
                  <span className="text-purple-600">{opportunity.skuB}</span> at <span className="text-emerald-600">{selectedAltStr}</span> instead of <span className="text-slate-600">{locationBStr}</span>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Total Savings</div>
                  <div className="text-lg font-bold text-emerald-600">+{Math.abs(table1Sum).toFixed(1)}m</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Trips</div>
                  <div className="text-lg font-bold text-slate-700">{tripData.table1.length}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Avg/Trip</div>
                  <div className="text-lg font-bold text-emerald-600">+{(Math.abs(table1Sum) / tripData.table1.length).toFixed(1)}m</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Avg/Day</div>
                  <div className="text-lg font-bold text-emerald-600">+{(Math.abs(table1Sum) / period).toFixed(1)}m</div>
                </div>
              </div>
            </div>

            {/* Block 2: SKU C cost */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={14} className="text-red-600" />
                <span className="text-xs font-semibold text-red-700">
                  <span className="text-orange-600">{selectedAlt.skuAtLocation}</span> at <span className="text-red-600">{locationBStr}</span> instead of <span className="text-slate-600">{selectedAltStr}</span>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Total Cost</div>
                  <div className="text-lg font-bold text-red-600">+{table2Sum.toFixed(1)}m</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Trips</div>
                  <div className="text-lg font-bold text-slate-700">{tripData.table2.length}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Avg/Trip</div>
                  <div className="text-lg font-bold text-red-600">+{(table2Sum / tripData.table2.length).toFixed(1)}m</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Avg/Day</div>
                  <div className="text-lg font-bold text-red-600">+{(table2Sum / period).toFixed(1)}m</div>
                </div>
              </div>
            </div>

            {/* Net Impact */}
            <div className={`px-4 py-3 ${isNetPositive ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isNetPositive ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-600" />}
                  <span className="text-sm font-semibold text-slate-700">Net Impact</span>
                </div>
                <div className={`text-2xl font-bold ${isNetPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isNetPositive ? '+' : ''}{netPerDay.toFixed(1)}m/day
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {isNetPositive
                  ? `Net savings of ${netMinutesTotal.toFixed(1)}m over ${timePeriod} days (${netPerDay.toFixed(1)}m/day)`
                  : `Net cost of ${Math.abs(netMinutesTotal).toFixed(1)}m over ${timePeriod} days`
                }
              </div>
            </div>
          </div>
        )}

        {/* ── Table 1: Routes for SKU A+B ── */}
        {tripData && (
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Time of routes for <span className="text-blue-600">{opportunity.skuA}</span> <span className="text-slate-400">(A)</span> and <span className="text-purple-600">{opportunity.skuB}</span> <span className="text-slate-400">(B)</span> if <span className="text-purple-600">{opportunity.skuB}</span> is assigned to <span className="text-emerald-600">{selectedAltStr}</span>
            </h3>
            <div className="flex items-center gap-3 text-xs bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-2">
              <div>
                <span className="text-slate-500">Total savings: </span>
                <span className="font-bold text-emerald-600">+{Math.abs(table1Sum).toFixed(1)}m</span>
              </div>
              <div>
                <span className="text-slate-500">Trips: </span>
                <span className="font-bold text-slate-700">{tripData.table1.length}</span>
              </div>
              <div>
                <span className="text-slate-500">Avg/trip: </span>
                <span className="font-bold text-emerald-600">+{(Math.abs(table1Sum) / tripData.table1.length).toFixed(1)}m</span>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="text-left py-2 px-3 font-semibold">Trip ID</th>
                    <th className="text-left py-2 px-3 font-semibold">Employee</th>
                    <th className="text-left py-2 px-2 font-semibold">Date</th>
                    <th className="text-left py-2 px-2 font-semibold">Order</th>
                    <th className="text-right py-2 px-2 font-semibold">Picks</th>
                    <th className="text-left py-2 px-2 font-semibold">Difference</th>
                    <th className="text-right py-2 px-2 font-semibold">Duration</th>
                    <th className="text-right py-2 px-2 font-semibold">Time Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {tripData.table1.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-500">{row.tripId}</td>
                      <td className="py-2 px-3 font-medium text-slate-700">{row.employee}</td>
                      <td className="py-2 px-2 text-slate-500">{row.date}</td>
                      <td className="py-2 px-2 font-mono text-slate-500">{row.orderId}</td>
                      <td className="py-2 px-2 text-right">{row.picks}</td>
                      <td className="py-2 px-2 text-slate-600">{row.difference}</td>
                      <td className="py-2 px-2 text-right text-slate-700">{row.duration}</td>
                      <td className={`py-2 px-2 text-right font-semibold ${row.timeDifferenceMinutes < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {row.timeDifferenceMinutes > 0 ? '+' : ''}{row.timeDifferenceMinutes.toFixed(1)}m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Table 2: Routes for SKU C ── */}
        {tripData && selectedAlt && (
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Time of routes for <span className="text-orange-600">{selectedAlt.skuAtLocation}</span> if assigned to <span className="text-slate-600">{locationBStr}</span>
            </h3>
            <div className="flex items-center gap-3 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2">
              <div>
                <span className="text-slate-500">Total cost: </span>
                <span className="font-bold text-red-600">+{table2Sum.toFixed(1)}m</span>
              </div>
              <div>
                <span className="text-slate-500">Trips: </span>
                <span className="font-bold text-slate-700">{tripData.table2.length}</span>
              </div>
              <div>
                <span className="text-slate-500">Avg/trip: </span>
                <span className="font-bold text-red-600">+{(table2Sum / tripData.table2.length).toFixed(1)}m</span>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="text-left py-2 px-3 font-semibold">Trip ID</th>
                    <th className="text-left py-2 px-3 font-semibold">Employee</th>
                    <th className="text-left py-2 px-2 font-semibold">Date</th>
                    <th className="text-left py-2 px-2 font-semibold">Order</th>
                    <th className="text-right py-2 px-2 font-semibold">Picks</th>
                    <th className="text-left py-2 px-2 font-semibold">Difference</th>
                    <th className="text-right py-2 px-2 font-semibold">Duration</th>
                    <th className="text-right py-2 px-2 font-semibold">Time Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {tripData.table2.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-500">{row.tripId}</td>
                      <td className="py-2 px-3 font-medium text-slate-700">{row.employee}</td>
                      <td className="py-2 px-2 text-slate-500">{row.date}</td>
                      <td className="py-2 px-2 font-mono text-slate-500">{row.orderId}</td>
                      <td className="py-2 px-2 text-right">{row.picks}</td>
                      <td className="py-2 px-2 text-slate-600">{row.difference}</td>
                      <td className="py-2 px-2 text-right text-slate-700">{row.duration}</td>
                      <td className="py-2 px-2 text-right font-semibold text-red-600">
                        +{row.timeDifferenceMinutes.toFixed(1)}m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── MFA Screen Component ───────────────────────────────────────────────────────
export default function MFAScreen() {
  const [activeTab, setActiveTab] = useState('overview')
  const [activeSubTab, setActiveSubTab] = useState('single')
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [timePeriod, setTimePeriod] = useState('7')
  const [visibleCount, setVisibleCount] = useState(12)

  // Handle bulk actions
  const handleToggleSelect = (id) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkAccept = () => {
    if (selectedIds.size === 0) return
    if (confirm(`Accept ${selectedIds.size} reslotting opportunities?`)) {
      console.log('Accepted opportunities:', Array.from(selectedIds))
      alert(`Accepted ${selectedIds.size} opportunities`)
    }
  }

  const handleBulkIgnore = () => {
    if (selectedIds.size === 0) return
    console.log('Ignored opportunities:', Array.from(selectedIds))
    setSelectedIds(new Set())
  }

  // Get opportunities based on sub-tab
  const getOpportunities = () => {
    if (activeSubTab === 'single') return SINGLE_PRODUCT_OPPORTUNITIES
    if (activeSubTab === 'pairs') return PRODUCT_PAIRS_OPPORTUNITIES
    if (activeSubTab === 'triplets') return PRODUCT_TRIPLETS_OPPORTUNITIES
    return []
  }

  const opportunities = getOpportunities()
  const visibleOpportunities = opportunities.slice(0, visibleCount)
  const pendingCount = opportunities.filter(o => o.status === 'pending').length

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-slate-50">
      {/* Tab Navigation */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex gap-2 flex-shrink-0">
        <TabButton
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          id="overview"
          label="Overview"
          icon={BarChart3}
        />
        <TabButton
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          id="reslotting"
          label="Reslotting Opportunities"
          icon={Move}
        />
        <TabButton
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          id="simulation"
          label="Simulation"
          icon={LayoutGrid}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <KPICard
                icon={TrendingUp}
                label="Total Opportunities"
                value="156"
                subtext="Across all analysis types"
                trend="up"
              />
              <KPICard
                icon={Move}
                label="Pending Actions"
                value="48"
                subtext="Awaiting review"
                trend="up"
              />
              <KPICard
                icon={Check}
                label="Accepted This Month"
                value="23"
                subtext="12% of total"
                trend="up"
              />
              <KPICard
                icon={DollarSign}
                label="Est. Time Savings"
                value="312"
                subtext="Hours per month"
                trend="up"
              />
            </div>

            {/* Empty placeholder */}
            <div className="h-64 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <LayoutGrid size={48} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm">Additional metrics coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Reslotting Opportunities Tab */}
        {activeTab === 'reslotting' && (
          <div className="flex flex-1 overflow-hidden">
            {/* Master Panel */}
            <div className="w-[450px] flex flex-col overflow-hidden border-r border-slate-200 bg-white flex-shrink-0">
              {/* Sub-tabs and Time Period Selector */}
              <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2">
                    <SubTabButton
                      activeSubTab={activeSubTab}
                      setActiveSubTab={setActiveSubTab}
                      id="single"
                      label="Single Products"
                    />
                    <SubTabButton
                      activeSubTab={activeSubTab}
                      setActiveSubTab={setActiveSubTab}
                      id="pairs"
                      label="Product Pairs"
                    />
                    <SubTabButton
                      activeSubTab={activeSubTab}
                      setActiveSubTab={setActiveSubTab}
                      id="triplets"
                      label="Product Triplets"
                    />
                  </div>
                </div>
                {/* Time Period Selector at screen level */}
                <TimePeriodSelector timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
              </div>

              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                <div className="text-sm">
                  <span className="text-slate-500">Opportunities:</span>
                  <span className="font-bold text-slate-800 ml-1">{opportunities.length}</span>
                  {pendingCount > 0 && (
                    <span className="ml-2 text-amber-600 text-xs">({pendingCount} pending)</span>
                  )}
                </div>
                {selectedIds.size > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkIgnore}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      <EyeOff size={12} className="inline mr-1" />
                      Ignore
                    </button>
                    <button
                      onClick={handleBulkAccept}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      <Check size={12} className="inline mr-1" />
                      Accept ({selectedIds.size})
                    </button>
                  </div>
                )}
              </div>

              {/* Opportunities List */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Single Products - Single Grid */}
                {activeSubTab === 'single' && (
                  <>
                    {SINGLE_PRODUCT_OPPORTUNITIES.map(opportunity => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                        type="single"
                        timePeriod={timePeriod}
                        isSelected={selectedOpportunity?.id === opportunity.id}
                        onSelect={(id) => setSelectedOpportunity(SINGLE_PRODUCT_OPPORTUNITIES.find(o => o.id === id))}
                        selectedIds={selectedIds}
                        onToggleSelect={handleToggleSelect}
                      />
                    ))}
                  </>
                )}

                {/* Product Pairs & Triplets - Single Grid */}
                {activeSubTab !== 'single' && visibleOpportunities.map(opportunity => (
                  <ProductGroupCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    isSelected={selectedOpportunity?.id === opportunity.id}
                    onSelect={(id) => setSelectedOpportunity(opportunities.find(o => o.id === id))}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    timePeriod={timePeriod}
                  />
                ))}

                {/* Load more button */}
                {activeSubTab !== 'single' && visibleCount < opportunities.length && (
                  <button
                    onClick={() => setVisibleCount(visibleCount + 6)}
                    className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Load more...
                  </button>
                )}
              </div>
            </div>

            {/* Detail Panel */}
            {selectedOpportunity && activeSubTab === 'pairs' && (
              <PairDetailPanel
                opportunity={selectedOpportunity}
                timePeriod={timePeriod}
                onClose={() => setSelectedOpportunity(null)}
              />
            )}
            {selectedOpportunity && activeSubTab !== 'pairs' && (
              <DetailPanel
                opportunity={selectedOpportunity}
                timePeriod={timePeriod}
                onClose={() => setSelectedOpportunity(null)}
              />
            )}

            {!selectedOpportunity && (
              <div className="flex-1 bg-slate-50 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Eye size={48} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">Select an opportunity to view details</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Simulation Tab */}
        {activeTab === 'simulation' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="h-full bg-white rounded-xl border border-slate-200 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <LayoutGrid size={48} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm">Simulation features coming soon</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
