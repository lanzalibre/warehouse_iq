import { useState, useEffect, useRef } from 'react'
import { Settings, Lock, Unlock, Wrench, Users, Truck, TrendingUp, X, Pencil } from 'lucide-react'
import { SHIFT_HANDOVER_REPORTS } from '../mockData'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const ALL_KPI_OPTIONS = [
  { id: 'otif', label: 'OTIF' },
  { id: 'absenteeism', label: 'Absenteeism' },
  { id: 'laborPlanned', label: 'Labor Planned' },
  { id: 'laborExecuted', label: 'Labor Executed' },
  { id: 'machineDowntime', label: 'Machine Downtime' },
]

const AVAILABLE_CARDS = [
  { type: 'unitSorterMaintenance', label: 'Unit Sorter Maintenance', icon: Wrench },
  { type: 'absenteeismDetail', label: 'Absenteeism Detail', icon: Users },
  { type: 'truckDepartureLog', label: 'Truck Departure Log', icon: Truck },
  { type: 'inboundVariability', label: 'Inbound Variability', icon: TrendingUp },
]

const SHIFT_COLORS = {
  AM: { bg: 'bg-blue-100', text: 'text-blue-700' },
  PM: { bg: 'bg-orange-100', text: 'text-orange-700' },
  Night: { bg: 'bg-slate-200', text: 'text-slate-600' },
}

const SHIFT_WEIGHT = { AM: 1, PM: 2, Night: 3 }

