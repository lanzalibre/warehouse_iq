import { useState } from 'react'
import {
  MapPin, Package, Layers, TrendingUp, Eye, EyeOff,
  Filter, MoreHorizontal, RotateCw, ClipboardCheck,
  ChevronDown, ChevronUp, Check, X, RefreshCw,
} from 'lucide-react'
import { MISPLACED_LOCATIONS_ALL, MISPLACED_ACTIONS, MISPLACED_ACCUMULATED_STATS, ZONE_CONFIG } from '../../../mockData.js'

// ─── Issue Type Badge ─────────────────────────────────────────────────────────────
function IssueTypeBadge({ issueType }) {
  const config = {
    'inventory-issue': {
      label: 'Inventory Accuracy Issue',
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

// ─── Location Card (enhanced with accumulation stats and multi-select) ───────────────
function LocationCard({ location, selected, onToggleSelect, onToggleIgnore, onAction }) {
  const zoneConfig = ZONE_CONFIG[location.zone]
  const [showBypasses, setShowBypasses] = useState(false)

  const handleAction = (actionId) => {
    onAction(location.id, actionId)
  }

  return (
    <div className={`border-2 rounded-xl p-4 mb-3 transition-all ${
      selected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
    } ${
      location.ignored
        ? 'bg-slate-50 border-slate-200 opacity-60'
        : location.issueType === 'inventory-issue'
          ? 'bg-red-50/50 border-red-200'
          : 'bg-amber-50/50 border-amber-200'
    }`}>
      {/* Header with checkbox */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(location.id)}
          className={`mt-4 w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500 ${
            location.ignored ? 'opacity-50' : ''
          }`}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div>
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

              {/* Accumulated stats */}
              {location.accumulated && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 rounded p-2">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wide">Shift Accumulated</div>
                    <div className="text-xs font-semibold text-slate-700">
                      {location.accumulated.shift.bypasses} bypasses / {Math.floor(location.accumulated.shift.minutesLost / 60)}h
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded p-2">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wide">Day Projected</div>
                    <div className="text-xs font-semibold text-slate-700">
                      {location.accumulated.day.bypasses} bypasses / {Math.floor(location.accumulated.day.minutesLost / 60)}h
                    </div>
                  </div>
                </div>
              )}
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
              <Package size={12} className="text-amber-500" />
              <span className="text-xs text-slate-500">Reasons:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {location.denialReasons.map((reason, idx) => (
                <span
                  key={`${reason}-${idx}`}
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
      </div>
    </div>
  )
}

// ─── Locations Tab Component ─────────────────────────────────────────────────────
export default function LocationsTab() {
  const [locations, setLocations] = useState(MISPLACED_LOCATIONS_ALL.slice(0, 20)) // Show first 20 for demo
  const [filter, setFilter] = useState('all')
  const [zoneFilter, setZoneFilter] = useState('All')
  const [issueTypeFilter, setIssueTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('volume-desc')
  const [showIgnored, setShowIgnored] = useState(true)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const ZONES = ['All', 'Zone A', 'Zone B', 'Zone C', 'Zone D', 'Crossdock']
  const ISSUE_TYPES = ['All', 'inventory-issue', 'slotting-issue']
  const SORT_OPTIONS = [
    { value: 'volume-desc', label: 'Volume (High to Low)' },
    { value: 'volume-asc', label: 'Volume (Low to High)' },
    { value: 'zone', label: 'Zone (A-Z)' },
    { value: 'issue-type', label: 'Issue Type' },
    { value: 'bypass-count', label: 'Bypass Count' },
  ]

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

  const handleToggleSelect = (locationId) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(locationId)) {
        newSet.delete(locationId)
      } else {
        newSet.add(locationId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredLocations.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredLocations.map(l => l.id)))
    }
  }

  const handleMassIgnore = () => {
    setLocations(prev => prev.map(loc => {
      if (selectedIds.has(loc.id)) {
        return { ...loc, ignored: true }
      }
      return loc
    }))
    setSelectedIds(new Set())
  }

  const handleMassCycleCount = () => {
    console.log('Trigger cycle count for:', Array.from(selectedIds))
    setSelectedIds(new Set())
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Accumulated stats bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-amber-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardCheck size={20} className="text-amber-600" />
            <div>
              <div className="text-sm font-bold text-slate-800">Accumulated Misplacements This Shift</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Based on {MISPLACED_ACCUMULATED_STATS.shift.totalBypasses} total bypasses
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{MISPLACED_ACCUMULATED_STATS.shift.totalBypasses}</div>
              <div className="text-xs text-slate-600 font-medium">Total Bypasses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{Math.floor(MISPLACED_ACCUMULATED_STATS.shift.totalMinutesLost / 60)}h</div>
              <div className="text-xs text-slate-600 font-medium">Minutes Lost</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-700">
                {Math.floor(MISPLACED_ACCUMULATED_STATS.shift.projectedEndOfShift.totalBypasses)}
              </div>
              <div className="text-xs text-slate-600 font-medium">Projected EoD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500 mr-2">Filter:</span>
            <div className="flex gap-1">
              {[
                { value: 'all', label: `All (${activeLocations})` },
                { value: 'inventory-issue', label: `Inventory Accuracy (${inventoryIssues})` },
                { value: 'slotting-issue', label: `Slotting (${slottingIssues})` },
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
          <div className="flex items-center gap-3">
            {/* Select all checkbox */}
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              <input
                type="checkbox"
                checked={selectedIds.size === filteredLocations.length && filteredLocations.length > 0}
                readOnly
                className="w-4 h-4 rounded border-slate-300 text-blue-500"
              />
              Select All
            </button>

            {/* Zone filter */}
            <select
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {ZONES.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>

            {/* Sort by */}
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
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-blue-600" />
              <span className="text-xs text-blue-700">
                {selectedIds.size} location{selectedIds.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMassCycleCount}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all"
              >
                <ClipboardCheck size={12} />
                Cycle Count
              </button>
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
              selected={selectedIds.has(location.id)}
              onToggleSelect={handleToggleSelect}
              onToggleIgnore={handleToggleIgnore}
              onAction={handleAction}
            />
          ))
        )}
      </div>

      {/* Stats bar */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-500" />
            <span className="text-xs text-slate-600">
              Total: <span className="font-semibold text-slate-800">{totalLocations}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-slate-600">
              Inventory: <span className="font-semibold text-slate-800">{inventoryIssues}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-600">
              Slotting: <span className="font-semibold text-slate-800">{slottingIssues}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-xs text-slate-600">
              Ignored: <span className="font-semibold text-slate-800">{ignoredCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="text-amber-500" />
            <span className="text-xs text-slate-600">
              Total Bypasses: <span className="font-semibold text-slate-800">{totalBypasses}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
