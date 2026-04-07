import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { X, Send, MessageSquare, CheckCircle, ChevronDown, PanelRight } from 'lucide-react'
import mapData from '../data/warehouseProcessMap.json'
import { DC_MANAGER_DATA } from '../mockData.js'

const DOCK_BTN = { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, borderRadius: 4, display: 'flex' }

function DockControls({ position, onDockRight, onDockBottom }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {position === 'bottom' && (
        <button onClick={onDockRight} title="Dock to right" style={DOCK_BTN}>
          <PanelRight size={14} />
        </button>
      )}
      {position === 'right' && (
        <button onClick={onDockBottom} title="Dock to bottom" style={DOCK_BTN}>
          <ChevronDown size={14} />
        </button>
      )}
    </div>
  )
}

// ─── Status helpers ────────────────────────────────────────────────────────────
function getStatus(current, target) {
  const ratio = current / target
  if (ratio >= 1.05) return 'good'     // ≥105% of target
  if (ratio >= 0.90) return 'average'  // 90-105% of target
  return 'bad'                          // <90% of target
}

function getStatusColors(status, selected) {
  const colors = {
    good: {
      bg: selected ? '#D1FAE5' : '#ECFDF5',
      border: '#10B981',
      text: '#065F46',
    },
    average: {
      bg: selected ? '#FEF3C7' : '#FFFBEB',
      border: '#F59E0B',
      text: '#92400E',
    },
    bad: {
      bg: selected ? '#FEE2E2' : '#FEF2F2',
      border: '#EF4444',
      text: '#991B1B',
    },
  }
  return colors[status] || colors.average
}

function StatusDot({ status }) {
  const color = {
    good: '#10B981',
    average: '#F59E0B',
    bad: '#EF4444',
  }[status] || '#94A3B8'

  return (
    <span
      style={{
        display: 'inline-block',
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: color,
        marginLeft: 4,
      }}
    />
  )
}

// ─── Swimlane Node ────────────────────────────────────────────────────────────
function SwimlaneNode({ data, style }) {
  return (
    <div
      style={{
        width: style?.width ?? '100%',
        height: style?.height ?? '100%',
        border: '1px solid #CBD5E1',
        borderRadius: 6,
        background: 'rgba(255,255,255,0.55)',
        position: 'relative',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: -26,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#6B7280',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {data.label}
      </span>
    </div>
  )
}

// ─── Process Node (regular box with status colors) ─────────────────────────────
function ProcessNode({ data, selected }) {
  const lines = data.label.split('\n')
  const throughput = data.nodeInfo?.throughput
  const backlog = data.nodeInfo?.backlog

  const status = throughput ? getStatus(throughput.current, throughput.target) : 'average'
  const colors = getStatusColors(status, selected)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: selected ? '#EFF6FF' : colors.bg,
        border: `2px solid ${selected ? '#2563EB' : colors.border}`,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
        boxShadow: selected ? '0 0 0 3px rgba(37,99,235,0.25)' : 'none',
        padding: '4px 6px',
      }}
    >
      <Handle type="target" position={Position.Left}  style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Top}   style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />

      {/* Label */}
      <div style={{ textAlign: 'center', marginBottom: 2 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 'bold', lineHeight: 1.2, color: selected ? '#1E40AF' : '#333' }}>
            {line}
          </div>
        ))}
      </div>

      {/* Backlog and Throughput */}
      {backlog && throughput && (
        <div style={{ fontSize: 7, color: '#666', textAlign: 'center', lineHeight: 1.3 }}>
          <div>{backlog.units} u ({backlog.estimatedHours}h)</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {throughput.current} {throughput.unit}
            <StatusDot status={status} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Bar Node (tall vertical bar for Receiving / Loading) ────────────────────
function BarNode({ data, selected }) {
  const lines = data.label.split('\n')
  const throughput = data.nodeInfo?.throughput
  const backlog = data.nodeInfo?.backlog

  const status = throughput ? getStatus(throughput.current, throughput.target) : 'average'
  const colors = getStatusColors(status, selected)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: selected ? '#EFF6FF' : colors.bg,
        border: `2px solid ${selected ? '#2563EB' : colors.border}`,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxSizing: 'border-box',
        boxShadow: selected ? '0 0 0 3px rgba(37,99,235,0.25)' : 'none',
        transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
      }}
    >
      <Handle type="target" position={Position.Left}   style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Top}    style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />

      <div style={{ transform: 'rotate(180deg)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 'bold', lineHeight: 1.35, color: selected ? '#1E40AF' : '#333' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

const nodeTypes = {
  swimlane: SwimlaneNode,
  processNode: ProcessNode,
  barNode: BarNode,
}

// ─── Delta helpers ────────────────────────────────────────────────────────────
function parseNumeric(str) {
  return parseFloat(String(str).replace(/[^0-9.]/g, ''))
}

function DeltaBadge({ current, benchmarkVal }) {
  if (benchmarkVal == null) return null
  const delta = ((parseNumeric(current) - benchmarkVal) / benchmarkVal) * 100
  if (isNaN(delta)) return null
  const positive = delta >= 0
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 600,
      color: positive ? '#059669' : '#dc2626',
      marginLeft: 5,
    }}>
      {positive ? '↑' : '↓'} {positive ? '+' : ''}{delta.toFixed(1)}%
    </span>
  )
}

