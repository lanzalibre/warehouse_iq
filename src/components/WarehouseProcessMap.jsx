import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { X } from 'lucide-react'
import mapData from '../data/warehouseProcessMap.json'

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
        border: '2px dashed #D32F2F',
        borderRadius: 4,
        background: 'rgba(240,240,240,0.15)',
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
          color: '#D32F2F',
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
function NodeTooltip({ node, position, onClose, benchmarkPeriod }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 16px' }}>
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
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WarehouseProcessMap({ benchmarkPeriod = '30' }) {
  const [selectedNode, setSelectedNode] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Flow canvas */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: 620, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}
      >
        <ReactFlow
          defaultNodes={rfNodes}
          defaultEdges={rfEdges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.06 }}
          minZoom={1}
          maxZoom={1}
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
          />
        </div>
      )}
    </div>
  )
}
