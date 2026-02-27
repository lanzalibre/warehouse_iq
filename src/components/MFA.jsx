import { useState } from 'react'
import {
  LayoutGrid, TrendingUp, ArrowRight, Check, X,
  Package, Clock, BarChart3, DollarSign, ArrowUp,
  ArrowDown, Move, Eye, EyeOff, Calendar,
} from 'lucide-react'

import {
  SINGLE_PRODUCT_OPPORTUNITIES,
  PRODUCT_PAIRS_OPPORTUNITIES,
  PRODUCT_TRIPLETS_OPPORTUNITIES,
  TRIP_DATA,
} from '../mockData.js'

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

// ─── Opportunity Card (Master List Item) ────────────────────────────────────
function OpportunityCard({ opportunity, isSelected, onSelect, selectedIds, onToggleSelect }) {
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
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500">Location:</span>
              <span className="text-sm font-bold text-slate-800">{opportunity.locationId}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                opportunity.status === 'accepted'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {opportunity.status}
              </span>
            </div>

            {/* SKU display - varies by type */}
            {opportunity.currentSku && (
              <div className="flex items-center gap-1.5 mb-2">
                <Package size={14} className="text-blue-500" />
                <span className="text-sm font-semibold text-slate-700">{opportunity.currentSku}</span>
              </div>
            )}

            {/* Product pairs */}
            {opportunity.skuA && opportunity.skuB && !opportunity.skuC && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 bg-slate-50 rounded px-2 py-1">
                  <Package size={12} className="text-blue-500" />
                  <span className="text-xs font-semibold text-slate-700">{opportunity.skuA}</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
                <div className="flex items-center gap-1.5 bg-slate-50 rounded px-2 py-1">
                  <Package size={12} className="text-purple-500" />
                  <span className="text-xs font-semibold text-slate-700">{opportunity.skuB}</span>
                </div>
              </div>
            )}

            {/* Product triplets */}
            {opportunity.skuA && opportunity.skuB && opportunity.skuC && (
              <div className="flex items-center gap-2 mb-2">
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
          </div>

          {/* Time savings */}
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-slate-400 mb-1">Time Savings</div>
            <div className="text-lg font-bold text-emerald-600">
              {opportunity.timeSavingsMinutes ? `${opportunity.timeSavingsMinutes.toFixed(1)}m` : 'N/A'}
            </div>
            <div className="text-[10px] text-slate-500">per order</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail Panel ───────────────────────────────────────────────────────
function DetailPanel({ opportunity, timePeriod, setTimePeriod, onClose }) {
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
        <div className="mb-6">
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

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Suggested Location</div>
                <div className="text-sm font-bold text-emerald-600">
                  {opportunity.suggestedLocation?.zone}-{opportunity.suggestedLocation?.rack}-{opportunity.suggestedLocation?.level}
                </div>
              </div>
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

          {/* Time Savings */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-emerald-600" />
              <span className="text-sm font-bold text-slate-800">Expected Time Savings</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {opportunity.timeSavingsMinutes ? `${opportunity.timeSavingsMinutes.toFixed(1)} minutes per order` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Trips Table */}
        {TRIP_DATA[opportunity.id] && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Recent Trips</h3>
              <div className="flex items-center gap-2">
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-700"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
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
              {/* Sub-tabs */}
              <div className="px-4 py-3 border-b border-slate-200 flex gap-2 flex-shrink-0">
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
                {visibleOpportunities.map(opportunity => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    isSelected={selectedOpportunity?.id === opportunity.id}
                    onSelect={(id) => setSelectedOpportunity(opportunities.find(o => o.id === id))}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}

                {/* Load more button */}
                {visibleCount < opportunities.length && (
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
            {selectedOpportunity && (
              <DetailPanel
                opportunity={selectedOpportunity}
                timePeriod={timePeriod}
                setTimePeriod={setTimePeriod}
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
