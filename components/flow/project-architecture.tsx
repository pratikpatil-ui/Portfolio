'use client'

import { useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { projectArchitectures } from '@/data/projects'

/**
 * Custom node styles based on type
 */
const nodeColors = {
  frontend: '#4C8572',  // Sage
  backend: '#F2B647',   // Gold
  database: '#D4A373',  // Copper
  api: '#5FCCBA',       // Bright teal
  service: '#C97A5F',   // Rust
}

/**
 * Project Architecture Diagram Component
 * Uses React Flow to display system architecture
 * Shows nodes for different components and edges for data flow
 *
 * @param projectId - ID of the project to display
 */
export function ProjectArchitecture({ projectId }: { projectId: string }) {
  const architecture = projectArchitectures[projectId]

  // Convert architecture data to React Flow format (must be before conditional return)
  const initialNodes: Node[] = architecture?.nodes.map((node, index) => ({
    id: node.id,
    type: 'default',
    position: { x: (index % 3) * 200 + 100, y: Math.floor(index / 3) * 150 + 50 },
    data: { label: node.label },
    style: {
      background: nodeColors[node.type],
      color: 'white',
      border: '2px solid white',
      borderRadius: '8px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: 600,
    },
  }))

  const initialEdges: Edge[] = architecture?.edges.map((edge, index) => ({
    id: `e${index}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#4C8572',
    },
    style: {
      stroke: '#4C8572',
      strokeWidth: 2,
    },
    labelStyle: {
      fill: '#6B7280',
      fontSize: 11,
      fontWeight: 500,
    },
  }))

  const [nodes, , onNodesChange] = useNodesState(initialNodes || [])
  const [edges, , onEdgesChange] = useEdgesState(initialEdges || [])

  if (!architecture) {
    return <div className="text-muted-foreground">Architecture diagram not available</div>
  }

  return (
    <div style={{ width: '100%', height: '400px' }} className="rounded-lg overflow-hidden border border-border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#E0EFE9" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const nodeData = architecture.nodes.find((n) => n.id === node.id)
            return nodeData ? nodeColors[nodeData.type] : '#4C8572'
          }}
          maskColor="rgba(224, 239, 233, 0.6)"
        />
      </ReactFlow>
    </div>
  )
}