// ─── Tooltip Component ────────────────────────────────────────────────────────
function NodeTooltip({ node, position, onClose, benchmarkPeriod, onSuggestionClick }) {
  const tooltipRef = useRef(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    if (tooltipRef.current && position) {
      const rect = tooltipRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let x = position.x
      let y = position.y

      // Adjust horizontal position
      if (x + rect.width > viewportWidth - 20) {
        x = viewportWidth - rect.width - 20
      }
      if (x < 20) {
        x = 20
      }

      // Adjust vertical position
      if (y + rect.height > viewportHeight - 20) {
        y = position.y - rect.height - 10 // Show above instead
      }
      if (y < 20) {
        y = 20
      }

      setAdjustedPosition({ x, y })
    }
  }, [position])

  if (!node) return null

  const throughput = node.data.nodeInfo?.throughput
  const backlog = node.data.nodeInfo?.backlog
  const status = throughput ? getStatus(throughput.current, throughput.target) : 'average'

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '14px 16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: 220,
        maxWidth: 320,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          borderRadius: 4,
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={14} />
      </button>

      <p style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 10, paddingRight: 20 }}>
        {node.data.label.replace(/\n/g, ' ')}
      </p>

      {/* Backlog and Throughput with status */}
      {(backlog || throughput) && (
        <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
          {backlog && (
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                Backlog
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                {backlog.units.toLocaleString()} units ({backlog.estimatedHours}h)
              </div>
            </div>
          )}
          {throughput && (
            <div>
              <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                Throughput
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center' }}>
                {throughput.current} {throughput.unit}
                <StatusDot status={status} />
                <span style={{ fontSize: 10, color: '#64748b', marginLeft: 6 }}>
                  (target: {throughput.target})
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* All metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 16px', marginBottom: 12 }}>
        {Object.entries(node.data.metrics || {}).map(([key, value]) => {
          const benchmarkVal = node.data.nodeInfo?.metricBenchmarks?.[benchmarkPeriod]?.[key]
          return (
            <div key={key}>
              <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 1 }}>
                {key}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'baseline' }}>
                {value}
                <DeltaBadge current={value} benchmarkVal={benchmarkVal} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Inbound Variability contributor for Receiving / Unloading node */}
      {node.id === 'receiving' && (() => {
        const ivData = DC_MANAGER_DATA.contributorDetail.inboundVariability
        return (
          <div style={{ paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Inbound Variability Analysis</span>
              <span style={{ padding: '2px 6px', borderRadius: 9999, background: '#fee2e2', color: '#991b1b', fontSize: 10, fontWeight: 600 }}>High Risk</span>
            </div>

            {/* Workload Mix Chart */}
            <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Inbound Workload Mix (%)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ivData.chartData.map(row => {
                  const total = row.conveyor + row.pallet + row.flat
                  const conveyorPct = Math.round((row.conveyor / total) * 100)
                  const palletPct = Math.round((row.pallet / total) * 100)
                  const flatPct = 100 - conveyorPct - palletPct
                  const isToday = row.label === 'Today'
                  const isFuture = row.label === 'Tomorrow'
                  return (
                    <div key={row.label}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: '#64748b', marginBottom: 3 }}>
                        <span style={{ fontWeight: isToday ? 600 : isFuture ? 600 : 400, color: isToday ? '#1e293b' : isFuture ? '#7c3aed' : '#64748b' }}>
                          {row.label}
                        </span>
                        <span style={{ color: '#94a3b8' }}>{total} u</span>
                      </div>
                      <div style={{ height: 12, borderRadius: 9999, overflow: 'hidden', display: 'flex', opacity: isFuture ? 0.6 : 1 }}>
                        <div style={{ background: '#3b82f6', height: '100%', width: `${conveyorPct}%` }} title={`Conveyor ${conveyorPct}%`} />
                        <div style={{ background: '#a78bfa', height: '100%', width: `${palletPct}%` }} title={`Pallet ${palletPct}%`} />
                        <div style={{ background: '#cbd5e1', height: '100%', width: `${flatPct}%` }} title={`Flat ${flatPct}%`} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, fontSize: 10, color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />Conveyor</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />Pallet</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }} />Flat</span>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Maintenance Status card for Unit Sorter node */}
      {node.id === 'pick_and_load' && (() => {
        const d = DC_MANAGER_DATA.contributorDetail.sorterMaintenance
        const suggestionText =
          `Create maintenance ticket for Sorter ${d.sorterToService} and take offline for belt inspection, monitor error_rate and throughput for next 1h`
        return (
          <div style={{ marginTop: 10, borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
            {/* Header row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#1e293b' }}>Maintenance Status</span>
              <span style={{ fontSize:10, fontWeight:600, background:'#fee2e2', color:'#991b1b',
                             padding:'1px 7px', borderRadius:9999 }}>Action Required</span>
            </div>

            {/* Equipment overview */}
            <div style={{ fontSize:11, color:'#64748b', marginBottom:6 }}>
              {d.operational} sorters operational · {d.inMaintenance} in maintenance
            </div>

            {/* Inner card: Sorter 3 — RED */}
            <div style={{ background:'#fff', border:'1px solid #fee2e2', borderRadius:8, padding:'8px 10px', marginBottom:6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:11, fontWeight:600, color:'#1e293b' }}>Sorter {d.sorterToService}</span>
                <span style={{ fontSize:10, fontWeight:600, background:'#fee2e2', color:'#dc2626',
                               padding:'1px 6px', borderRadius:9999 }}>🔴 Critical</span>
              </div>
              <div style={{ fontSize:10, color:'#64748b', marginTop:4 }}>
                Belt inspection: <strong>{d.sorterHoursRun}h</strong> run · threshold {d.inspectionThreshold}h
              </div>
              {/* Hours bar */}
              <div style={{ marginTop:5, height:6, background:'#fee2e2', borderRadius:3, position:'relative' }}>
                <div style={{ height:'100%', borderRadius:3, background:'#ef4444',
                              width:`${Math.min((d.sorterHoursRun / (d.inspectionThreshold * 1.5)) * 100, 100)}%` }} />
                {/* Threshold marker */}
                <div style={{ position:'absolute', top:0, bottom:0, width:2, background:'#7f1d1d',
                              left:`${(d.inspectionThreshold / (d.inspectionThreshold * 1.5)) * 100}%` }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'#94a3b8', marginTop:2 }}>
                <span>0h</span><span>threshold: {d.inspectionThreshold}h</span>
              </div>
            </div>

            {/* Inner card: Sorters 1 & 2 — YELLOW */}
            <div style={{ background:'#fff', border:'1px solid #fde68a', borderRadius:8, padding:'8px 10px', marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:11, fontWeight:600, color:'#1e293b' }}>Sorters 1 & 2</span>
                <span style={{ fontSize:10, fontWeight:600, background:'#fffbeb', color:'#92400e',
                               padding:'1px 6px', borderRadius:9999 }}>🟡 Warning</span>
              </div>
              <div style={{ fontSize:10, color:'#64748b', marginTop:4 }}>
                Error rate: <strong>{d.errorRate}%</strong> · target &lt;{d.errorRateTarget}%
              </div>
              {/* Error rate bar */}
              <div style={{ marginTop:5, height:6, background:'#fef3c7', borderRadius:3, position:'relative' }}>
                <div style={{ height:'100%', borderRadius:3, background:'#f59e0b',
                              width:`${Math.min((d.errorRate / 5) * 100, 100)}%` }} />
                <div style={{ position:'absolute', top:0, bottom:0, width:2, background:'#92400e',
                              left:`${(d.errorRateTarget / 5) * 100}%` }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'#94a3b8', marginTop:2 }}>
                <span>0%</span><span>target: {d.errorRateTarget}%</span>
              </div>
            </div>

            {/* REC-002 button */}
            <button onClick={() => onSuggestionClick?.(suggestionText)} style={{
              width:'100%', textAlign:'left', padding:'7px 10px', borderRadius:8, cursor:'pointer',
              background:'#fff7ed', border:'1px solid #fcd34d', color:'#92400e',
              fontSize:10, lineHeight:1.4,
            }}>
              <span style={{ marginRight:4 }}>💡</span>
              <strong>REC-002:</strong> Create maintenance ticket &amp; take Sorter {d.sorterToService} offline for belt inspection.
            </button>

            {/* REC-003 button */}
            {(() => {
              const rec003SuggestionText = `Run diagnostic on Sorters 1 and 2 to investigate error rate spike, monitor error_rate and throughput for next 2h`
              return (
                <button onClick={() => onSuggestionClick?.(rec003SuggestionText)} style={{
                  width:'100%', textAlign:'left', padding:'7px 10px', borderRadius:8, cursor:'pointer',
                  background:'#fff7ed', border:'1px solid #fcd34d', color:'#92400e',
                  fontSize:10, lineHeight:1.4, marginTop:6,
                }}>
                  <span style={{ marginRight:4 }}>💡</span>
                  <strong>REC-003:</strong> Run diagnostic on Sorters 1 &amp; 2 to investigate error rate spike (2.3% → target &lt;{d.errorRateTarget}%).
                </button>
              )
            })()}
          </div>
        )
      })()}

      {/* Shuttle/XDK Labor Staffing Analysis block */}
      {node.id === 'shuttle_xdk' && (() => {
        const d = DC_MANAGER_DATA.contributorDetail.shuttleXDKLabor
        const staffingPct = Math.round((d.checkedIn / d.totalAssigned) * 100)
        const deficit = d.shiftCapacity - d.shiftEstimated  // -6.2
        const capacityPct = Math.round((d.shiftCapacity / d.shiftEstimated) * 100) // 56%
        const donePct = Math.round((d.shiftDone / d.shiftEstimated) * 100)         // 0%
        const suggestionText = `Reassign ${d.rec001Worker} from ${d.surplusZone} to Shuttle/XDK and monitor throughput and backlog for the next 1h`
        return (
          <div style={{ paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Labor Staffing Analysis</span>
              <span style={{ padding: '2px 6px', borderRadius: 9999, background: '#fee2e2', color: '#991b1b', fontSize: 10, fontWeight: 600 }}>Critical</span>
            </div>

            <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', padding: 12 }}>
              {/* Staffing bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                <span>Staffing</span>
                <span style={{ color: '#991b1b' }}>{d.checkedIn} / {d.totalAssigned} workers · {staffingPct}%</span>
              </div>
              <div style={{ height: 12, background: '#fde8d8', borderRadius: 4, marginBottom: 12, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${staffingPct}%`, background: '#f97316' }} />
              </div>

              {/* Workload vs Capacity bars */}
              <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Workload vs. Capacity — Current Shift</div>

              {/* Workload row */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', marginBottom: 3 }}>
                  <span>Workload</span>
                  <span>{d.shiftDone} h done / {d.shiftEstimated} h est.</span>
                </div>
                <div style={{ height: 10, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${donePct}%`, background: '#3b82f6' }} />
                </div>
              </div>

              {/* Capacity row */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', marginBottom: 3 }}>
                  <span>Capacity</span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>{d.shiftCapacity} h available · {deficit.toFixed(1)} h deficit</span>
                </div>
                <div style={{ position: 'relative', height: 10, background: '#fee2e2', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${capacityPct}%`, background: '#ef4444' }} />
                  {/* Full workload marker at 100% */}
                  <div style={{ position: 'absolute', top: 0, left: '100%', height: '100%', width: 2, background: '#7f1d1d', transform: 'translateX(-1px)' }} />
                </div>
              </div>

              {/* Suggestion button */}
              <button
                onClick={() => onSuggestionClick?.(suggestionText)}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 10px',
                  background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 6,
                  fontSize: 10, color: '#92400e', cursor: 'pointer', lineHeight: 1.4,
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                }}
              >
                <span style={{ fontSize: 12, marginTop: -1 }}>💡</span>
                <span>REC-001: Reassign <strong>{d.rec001Worker}</strong> ({d.rec001ExperienceMonths} mo. exp.) from {d.surplusZone} (+{d.surplusHours} h surplus) → Shuttle/XDK.</span>
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ─── Helper: LMS Action Standardizer ──────────────────────────────────────────
function buildStandardizedAction(rawText) {
  const workerMatch = rawText.match(/Reassign\s+([\w\s]+?)\s+from/i)
  const fromMatch = rawText.match(/from\s+(.+?)\s+to\s+/i)
  const toMatch = rawText.match(/to\s+([\w/\s]+?)\s+and/i)
  const durationMatch = rawText.match(/next\s+(\w+)/i)
  return {
    tool: 'lms_reassign_worker',
    parameters: {
      worker_name: workerMatch?.[1]?.trim() ?? 'Unknown',
      source_zone: fromMatch?.[1]?.trim() ?? 'Unknown',
      target_zone: toMatch?.[1]?.trim() ?? 'Unknown',
      effective_time: 'immediate',
      monitoring: {
        duration: durationMatch?.[1] ?? '1h',
        metrics: ['throughput_per_hour', 'backlog_units'],
      },
      priority: 'critical',
    },
  }
}

// ─── Helper: WES Maintenance Action Standardizer ────────────────────────────
function buildMaintenanceAction(rawText) {
  const sorterMatch   = rawText.match(/Sorter\s+(\d+)/i)
  const durationMatch = rawText.match(/next\s+(\w+)/i)
  return {
    tool: 'wes_maintenance_ticket',
    parameters: {
      sorter_id:      sorterMatch?.[1] ?? '3',
      issue:          'Belt inspection overdue',
      action:         'Take offline for belt inspection',
      effective_time: 'immediate',
      monitoring: {
        duration: durationMatch?.[1] ?? '1h',
        metrics:  ['error_rate', 'throughput_per_hour'],
      },
      priority: 'critical',
    },
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WarehouseProcessMap({ benchmarkPeriod = '30', onLMSConfirm, onNavigateToActionHistory }) {
  const [selectedNode, setSelectedNode] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [pendingAction, setPendingAction] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [confirmMode, setConfirmMode] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [standardizedAction, setStandardizedAction] = useState(null)
  const [lmsResponse, setLmsResponse] = useState(null)
  const [dialogHistory, setDialogHistory] = useState([]) // { id, query, response }
  const containerRef = useRef(null)
  const lmsInputRef = useRef(null)
  const rfInstance = useRef(null)

  const [dialogPosition, setDialogPosition] = useState('right')
  const [dialogWidth, setDialogWidth] = useState(380)
  const dragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartWidth = useRef(0)

  const onResizeMouseDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    dragStartX.current = e.clientX
    dragStartWidth.current = dialogWidth
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [dialogWidth])

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return
      const delta = dragStartX.current - e.clientX
      setDialogWidth(Math.min(600, Math.max(280, dragStartWidth.current + delta)))
    }
    const onMouseUp = () => {
      if (!dragging.current) return
      dragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const rfNodes = useMemo(() => {
    const swimlaneNodes = mapData.swimlanes.map(s => ({
      id: s.id,
      type: 'swimlane',
      position: { x: s.x, y: s.y },
      style: { width: s.width, height: s.height },
      data: { label: s.label },
      selectable: false,
      draggable: false,
      zIndex: -1,
    }))

    const processNodes = mapData.nodes.map(n => ({
      id: n.id,
      type: n.nodeType === 'bar' ? 'barNode' : 'processNode',
      position: { x: n.x, y: n.y },
      style: { width: n.width, height: n.height },
      data: { label: n.label, metrics: n.metrics, nodeInfo: n },
      draggable: false,
      zIndex: 1,
    }))

    return [...swimlaneNodes, ...processNodes]
  }, [])

  const rfEdges = useMemo(() =>
    mapData.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      style: { stroke: '#2196F3', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#2196F3', width: 14, height: 14 },
      zIndex: 0,
    })),
  [])

  const handleNodeClick = useCallback((event, node) => {
    if (node.type === 'swimlane') return

    // Get click position for tooltip
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltipPosition({
        x: event.clientX + 15,
        y: event.clientY - 10,
      })
    }

    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }, [])

  const handleCloseTooltip = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleLMSSend = useCallback(() => {
    setIsProcessing(true)
    setTimeout(() => {
      const action = selectedNode?.id === 'pick_and_load'
        ? buildMaintenanceAction(pendingAction)
        : buildStandardizedAction(pendingAction)
      setStandardizedAction(action)
      setIsProcessing(false)
      setConfirmMode(true)
    }, 1000)
  }, [pendingAction, selectedNode])

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedNode && !event.target.closest('[data-tooltip]')) {
        // Check if click is on another node
        const target = event.target
        if (!target.closest('.react-flow__node')) {
          setSelectedNode(null)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [selectedNode])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (rfInstance.current) {
        rfInstance.current.fitView({ padding: 0.06 })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Auto-resize textarea when pendingAction changes
  useEffect(() => {
    const ta = lmsInputRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = ta.scrollHeight + 'px'
    }
  }, [pendingAction])

  const dialogInput = (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
      <textarea
        ref={lmsInputRef}
        value={pendingAction}
        onChange={e => setPendingAction(e.target.value)}
        rows={1}
        placeholder="Take action on WES, LMS, WMS, ERP..."
        style={{
          flex: '1 1 auto', resize: 'none', background: '#f8fafc',
          border: '1px solid #e2e8f0', borderRadius: 12,
          padding: '8px 12px', fontSize: 14, color: '#1e293b',
          outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
          overflow: 'hidden',
        }}
      />
      <button
        onClick={handleLMSSend}
        disabled={!pendingAction.trim()}
        style={{
          width: 36, height: 36, borderRadius: 12, background: '#2563eb', color: 'white',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, cursor: pendingAction.trim() ? 'pointer' : 'not-allowed',
          opacity: pendingAction.trim() ? 1 : 0.4,
        }}
      >
        <Send size={15} />
      </button>
    </div>
  )

  const clearDialog = () => { setPendingAction(''); setSubmittedQuery(''); setConfirmMode(false); setIsProcessing(false); setStandardizedAction(null); setLmsResponse(null); setDialogHistory([]) }

  const renderResponseCard = (resp) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', background: '#2563eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 2,
      }}>
        <MessageSquare size={12} color="white" />
      </div>
      <div style={{
        flex: 1, background: 'white', borderRadius: 12,
        border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 12px', background: '#f0fdf4', borderBottom: '1px solid #dcfce7',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8, background: '#dcfce7',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CheckCircle size={14} color="#16a34a" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>
              {resp.tool === 'wes_maintenance_ticket' ? 'Maintenance ticket created' : 'Action submitted to LMS'}
            </div>
            <div style={{ fontSize: 11, color: '#16a34a' }}>
              {resp.tool === 'wes_maintenance_ticket' ? 'Monitoring started' : 'Reassignment queued and monitoring started'}
            </div>
          </div>
        </div>
        <div style={{ padding: '10px 12px', fontSize: 12, color: '#475569', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {resp.tool === 'wes_maintenance_ticket' ? (
            <>
              <div><span style={{ fontWeight: 600, color: '#1e293b' }}>Sorter: </span>{resp.parameters.sorter_id}</div>
              <div><span style={{ fontWeight: 600, color: '#1e293b' }}>Issue: </span>{resp.parameters.issue}</div>
              <div><span style={{ fontWeight: 600, color: '#1e293b' }}>Action: </span>{resp.parameters.action}</div>
              <div><span style={{ fontWeight: 600, color: '#1e293b' }}>Monitoring: </span>{resp.parameters.monitoring.metrics.join(', ')} for {resp.parameters.monitoring.duration}</div>
              <div><span style={{ fontWeight: 600, color: '#1e293b' }}>Status: </span><span style={{ color: '#16a34a', fontWeight: 600 }}>✓ Confirmed</span></div>
            </>
          ) : (
            <>
              <div><span style={{ fontWeight: 600, color: '#1e293b' }}>Worker: </span>{resp.parameters.worker_name}</div>
              <div><span style={{ fontWeight: 600, color: '#1e293b' }}>Reassigned: </span>{resp.parameters.source_zone} → {resp.parameters.target_zone}</div>
              <div><span style={{ fontWeight: 600, color: '#1e293b' }}>Monitoring: </span>{resp.parameters.monitoring.metrics.join(', ')} for {resp.parameters.monitoring.duration}</div>
              <div><span style={{ fontWeight: 600, color: '#1e293b' }}>Status: </span><span style={{ color: '#16a34a', fontWeight: 600 }}>✓ Confirmed</span></div>
            </>
          )}
          <div style={{ marginTop: 4, paddingTop: 8, borderTop: '1px solid #e2e8f0', fontSize: 11, color: '#64748b' }}>
            View KPI metrics in{' '}
            <button
              onClick={() => onNavigateToActionHistory?.()}
              style={{
                background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer',
                textDecoration: 'underline', fontWeight: 600, fontSize: 11, padding: 0,
              }}
            >
              Action History
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUserBubble = (text) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
      <div style={{
        background: '#2563eb', color: 'white', borderRadius: 12,
        padding: '8px 12px', fontSize: 13, lineHeight: 1.5,
        maxWidth: '85%',
      }}>
        {text}
      </div>
    </div>
  )

  const dialogResponses = (
    <>
      {/* Past conversations */}
      {dialogHistory.map(entry => (
        <div key={entry.id} style={{ marginBottom: 12 }}>
          {renderUserBubble(entry.query)}
          {renderResponseCard(entry.response)}
        </div>
      ))}

      {/* Active conversation */}
      {submittedQuery && (lmsResponse || isProcessing) && renderUserBubble(submittedQuery)}

      {isProcessing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', color: '#64748b', fontSize: 13 }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            border: '2px solid #e2e8f0', borderTopColor: '#2563eb',
            animation: 'spin 0.7s linear infinite', flexShrink: 0,
          }} />
          <span>Analyzing request and generating LMS action…</span>
        </div>
      )}

      {!isProcessing && confirmMode && standardizedAction && (
        <>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>
              ⚠️ The following action will be submitted to the <strong>{standardizedAction.tool === 'wes_maintenance_ticket' ? 'WES' : 'LMS'}</strong>:
            </span>
          </div>
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
            padding: '10px 12px', fontSize: 13, color: '#334155', lineHeight: 2,
            marginBottom: 10,
          }}>
            {standardizedAction.tool === 'wes_maintenance_ticket' ? (
              <>
                Create maintenance ticket for{' '}
                <span style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>Sorter {standardizedAction.parameters.sorter_id}</span>
                {' '}—{' '}
                <span style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>{standardizedAction.parameters.issue}</span>
                . Monitor{' '}
                <span style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>{standardizedAction.parameters.monitoring.metrics.join(', ')}</span>
                {' '}for{' '}
                <span style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>{standardizedAction.parameters.monitoring.duration}</span>
                . Priority:{' '}
                <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 9999, padding: '1px 7px', fontWeight: 700, fontSize: 12 }}>{standardizedAction.parameters.priority.toUpperCase()}</span>
                .
              </>
            ) : (
              <>
                Reassign{' '}
                <span style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>{standardizedAction.parameters.worker_name}</span>
                {' '}from{' '}
                <span style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>{standardizedAction.parameters.source_zone}</span>
                {' '}to{' '}
                <span style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>{standardizedAction.parameters.target_zone}</span>
                , effective immediately. Monitor{' '}
                <span style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>{standardizedAction.parameters.monitoring.metrics[0]}</span>
                {' '}and{' '}
                <span style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>{standardizedAction.parameters.monitoring.metrics[1]}</span>
                {' '}for{' '}
                <span style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 9999, padding: '1px 7px', fontWeight: 600, fontSize: 12 }}>{standardizedAction.parameters.monitoring.duration}</span>
                . Priority:{' '}
                <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 9999, padding: '1px 7px', fontWeight: 700, fontSize: 12 }}>{standardizedAction.parameters.priority.toUpperCase()}</span>
                .
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                const action = standardizedAction
                onLMSConfirm?.(action)
                const query = pendingAction
                setSubmittedQuery(query)
                setPendingAction('')
                setConfirmMode(false)
                setStandardizedAction(null)
                setLmsResponse('thinking')
                setTimeout(() => {
                  setDialogHistory(prev => [...prev, { id: Date.now(), query, response: action }])
                  setLmsResponse(null)
                  setSubmittedQuery('')
                }, 1000)
              }}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, background: '#2563eb', color: 'white',
                border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              ✓ Confirm & Submit to {standardizedAction.tool === 'wes_maintenance_ticket' ? 'WES' : 'LMS'}
            </button>
            <button
              onClick={() => { setConfirmMode(false); setStandardizedAction(null) }}
              style={{
                padding: '8px 14px', borderRadius: 8, background: '#f1f5f9', color: '#475569',
                border: '1px solid #e2e8f0', fontSize: 12, cursor: 'pointer',
              }}
            >
              ← Edit
            </button>
          </div>
        </>
      )}

      {lmsResponse === 'thinking' && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%', background: '#2563eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 2,
          }}>
            <MessageSquare size={12} color="white" />
          </div>
          <div style={{
            background: 'white', border: '1px solid #e2e8f0', borderRadius: 12,
            padding: '10px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, background: '#cbd5e1', borderRadius: '50%',
                  animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {lmsResponse && lmsResponse !== 'thinking' && renderResponseCard(lmsResponse)}
    </>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: 632 }}>
      {/* Left: canvas + tooltip + bottom dock */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        {/* Flow canvas */}
        <div
          ref={containerRef}
          style={{ width: '100%', flex: 1, minHeight: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}
        >
          <ReactFlow
            defaultNodes={rfNodes}
            defaultEdges={rfEdges}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            onNodeClick={handleNodeClick}
            onInit={(instance) => { rfInstance.current = instance }}
            fitView
            fitViewOptions={{ padding: 0.06 }}
            minZoom={0.5}
            maxZoom={2}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            panOnDrag={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#f0f2f5" gap={24} size={1} />
          </ReactFlow>
        </div>

        {/* Tooltip */}
        {selectedNode && (
          <div data-tooltip>
            <NodeTooltip
              node={selectedNode}
              position={tooltipPosition}
              onClose={handleCloseTooltip}
              benchmarkPeriod={benchmarkPeriod}
              onSuggestionClick={(text) => {
                setPendingAction(text)
                setConfirmMode(false)
                setIsProcessing(false)
                setStandardizedAction(null)
                setLmsResponse(null)
                setTimeout(() => lmsInputRef.current?.focus(), 50)
              }}
            />
          </div>
        )}

        {/* CSS for spinner animation */}
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          .action-sidebar-scroll::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Bottom-docked dialog */}
        {dialogPosition === 'bottom' && (
          <div style={{ borderTop: '1px solid #e2e8f0', background: 'white', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', position: 'relative', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {(pendingAction || lmsResponse || submittedQuery || dialogHistory.length > 0) && (
                  <button
                    onClick={clearDialog}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, borderRadius: 4, display: 'flex' }}
                    title="Clear"
                  >
                    <X size={14} />
                  </button>
                )}
                <DockControls position="bottom" onDockRight={() => setDialogPosition('right')} onDockBottom={() => setDialogPosition('bottom')} />
              </div>
            </div>
            {dialogResponses}
            {!isProcessing && !confirmMode && dialogInput}
          </div>
        )}
      </div>

      {/* Right sidebar */}
      {dialogPosition === 'right' && (
        <>
          <div
            onMouseDown={onResizeMouseDown}
            style={{ width: 4, flexShrink: 0, cursor: 'col-resize', background: '#e5e7eb', transition: 'background 0.15s' }}
            onMouseEnter={(e) => { e.target.style.background = '#60a5fa' }}
            onMouseLeave={(e) => { e.target.style.background = '#e5e7eb' }}
          />
          <div style={{ width: dialogWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0', background: 'white', borderRadius: '0 8px 8px 0' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {(pendingAction || lmsResponse || submittedQuery || dialogHistory.length > 0) && (
                  <button
                    onClick={clearDialog}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, borderRadius: 4, display: 'flex' }}
                    title="Clear"
                  >
                    <X size={14} />
                  </button>
                )}
                <DockControls position="right" onDockRight={() => setDialogPosition('right')} onDockBottom={() => setDialogPosition('bottom')} />
              </div>
            </div>
            {/* Response area */}
            <div className="action-sidebar-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', background: '#f9fafb', scrollbarWidth: 'none' }}>
              {dialogResponses}
            </div>
            {/* Input pinned at bottom */}
            {!isProcessing && !confirmMode && (
              <div style={{ padding: '12px 16px', flexShrink: 0, flexGrow: 0, marginTop: 'auto', borderTop: '1px solid #f3f4f6', background: 'white' }}>
                {dialogInput}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
