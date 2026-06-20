import { useState, useMemo } from 'react';
import { supplyGraph, buildAdjacencyList } from '../../data/mockGraph';
import { findShortestPath } from '../../utils/dijkstra';
import GraphCanvas from './GraphCanvas';
import { Navigation, Truck, DollarSign } from 'lucide-react';

export default function DeliveryRoute() {
  const [source, setSource] = useState('central-warehouse');
  const [destination, setDestination] = useState('pharmacy-f');
  const [activeNode, setActiveNode] = useState(null);

  // Build graph adjacency list
  const adjList = useMemo(() => {
    return buildAdjacencyList(supplyGraph);
  }, []);

  // Compute shortest path using Dijkstra
  const routeResults = useMemo(() => {
    if (!source || !destination) return { path: [], cost: -1, reachable: false };
    return findShortestPath(adjList, source, destination);
  }, [adjList, source, destination]);

  // Translate node IDs to labels
  const getNodeLabel = (nodeId) => {
    return supplyGraph.nodes.find(n => n.id === nodeId)?.label || nodeId;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Low-Cost Delivery Route</h1>
        <p>Optimize medicine dispatch transit costs between warehouse, regional hubs, and local clinics.</p>
      </div>

      <div style={layoutGridStyle}>
        {/* Controls Panel */}
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="flex items-center gap-3">
            <Navigation size={20} color="var(--color-accent)" />
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: '600' }}>Route Optimizer</h3>
          </div>

          <div style={formGroupListStyle}>
            <div className="form-group">
              <label>Source Facility</label>
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                {supplyGraph.nodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Destination Clinic / Pharmacy</label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                {supplyGraph.nodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Block */}
          {routeResults.reachable ? (
            <div style={resultsCardStyle} className="animate-scale-in">
              <div style={costRowStyle}>
                <div style={costIconStyle}>
                  <DollarSign size={20} color="var(--color-success)" />
                </div>
                <div>
                  <span style={costLabelStyle}>Optimized Route Cost</span>
                  <h2 style={costValueStyle}>₹{routeResults.cost}</h2>
                </div>
              </div>

              {/* Step list */}
              <div style={{ marginTop: 'var(--space-4)' }}>
                <span style={stepListTitleStyle}>Transit Sequence</span>
                <div style={stepListStyle}>
                  {routeResults.path.map((nodeId, index) => {
                    const isLast = index === routeResults.path.length - 1;
                    return (
                      <div 
                        key={nodeId} 
                        style={stepItemStyle}
                        onMouseEnter={() => setActiveNode(nodeId)}
                        onMouseLeave={() => setActiveNode(null)}
                      >
                        <div style={bulletGroupStyle}>
                          <div style={{
                            ...bulletStyle,
                            backgroundColor: index === 0 ? 'var(--color-success)' : isLast ? 'var(--color-danger)' : 'var(--color-accent)',
                          }} />
                          {!isLast && <div style={bulletLineStyle} />}
                        </div>
                        <div style={stepNameStyle}>{getNodeLabel(nodeId)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div style={noPathStyle}>
              <Truck size={36} color="var(--color-text-muted)" />
              <p>No valid routing path found between selected facilities.</p>
            </div>
          )}
        </div>

        {/* Graph Canvas Panel */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <GraphCanvas 
            graph={supplyGraph} 
            path={routeResults.path} 
            activeNode={activeNode}
          />
        </div>
      </div>
    </div>
  );
}

const layoutGridStyle = {
  display: 'flex',
  gap: 'var(--space-6)',
  alignItems: 'start',
};

const formGroupListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
};

const resultsCardStyle = {
  backgroundColor: 'var(--color-bg-tertiary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-4)',
};

const costRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  borderBottom: '1px solid var(--color-border)',
  paddingBottom: 'var(--space-3)',
  marginBottom: 'var(--space-3)',
};

const costIconStyle = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--color-success-bg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const costLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
  textTransform: 'uppercase',
  fontWeight: '600',
  letterSpacing: '0.05em',
};

const costValueStyle = {
  fontSize: 'var(--font-size-xl)',
  color: 'var(--color-text-primary)',
  fontWeight: '700',
};

const stepListTitleStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
  textTransform: 'uppercase',
  fontWeight: '600',
  letterSpacing: '0.05em',
  display: 'block',
  marginBottom: 'var(--space-3)',
};

const stepListStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const stepItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: '6px 0',
  cursor: 'pointer',
  transition: 'padding-left var(--transition-fast)',
  '&:hover': {
    paddingLeft: '4px',
  }
};

const bulletGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  width: '12px',
};

const bulletStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  zIndex: 2,
};

const bulletLineStyle = {
  width: '2px',
  height: '24px',
  backgroundColor: 'var(--color-border)',
  position: 'absolute',
  top: '8px',
  zIndex: 1,
};

const stepNameStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  fontWeight: '500',
};

const noPathStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-8) 0',
  color: 'var(--color-text-muted)',
  textAlign: 'center',
};
