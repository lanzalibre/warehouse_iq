import { useState } from 'react'
import {
  Layers, ShoppingCart, TrendingUp, AlertTriangle,
  Package, Truck, MapPin, Clock, Activity, BarChart3,
  RefreshCw, ArrowUpRight, Eye, EyeOff, Check,
} from 'lucide-react'

// ─── Slotting Issues Data ─────────────────────────────────────────────
const SLOTTING_ISSUES = [
  {
    id: 'SLOT-001',
    issueType: 'slotting',
    location: 'Zone C',
    zone: 'Zone C - Pick Area 1',
    sku: 'NB-574-41',
    description: 'Fast-moving SKU assigned to slow-moving rack location',
    frequency: 'High',
    avgTravelDistance: 145,
    impactScore: 78,
    status: 'Active',
    dateIdentified: '2026-02-20',
    suggestion: 'Relocate to Zone A - High Velocity Rack'
  },
  {
    id: 'SLOT-002',
    issueType: 'slotting',
    location: 'Zone A',
    zone: 'Zone A - Bulk Storage Area',
    sku: 'NIKE-AIRMAX-42',
    description: 'Large SKUs in compact storage, picker travel time excessive',
    frequency: 'Medium',
    avgTravelDistance: 320,
    impactScore: 65,
    status: 'Active',
    dateIdentified: '2026-02-21',
    suggestion: 'Cross-zone with Zone C - use flow-through racking'
  },
  {
    id: 'SLOT-003',
    issueType: 'slotting',
    location: 'Zone D',
    zone: 'Zone D - Cold Storage',
    sku: 'HM-TSHIRT-L',
    description: 'Temperature-sensitive items in standard racking, frequent replenishment conflicts',
    frequency: 'High',
    avgTravelDistance: 185,
    impactScore: 82,
    status: 'Active',
    dateIdentified: '2026-02-22',
    suggestion: 'Dedicated climate-controlled area'
  },
  {
    id: 'SLOT-004',
    issueType: 'slotting',
    location: 'Zone B',
    zone: 'Zone B - General Storage',
    sku: 'ADIDAS-ULTRA-40',
    description: 'Mixed SKUs in shared slots, causing picking errors',
    frequency: 'Medium',
    avgTravelDistance: 210,
    impactScore: 70,
    status: 'Active',
    dateIdentified: '2026-02-23',
    suggestion: 'SKU family zoning by size category'
  },
  {
    id: 'SLOT-005',
    issueType: 'slotting',
    location: 'Crossdock',
    zone: 'Crossdock Bay',
    sku: 'Various',
    description: 'Crossdock items blocking main aisles during peak hours',
    frequency: 'High',
    avgTravelDistance: 95,
    impactScore: 88,
    status: 'Active',
    dateIdentified: '2026-02-24',
    suggestion: 'Schedule crossdock during off-peak hours'
  },
]

// ─── Historical Movement Stats ───────────────────────────────────────────
const MOVEMENT_STATS = {
  totalDailyPicks: 8472,
  picksFromDistantRacks: 3389,
  distantRackThresholdMeters: 100,
  percentageFromDistantRacks: 40.1,
  peakEfficiencyHours: ['09:00-11:00', '14:00-16:00'],
  offPeakEfficiencyHours: ['07:00-08:30', '12:30-17:00'],
  avgPickTimeSeconds: 48,
  avgWalkTimeSeconds: 180,
  last30DaysTrend: 'increasing',
}

// ─── Historical Movement Details ───────────────────────────────────────────
const MOVEMENT_DETAILS = [
  {
    id: 'MV-001',
    period: 'Today - Last 7 Days',
    totalPicks: 59304,
    distantRackPicks: 23723,
    percentageFromDistant: 40.0,
    avgPickTime: 45,
    avgWalkTime: 175,
    efficiencyTrend: '↑ 3.2%',
  },
  {
    id: 'MV-002',
    period: 'Previous 30 Days',
    totalPicks: 254160,
    distantRackPicks: 101664,
    percentageFromDistant: 40.0,
    avgPickTime: 47,
    avgWalkTime: 178,
    efficiencyTrend: '↑ 1.8%',
  },
]

