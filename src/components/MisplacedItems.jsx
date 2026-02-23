import { useState } from 'react'
import {
  AlertTriangle, MapPin, Package, Clock,
  ChevronDown, ChevronUp, Check, X, RefreshCw,
  Search, Filter, MoreHorizontal, Eye, EyeOff,
  Layers, Warehouse, ClipboardCheck, RotateCw, Info, ArrowUpDown,
  TrendingUp, Folder,
} from 'lucide-react'
import { MISPLACED_LOCATIONS_ALL, MISPLACED_ACTIONS, ZONE_CONFIG } from '../mockData.js'

// ─── Issue Type Badge ─────────────────────────────────────────────────────────────
function IssueTypeBadge({ issueType }) {
  const config = {
    'inventory-issue': {
      label: 'Inventory Issue',
      bg: 'bg-red-100',
      text: 'text-red-700',
      dot: 'bg-red-500',
      icon: Package
    },
    'slotting-issue': {
      label: 'Slotting Issue',
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      icon: Layers
    }
  }

  const cfg = config[issueType] || config['inventory-issue']
  const Icon = cfg.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}

// ─── Location Card (expanded view) ────────────────────────────────────────────────
function LocationCard({ location, onAction, onToggleIgnore }) {
  const zoneConfig = ZONE_CONFIG[location.zone]
  const [showBypasses, setShowBypasses] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)

  const handleAction = (actionId) => {
    onAction(location.id, actionId)
    setSelectedAction(null)
  }

  return (
    <div className={`border-2 rounded-xl p-4 mb-3 transition-all ${
      location.ignored
        ? 'bg-slate-50 border-slate-200 opacity-60'
        : location.issueType === 'inventory-issue'
          ? 'bg-red-50/50 border-red-200'
          : 'bg-amber-50/50 border-amber-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400">{location.id}</span>
            <IssueTypeBadge issueType={location.issueType} />
            {location.ignored && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-600">
                <EyeOff size={8} />
                Ignored
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${zoneConfig?.dotClass || 'bg-slate-400'}`} />
            <span className="text-sm font-bold text-slate-800">{location.location}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
            <span className="font-mono">{location.sku}</span>
            <span className="text-slate-400">|</span>
            <span className="truncate max-w-xs">{location.description}</span>
          </div>
          {/* Volume 7 days */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <TrendingUp size={10} />
            <span>7-day volume:</span>
            <span className="font-bold text-slate-700">{location.volume7Days}</span>
          </div>
        </div>

        {/* Ignore toggle */}
        <button
          onClick={() => onToggleIgnore(location.id)}
          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
            location.ignored
              ? 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
          }`}
          title={location.ignored ? 'Unignore' : 'Ignore this location'}
        >
          {location.ignored ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-slate-400" />
          <span className="text-xs text-slate-500">Bypassed by</span>
          <span className="text-xs font-bold text-slate-800">{location.bypassCount}</span>
          <span className="text-xs text-slate-500">pickers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-amber-500" />
          <span className="text-xs text-slate-500">Reasons:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {location.denialReasons.map(reason => (
            <span
              key={reason}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700"
            >
              {reason}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-500 mr-2">Suggested action:</span>
        {MISPLACED_ACTIONS.map(action => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              location.suggestedAction === action.id
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
            title={action.description}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Expandable bypass details */}
      <div>
        <button
          onClick={() => setShowBypasses(!showBypasses)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          {showBypasses ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span className="font-medium">
            View {location.bypassCount} picker bypass records
          </span>
        </button>

        {showBypasses && (
          <div className="mt-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 px-3 py-2 bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              <span>Picker</span>
              <span>Time</span>
              <span>Reason</span>
            </div>
            {location.pickerBypasses.map((bypass, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 px-3 py-2 border-b border-slate-100 last:border-0 text-xs"
              >
                <span className="font-medium text-slate-700">{bypass.pickerId}</span>
                <span className="font-mono text-slate-600">{bypass.time}</span>
                <span className={`font-medium ${
                  bypass.reason === 'wrong location' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {bypass.reason}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────────
const ZONES = ['All', 'Zone A', 'Zone B', 'Zone C', 'Zone D', 'Crossdock']
const ISSUE_TYPES = ['All', 'inventory-issue', 'slotting-issue']
const SORT_OPTIONS = [
  { value: 'volume-desc', label: 'Volume (High to Low)' },
  { value: 'volume-asc', label: 'Volume (Low to High)' },
  { value: 'zone', label: 'Zone (A-Z)' },
  { value: 'issue-type', label: 'Issue Type' },
  { value: 'bypass-count', label: 'Bypass Count' },
]

export default function MisplacedItems() {
  const [locations, setLocations] = useState(MISPLACED_LOCATIONS_ALL)
  const [filter, setFilter] = useState('all') // all, inventory-issue, slotting-issue, ignored
  const [zoneFilter, setZoneFilter] = useState('All')
  const [issueTypeFilter, setIssueTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('volume-desc')
  const [showIgnored, setShowIgnored] = useState(true)

  // Sort locations
  const sortedLocations = [...locations].sort((a, b) => {
    switch (sortBy) {
      case 'volume-desc':
        return b.volume7Days - a.volume7Days
      case 'volume-asc':
        return a.volume7Days - b.volume7Days
      case 'zone':
        return a.zone.localeCompare(b.zone)
      case 'issue-type':
        return a.issueType.localeCompare(b.issueType)
      case 'bypass-count':
        return b.bypassCount - a.bypassCount
      default:
        return 0
    }
  })

  // Filter locations
  const filteredLocations = sortedLocations.filter(loc => {
    if (filter === 'ignored') return loc.ignored
    if (filter === 'inventory-issue') return loc.issueType === 'inventory-issue' && !loc.ignored
    if (filter === 'slotting-issue') return loc.issueType === 'slotting-issue' && !loc.ignored
    if (filter === 'all') return showIgnored || !loc.ignored
    return true
  }).filter(loc => {
    if (zoneFilter !== 'All' && loc.zone !== zoneFilter) return false
    if (issueTypeFilter !== 'All' && loc.issueType !== issueTypeFilter) return false
    return true
  })

  // Stats
  const totalLocations = locations.length
  const activeLocations = locations.filter(l => !l.ignored).length
  const inventoryIssues = locations.filter(l => l.issueType === 'inventory-issue' && !l.ignored).length
  const slottingIssues = locations.filter(l => l.issueType === 'slotting-issue' && !l.ignored).length
  const ignoredCount = locations.filter(l => l.ignored).length
  const totalBypasses = locations.reduce((sum, l) => sum + l.bypassCount, 0)

  const handleAction = (locationId, actionId) => {
    setLocations(prev => prev.map(loc => {
      if (loc.id === locationId) {
        // For demo purposes, just update the suggested action
        return { ...loc, suggestedAction: actionId }
      }
      return loc
    }))
  }

  const handleToggleIgnore = (locationId) => {
    setLocations(prev => prev.map(loc => {
      if (loc.id === locationId) {
        return { ...loc, ignored: !loc.ignored }
      }
      return loc
    }))
  }

  const handleMassIgnore = () => {
    setLocations(prev => prev.map(loc => ({ ...loc, ignored: true })))
  }

  const handleMassUnignore = () => {
    setLocations(prev => prev.map(loc => ({ ...loc, ignored: false })))
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Misplaced / Not Found</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Locations with reported pick denials or empty locations
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Zone filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Zone:</span>
              <select
                value={zoneFilter}
                onChange={e => setZoneFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {ZONES.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            {/* Issue type filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Issue Type:</span>
              <select
                value={issueTypeFilter}
                onChange={e => setIssueTypeFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {ISSUE_TYPES.map(type => (
                  <option key={type} value={type}>{type === 'All' ? 'All Issues' : type === 'inventory-issue' ? 'Inventory' : 'Slotting'}</option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Show/Hide ignored */}
            <button
              onClick={() => setShowIgnored(!showIgnored)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                showIgnored
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {showIgnored ? <Eye size={14} /> : <EyeOff size={14} />}
              {showIgnored ? 'Show All' : 'Hide Ignored'}
            </button>

            {/* Mass ignore */}
            <div className="relative">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                <MoreHorizontal size={14} />
                Bulk Actions
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-500" />
            <span className="text-xs text-slate-600">
              Total Locations: <span className="font-semibold text-slate-800">{totalLocations}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-slate-600">
              Inventory Issues: <span className="font-semibold text-slate-800">{inventoryIssues}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-600">
              Slotting Issues: <span className="font-semibold text-slate-800">{slottingIssues}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-xs text-slate-600">
              Ignored: <span className="font-semibold text-slate-800">{ignoredCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-xs text-slate-600">
              Total Bypasses: <span className="font-semibold text-slate-800">{totalBypasses}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500 mr-2">Filter:</span>
          <div className="flex gap-1">
            {[
              { value: 'all', label: `All (${activeLocations})` },
              { value: 'inventory-issue', label: `Inventory Issues (${inventoryIssues})` },
              { value: 'slotting-issue', label: `Slotting Issues (${slottingIssues})` },
              { value: 'ignored', label: `Ignored (${ignoredCount})` },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filter === f.value
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk action bar (when items are selected) */}
      {ignoredCount > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeOff size={14} className="text-blue-600" />
              <span className="text-xs text-blue-700">
                {ignoredCount} location{ignoredCount > 1 ? 's' : ''} marked as ignored
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMassUnignore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all"
              >
                <RotateCw size={12} />
                Restore All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location list */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <MapPin size={48} className="mb-3 opacity-50" />
            <p className="text-sm">No locations match current filter</p>
          </div>
        ) : (
          filteredLocations.map(location => (
            <LocationCard
              key={location.id}
              location={location}
              onAction={handleAction}
              onToggleIgnore={handleToggleIgnore}
            />
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info size={12} />
          <span>
            Locations are identified when pickers bypass them and report empty location or wrong location.
            Use the filters above to sort and filter by zone, issue type, and volume.
            Click eye icon to ignore false positives.
          </span>
        </div>
      </div>
    </div>
  )
}
