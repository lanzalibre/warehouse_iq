import { useState, useMemo, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { X } from 'lucide-react'
import mapData from '../data/warehouseProcessMap.json'

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

// ─── Process Node (regular amber box) ────────────────────────────────────────
function ProcessNode({ data, selected }) {
  const lines = data.label.split('\n')
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: selected ? '#EFF6FF' : '#FFFDE7',
        border: `2px solid ${selected ? '#2563EB' : '#FFB74D'}`,
        borderRadius: 5,
        display: 'flex',
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
      <div style={{ textAlign: 'center' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ fontSize: 10, fontWeight: 'bold', lineHeight: 1.35, color: selected ? '#1E40AF' : '#333' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Bar Node (tall vertical bar for Receiving / Loading) ────────────────────
function BarNode({ data, selected }) {
  const lines = data.label.split('\n')
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: selected ? '#EFF6FF' : '#FFFDE7',
        border: `2px solid ${selected ? '#2563EB' : '#FFB74D'}`,
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
      <div style={{ transform: 'rotate(180deg)', textAlign: 'center' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ fontSize: 10, fontWeight: 'bold', lineHeight: 1.35, color: selected ? '#1E40AF' : '#333' }}>
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WarehouseProcessMap({ benchmarkPeriod = '30' }) {
  const [selectedNode, setSelectedNode] = useState(null)

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

  const handleNodeClick = useCallback((_, node) => {
    if (node.type === 'swimlane') return
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Flow canvas */}
      <div style={{ width: '100%', height: 620, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
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
          minZoom={0.4}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#f0f2f5" gap={24} size={1} />
          <Controls showInteractive={false} style={{ bottom: 10, right: 10, left: 'unset' }} />
        </ReactFlow>
      </div>

      {/* Node detail panel */}
      {selectedNode && (
        <div
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '16px 20px',
            position: 'relative',
          }}
        >
          <button
            onClick={() => setSelectedNode(null)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
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
            <X size={16} />
          </button>

          <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
            {selectedNode.data.label.replace(/\n/g, ' ')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px 24px' }}>
            {Object.entries(selectedNode.data.metrics || {}).map(([key, value]) => {
              const benchmarkVal = selectedNode.data.nodeInfo?.metricBenchmarks?.[benchmarkPeriod]?.[key]
              return (
                <div key={key}>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                    {key}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'baseline' }}>
                    {value}
                    <DeltaBadge current={value} benchmarkVal={benchmarkVal} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