// ─── Slotting Issue Badge ─────────────────────────────────────────────
function SlottingBadge({ status }) {
  const config = {
    active: {
      label: 'Active',
      bg: 'bg-red-100',
      text: 'text-red-700',
      dot: 'bg-red-500',
    },
    resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
    },
  }

  const cfg = config[status] || config.active

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─── Issue Card ─────────────────────────────────────────────────────────
function SlottingIssueCard({ issue, isSelected, onSelect, onAction }) {
  const impactLevel = issue.impactScore >= 80 ? 'critical' : issue.impactScore >= 65 ? 'high' : 'medium'

  return (
    <div
      className={`border-2 rounded-xl p-4 mb-3 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:ring-2 hover:ring-slate-300'
      }`}
      onClick={() => onSelect(issue.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlottingBadge status={issue.status} />
          <div>
            <div className="text-sm font-bold text-slate-800">{issue.sku}</div>
            <div className="text-xs text-slate-500">{issue.location} · {issue.zone}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-[10px] font-semibold ${
            impactLevel === 'critical' ? 'bg-red-100 text-red-700' :
            impactLevel === 'high' ? 'bg-orange-100 text-orange-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {issue.impactScore}
          </div>
          {issue.status === 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction(issue.id, 'investigate')
              }}
              className="p-1 rounded hover:bg-slate-100 transition-colors"
              title="Investigate this issue"
            >
              <Activity size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-3">
        <div className="flex items-start gap-2 text-slate-600">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{issue.description}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-3 text-xs">
        <div className="bg-slate-50 rounded p-3">
          <div className="text-slate-400 mb-1">Frequency</div>
          <div className="text-sm font-bold text-slate-800">{issue.frequency}</div>
        </div>
        <div className="bg-slate-50 rounded p-3">
          <div className="text-slate-400 mb-1">Avg Travel</div>
          <div className="text-sm font-bold text-slate-800">{issue.avgTravelDistance}m</div>
        </div>
        <div className="bg-slate-50 rounded p-3">
          <div className="text-slate-400 mb-1">Identified</div>
          <div className="text-sm font-medium text-slate-700">{issue.dateIdentified}</div>
        </div>
        <div className="bg-blue-50 rounded p-3">
          <div className="text-slate-400 mb-1">Status</div>
          <div className="flex items-center gap-1">
            {issue.status === 'active' ? (
              <span className="text-sm font-bold text-red-600">Active</span>
            ) : (
              <span className="text-sm font-bold text-emerald-600">Resolved</span>
            )}
          </div>
        </div>
      </div>

      {/* Suggestion */}
      {issue.suggestion && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <ArrowUpRight size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-slate-800 mb-1">Recommended Action:</div>
              <p className="text-sm text-slate-700">{issue.suggestion}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAction(issue.id, 'investigate')
          }}
          className="flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          <Eye size={16} />
          Investigate
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAction(issue.id, 'ignore')
          }}
          className="flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
        >
          <EyeOff size={16} />
          Ignore
        </button>
      </div>
    </div>
  )
}