function formatShortDate(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

function getDayOfWeek(isoDate) {
  return DAYS[new Date(isoDate + 'T00:00:00').getDay()]
}

function formatKpi(key, value) {
  switch (key) {
    case 'otif':
      return `${value.toFixed(1)}%`
    case 'absenteeism':
      return `${value.toFixed(1)}%`
    case 'laborPlanned':
    case 'laborExecuted':
      return `${value.toFixed(1)}h`
    case 'machineDowntime':
      return `${Math.round(value)}m`
    default:
      return String(value)
  }
}

function OtifGauge({ value }) {
  const R = 50
  const cx = 70
  const cy = 65
  const C = Math.PI * R

  const filled = (value / 100) * C
  const color = value >= 97 ? '#10b981' : value >= 95 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="160" height="90" viewBox="0 0 160 90" className="mb-2">
        <defs>
          <clipPath id="topHalf">
            <rect x="0" y="0" width="160" height="65" />
          </clipPath>
        </defs>

        {/* Background circles for zones */}
        <g clipPath="url(#topHalf)">
          {/* Red zone: 0-95% */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#fee2e2" strokeWidth="6" />
          {/* Yellow zone: 95-97% */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="#fef3c7"
            strokeWidth="6"
            strokeDasharray={`${(0.02 * C) / 2},${C}`}
            strokeDashoffset={`${(0.95 * C) / 2}`}
          />
          {/* Green zone: 97-100% */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="#d1fae5"
            strokeWidth="6"
            strokeDasharray={`${(0.03 * C) / 2},${C}`}
            strokeDashoffset={`${(0.97 * C) / 2}`}
          />
          {/* Filled value arc */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${filled},${C}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
        </g>

        {/* Value text */}
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="24" fontWeight="bold" fill={color}>
          {value.toFixed(1)}%
        </text>
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">
          OTIF
        </text>
      </svg>
    </div>
  )
}

function ShiftBadge({ shift }) {
  const { bg, text } = SHIFT_COLORS[shift]
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${bg} ${text} inline-block`}>
      {shift}
    </span>
  )
}

function UnitSorterMaintenanceCard({ card }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
        <Wrench size={16} className="text-amber-600" />
        Unit Sorter Maintenance
      </h4>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-slate-600">Sorters: </span>
          <span className="font-medium">{card.sorterIds.join(', ')}</span>
        </div>
        <div>
          <span className="text-slate-600">Reason: </span>
          <span className="font-medium">{card.reason}</span>
        </div>
        <div>
          <span className="text-slate-600">Duration: </span>
          <span className="font-medium">
            {card.startedAt} – {card.resolvedAt}
          </span>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">
            {card.impactMinutes}m downtime
          </span>
        </div>
      </div>
    </div>
  )
}

function AbsenteeismDetailCard({ card }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <Users size={16} className="text-orange-600" />
        Absenteeism Detail
      </h4>
      <div className="space-y-2">
        {card.workers.map((worker, idx) => (
          <div key={idx} className="flex justify-between items-start text-sm pb-2 border-b border-slate-100 last:border-0">
            <div>
              <div className="font-medium text-slate-900">{worker.name}</div>
              <div className="text-xs text-slate-500">{worker.zone}</div>
            </div>
            <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">
              {worker.reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TruckDepartureLogCard({ card }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <Truck size={16} className="text-blue-600" />
        Truck Departure Log
      </h4>
      <div className="space-y-2">
        {card.departures.map((dep, idx) => {
          const isLate = dep.delta > 0
          return (
            <div
              key={idx}
              className="flex justify-between items-center text-sm pb-2 border-b border-slate-100 last:border-0"
            >
              <div>
                <div className="font-medium text-slate-900">{dep.truckId}</div>
                <div className="text-xs text-slate-500">
                  Planned {dep.planned} → Actual {dep.actual}
                </div>
              </div>
              <span
                className={`font-bold text-xs px-2 py-1 rounded ${
                  isLate ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {isLate ? `+${dep.delta}m` : `${dep.delta}m`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InboundVariabilityCard({ card }) {
  const total = card.conveyor + card.pallet + card.flat
  const conveyorPct = ((card.conveyor / total) * 100).toFixed(0)
  const palletPct = ((card.pallet / total) * 100).toFixed(0)
  const flatPct = ((card.flat / total) * 100).toFixed(0)

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <TrendingUp size={16} className="text-teal-600" />
        Inbound Variability
      </h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 w-20">Conveyor:</span>
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${conveyorPct}%` }}></div>
          </div>
          <span className="text-sm font-medium text-slate-900 w-12">{conveyorPct}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 w-20">Pallet:</span>
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${palletPct}%` }}></div>
          </div>
          <span className="text-sm font-medium text-slate-900 w-12">{palletPct}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 w-20">Flat:</span>
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500" style={{ width: `${flatPct}%` }}></div>
          </div>
          <span className="text-sm font-medium text-slate-900 w-12">{flatPct}%</span>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-600">
            Variance: <span className="font-bold text-slate-900">{card.variance.toFixed(1)}%</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function ExtraCard({ card }) {
  switch (card.type) {
    case 'unitSorterMaintenance':
      return <UnitSorterMaintenanceCard card={card} />
    case 'absenteeismDetail':
      return <AbsenteeismDetailCard card={card} />
    case 'truckDepartureLog':
      return <TruckDepartureLogCard card={card} />
    case 'inboundVariability':
      return <InboundVariabilityCard card={card} />
    default:
      return null
  }
}

function KpiPickerPopover({ visibleKpis, setVisibleKpis, popoverRef }) {
  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-2 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-3 w-56"
    >
      <div className="space-y-2">
        {ALL_KPI_OPTIONS.map(opt => (
          <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
            <input
              type="checkbox"
              checked={visibleKpis.includes(opt.id)}
              onChange={e => {
                if (e.target.checked) {
                  setVisibleKpis(prev => [...prev, opt.id])
                } else {
                  setVisibleKpis(prev => prev.filter(id => id !== opt.id))
                }
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function MasterPanel({ selectedId, setSelectedId, visibleKpis, setVisibleKpis, reports }) {
  const [showKpiPicker, setShowKpiPicker] = useState(false)
  const popoverRef = useRef(null)

  useEffect(() => {
    if (!showKpiPicker) return

    const handleClickOutside = e => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowKpiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showKpiPicker])

  return (
    <div className="w-[300px] flex-shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Reports</h3>
        <div className="relative">
          <button
            onClick={() => setShowKpiPicker(!showKpiPicker)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Settings size={16} className="text-slate-600" />
          </button>
          {showKpiPicker && (
            <KpiPickerPopover visibleKpis={visibleKpis} setVisibleKpis={setVisibleKpis} popoverRef={popoverRef} />
          )}
        </div>
      </div>

      {/* Report list */}
      <div className="flex-1 overflow-y-auto">
        {reports.map(report => {
          const isDraft = !report.submitted && !report.locked
          return (
            <button
              key={report.id}
              onClick={() => setSelectedId(report.id)}
              className={`w-full text-left px-4 py-3 border-b border-slate-200 transition-colors ${
                selectedId === report.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : isDraft
                    ? 'bg-amber-50 border-l-4 border-l-amber-400 hover:bg-amber-100'
                    : 'bg-white hover:bg-slate-50'
              }`}
            >
              {/* Date + Day + Shift */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{formatShortDate(report.date)}</div>
                  <div className="text-xs text-slate-500">{getDayOfWeek(report.date)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <ShiftBadge shift={report.shift} />
                  {isDraft && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Supervisor */}
              <div className="text-xs text-slate-600 mb-2">{report.supervisor}</div>

              {/* KPI values */}
              <div className="space-y-1">
                {visibleKpis.map(kpiKey => (
                  <div key={kpiKey} className="flex justify-between text-xs">
                    <span className="text-slate-600">{ALL_KPI_OPTIONS.find(k => k.id === kpiKey)?.label}:</span>
                    <span className="font-semibold text-slate-900">{formatKpi(kpiKey, report.kpis[kpiKey])}</span>
                  </div>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DetailPanel({ report, isSupervisor, draftText, setDraftText, activeCards, setActiveCards, onSubmit, isEditing, setIsEditing }) {
  const showWritingView = isSupervisor && !report.locked && (!report.submitted || isEditing)
  const [dragOver, setDragOver] = useState(false)

  if (!report) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <p className="text-lg font-medium mb-1">No report selected</p>
          <p className="text-sm">Select a report from the list to view details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-4">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-slate-600">
              {formatShortDate(report.date)} · {getDayOfWeek(report.date)}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <ShiftBadge shift={report.shift} />
              <span className="text-sm font-medium text-slate-700">{report.supervisor}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSupervisor && report.submitted && !report.locked && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Pencil size={12} />
                Edit
              </button>
            )}
            <div className="text-xs text-slate-500 text-right">
              {report.locked ? (
                <div className="flex items-center gap-1">
                  <Lock size={12} />
                  Locked {new Date(report.lockedAt).toLocaleDateString()},{' '}
                  {new Date(report.lockedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              ) : report.submitted ? (
                <div className="flex items-center gap-1 text-amber-600">
                  <Unlock size={12} />
                  Submitted · editable until locked
                </div>
              ) : (
                <div className="text-blue-600 font-medium">Draft</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showWritingView ? (
        // WRITING VIEW
        <div className="space-y-6">
          {/* Compose area */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Handover Narrative</label>
            <textarea
              value={draftText}
              onChange={e => setDraftText(e.target.value)}
              placeholder="Write the handover narrative here. Describe shift highlights, incidents, and handover notes for the incoming supervisor…"
              className="w-full min-h-[140px] p-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
            />
            <div className="text-xs text-slate-400 mt-1 text-right">{draftText.length} chars</div>
          </div>

          {/* Standard KPIs */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Standard KPIs</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <OtifGauge value={report.kpis.otif} />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{report.kpis.absenteeism.toFixed(1)}%</div>
                  <div className="text-xs text-slate-500 mt-2">Absenteeism</div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{report.kpis.laborPlanned.toFixed(1)}h</div>
                  <div className="text-xs text-slate-500 mt-2">Labor Planned</div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{report.kpis.laborExecuted.toFixed(1)}h</div>
                  <div className="text-xs text-slate-500 mt-2">Labor Executed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active cards */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Selected Cards</h4>
            <div
              onDragOver={e => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault()
                const cardType = e.dataTransfer.getData('cardType')
                if (!activeCards.find(c => c.type === cardType)) {
                  const newCard = buildDefaultCard(cardType)
                  setActiveCards(prev => [...prev, newCard])
                }
                setDragOver(false)
              }}
              className={`min-h-[120px] rounded-xl border-2 border-dashed transition-colors p-4 ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50'
              }`}
            >
              {activeCards.length === 0 ? (
                <div className="text-center text-slate-500 text-sm py-6">Drag cards from the bank below to add them</div>
              ) : (
                <div className="space-y-3">
                  {activeCards.map((card, idx) => (
                    <div key={idx} className="flex items-start justify-between bg-white rounded-lg p-3 border border-slate-200">
                      <span className="text-sm font-medium text-slate-700">
                        {AVAILABLE_CARDS.find(c => c.type === card.type)?.label}
                      </span>
                      <button
                        onClick={() => setActiveCards(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card bank */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Card Bank</h4>
            <div className="space-y-3">
              {AVAILABLE_CARDS.map(card => (
                <div
                  key={card.type}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('cardType', card.type)}
                  className="cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-blue-300 rounded-xl transition-all"
                >
                  <ExtraCard card={buildDefaultCard(card.type)} />
                </div>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onSubmit}
              className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {report.submitted ? 'Save Changes' : 'Submit Report'}
            </button>
          </div>
        </div>
      ) : (
        // READING VIEW
        <div className="space-y-6">
          {/* Narrative */}
          <div className="prose prose-sm max-w-none">
            {report.paragraphs.map((para, idx) => (
              <p key={idx} className="text-sm text-slate-700 leading-relaxed mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>

          {/* Standard KPIs */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Key Performance Indicators</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <OtifGauge value={report.kpis.otif} />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{report.kpis.absenteeism.toFixed(1)}%</div>
                  <div className="text-xs text-slate-500 mt-2">Absenteeism</div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{report.kpis.laborPlanned.toFixed(1)}h</div>
                  <div className="text-xs text-slate-500 mt-2">Planned</div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{report.kpis.laborExecuted.toFixed(1)}h</div>
                  <div className="text-xs text-slate-500 mt-2">Executed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Extra cards */}
          {activeCards.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Additional Details</h4>
              <div className="space-y-4">
                {activeCards.map((card, idx) => (
                  <ExtraCard key={idx} card={card} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function buildDefaultCard(type) {
  switch (type) {
    case 'unitSorterMaintenance':
      return {
        type: 'unitSorterMaintenance',
        sorterIds: ['US-1'],
        reason: 'Maintenance pending',
        startedAt: '--:--',
        resolvedAt: '--:--',
        impactMinutes: 0,
      }
    case 'absenteeismDetail':
      return {
        type: 'absenteeismDetail',
        workers: [{ name: 'Worker Name', zone: 'Zone', reason: 'Reason' }],
      }
    case 'truckDepartureLog':
      return {
        type: 'truckDepartureLog',
        departures: [{ truckId: 'TR-XX', planned: '--:--', actual: '--:--', delta: 0 }],
      }
    case 'inboundVariability':
      return {
        type: 'inboundVariability',
        conveyor: 45,
        pallet: 35,
        flat: 20,
        variance: 10.5,
      }
    default:
      return null
  }
}

export default function HandoverReport() {
  const [reports, setReports] = useState(SHIFT_HANDOVER_REPORTS)
  const [selectedId, setSelectedId] = useState(SHIFT_HANDOVER_REPORTS[5].id) // HR-006 (draft)
  const [visibleKpis, setVisibleKpis] = useState(['otif', 'absenteeism', 'laborPlanned', 'laborExecuted'])
  const [draftText, setDraftText] = useState('')
  const [activeCards, setActiveCards] = useState([])
  const [isEditing, setIsEditing] = useState(false)

  const selectedReport = reports.find(r => r.id === selectedId)
  const isSupervisor = true

  // Sort reports: descending by date, then descending by shift weight
  const sortedReports = [...reports].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date)
    return SHIFT_WEIGHT[b.shift] - SHIFT_WEIGHT[a.shift]
  })

  // Reset draft and editing mode when selection changes
  useEffect(() => {
    const r = reports.find(r => r.id === selectedId)
    if (r) {
      setDraftText(r.paragraphs.join('\n\n'))
      setActiveCards(r.extraCards || [])
    }
    setIsEditing(false)
  }, [selectedId, reports])

  const handleSubmit = () => {
    setReports(prev =>
      prev.map(r => {
        if (r.id === selectedId) {
          return {
            ...r,
            submitted: true,
            paragraphs: draftText.split('\n\n'),
            extraCards: activeCards,
          }
        }
        return r
      })
    )
    setIsEditing(false)
  }

  return (
    <div className="flex h-full bg-white">
      <MasterPanel
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        visibleKpis={visibleKpis}
        setVisibleKpis={setVisibleKpis}
        reports={sortedReports}
      />
      {selectedReport && (
        <DetailPanel
          report={selectedReport}
          isSupervisor={isSupervisor}
          draftText={draftText}
          setDraftText={setDraftText}
          activeCards={activeCards}
          setActiveCards={setActiveCards}
          onSubmit={handleSubmit}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  )
}