// ─── Movement Stat Card ─────────────────────────────────────────────────────
function MovementStatCard({ icon: IconComponent, iconBg, iconColor, label, value, subtext, trend, isPositive }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${iconBg || 'bg-blue-100'}`}>
            <IconComponent size={18} className={iconColor || 'text-blue-600'} />
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">{label}</div>
            <div className="text-2xl font-bold text-slate-800">{value}</div>
          </div>
        </div>
        {subtext && (
          <div className="text-xs text-slate-500 mt-1">{subtext}</div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend}
          {isPositive ? (
            <span className="text-xs text-emerald-600">↑ Improving</span>
          ) : (
            <span className="text-xs text-red-600">↑ Declining</span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Slotting Tab Component ────────────────────────────────────────────────
export default function SlottingTab() {
  const [selectedIssueId, setSelectedIssueId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showResolved, setShowResolved] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const filteredIssues = SLOTTING_ISSUES.filter(issue => {
    if (filter === 'active') return issue.status === 'active'
    if (filter === 'resolved') return issue.status === 'resolved'
    return true
  })

  const activeCount = SLOTTING_ISSUES.filter(i => i.status === 'active').length
  const resolvedCount = SLOTTING_ISSUES.filter(i => i.status === 'resolved').length

  const handleAction = (issueId, action) => {
    console.log(`${action} issue:`, issueId)
    if (action === 'resolve') {
      alert(`Marked issue ${issueId} as resolved`)
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredIssues.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredIssues.map(i => i.id)))
    }
  }

  const handleResolveAll = () => {
    console.log('Resolve all active slotting issues')
    alert(`This action would resolve ${activeCount} active slotting issues`)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Slotting Issues</h1>
          <p className="text-xs text-slate-500 mt-1">
            Identify and resolve slotting inefficiencies affecting picker productivity
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-y-auto p-6">
          {/* Key Insight Banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800 mb-1">
                  Historical Movement Data Review
                </div>
                <p className="text-sm text-slate-700">
                  Reviews historical movement data showing that <span className="font-bold text-orange-600">{MOVEMENT_STATS.percentageFromDistantRacks}%</span> of picks originate from racks more than <span className="font-bold text-red-600">{MOVEMENT_STATS.distantRackThresholdMeters}m</span> from dispatch
                </p>
              </div>
              <TrendingUp size={24} className="text-amber-600 flex-shrink-0" />
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <MovementStatCard
              icon={TrendingUp}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              label="Total Daily Picks"
              value={MOVEMENT_STATS.totalDailyPicks.toLocaleString()}
              subtext={`${MOVEMENT_STATS.percentageFromDistantRacks}% from distant racks`}
              trend={<TrendingUp size={12} className="text-emerald-600" />}
              isPositive={false}
            />
            <MovementStatCard
              icon={TrendingUp}
              iconBg="bg-red-100"
              iconColor="text-red-600"
              label="Distant Rack Picks"
              value={MOVEMENT_STATS.picksFromDistantRacks.toLocaleString()}
              subtext={`${MOVEMENT_STATS.percentageFromDistantRacks}% of total`}
              trend={<TrendingUp size={12} className="text-emerald-600" />}
              isPositive={false}
            />
            <MovementStatCard
              icon={Clock}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              label="Avg Pick Time"
              value={`${MOVEMENT_STATS.avgPickTimeSeconds}s`}
              subtext={`${MOVEMENT_STATS.avgWalkTimeSeconds}s walking`}
            />
            <MovementStatCard
              icon={Activity}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              label="Peak Efficiency"
              value="9-11am"
              subtext="Most productive window"
            />
            <MovementStatCard
              icon={BarChart3}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              label="Off-Peak Efficiency"
              value="12:30-5pm"
              subtext="Lower picker volume"
            />
          </div>

          {/* Historical Movement Details Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-800">Historical Movement Analysis</h2>
              <button
                onClick={() => setShowResolved(!showResolved)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw size={14} />
                Show {showResolved ? 'Active Only' : 'All History'}
              </button>
            </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="text-left py-2 px-3 font-semibold">Period</th>
                  <th className="text-right py-2 px-3 font-semibold">Total Picks</th>
                  <th className="text-right py-2 px-3 font-semibold">Distant Rack</th>
                  <th className="text-right py-2 px-3 font-semibold">% Distant</th>
                  <th className="text-right py-2 px-3 font-semibold">Avg Pick Time</th>
                  <th className="text-right py-2 px-3 font-semibold">Avg Walk Time</th>
                  <th className="text-right py-2 px-3 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {MOVEMENT_DETAILS.map((detail, idx) => (
                  <tr
                    key={detail.id}
                    className={`border-b border-slate-100 ${detail.efficiencyTrend.includes('↓') ? 'text-red-500' : 'text-emerald-600'}`}
                  >
                    <td className="py-2.5 font-medium">{detail.period}</td>
                    <td className="py-2.5 text-right font-mono">{detail.totalPicks.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono text-amber-600 font-semibold">{detail.distantRackPicks.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono">{detail.percentageFromDistant}%</td>
                    <td className="py-2.5 text-right">{detail.avgPickTime}s</td>
                    <td className="py-2.5 text-right">{detail.avgWalkTime}s</td>
                    <td className={`py-2.5 text-right ${detail.efficiencyTrend.includes('↓') ? 'text-red-600' : 'text-emerald-600'}`}>
                      {detail.efficiencyTrend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>

          {/* Slotting Issues List */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-800">
                {filter === 'all' ? 'All Issues' : `${filter === 'active' ? 'Active' : 'Resolved'} Issues`}
              </h2>
              <span className="text-xs text-slate-500">
                {activeCount} active · {resolvedCount} resolved
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter === 'active'
                    ? 'bg-blue-500 text-white'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                Active Only
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter === 'resolved'
                    ? 'bg-blue-500 text-white'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                Resolved
              </button>
            </div>

            {/* Issue Cards */}
            <div className="grid grid-cols-2 gap-4">
              {filteredIssues.map(issue => (
                <SlottingIssueCard
                  key={issue.id}
                  issue={issue}
                  isSelected={selectedIds.has(issue.id)}
                  onSelect={setSelectedIssueId}
                  onAction={handleAction}
                />
              ))}
            </div>

            {/* Bulk Actions */}
            {activeCount > 0 && (
              <div className="mt-4 px-6 py-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={20} className="text-blue-600" />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {selectedIds.size > 0
                          ? `${selectedIds.size} issues selected for action`
                          : 'Select issues to resolve'
                        }
                      </div>
                      <div className="text-xs text-slate-500">
                        {selectedIds.size > 0
                          ? 'Use the panel on the right to take action'
                          : 'Click issues to select them'
                        }
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleResolveAll}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all"
                  >
                    Resolve All Active Issues
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
