// Weighted graph for supply chain / delivery routing
// Nodes = facilities, Edges = routes with cost

export const supplyGraph = {
  nodes: [
    { id: 'central-warehouse', label: 'Central Warehouse', type: 'warehouse', x: 400, y: 60 },
    { id: 'hub-north', label: 'North Hub', type: 'hub', x: 200, y: 180 },
    { id: 'hub-south', label: 'South Hub', type: 'hub', x: 600, y: 180 },
    { id: 'hub-east', label: 'East Hub', type: 'hub', x: 700, y: 320 },
    { id: 'clinic-a', label: 'City Clinic A', type: 'clinic', x: 80, y: 340 },
    { id: 'clinic-b', label: 'General Hospital B', type: 'clinic', x: 280, y: 380 },
    { id: 'clinic-c', label: 'Pediatric Center C', type: 'clinic', x: 500, y: 420 },
    { id: 'clinic-d', label: 'Cardiology Unit D', type: 'clinic', x: 720, y: 460 },
    { id: 'clinic-e', label: 'Rural Clinic E', type: 'clinic', x: 140, y: 480 },
    { id: 'pharmacy-f', label: 'Community Pharmacy F', type: 'pharmacy', x: 420, y: 540 },
  ],
  edges: [
    { from: 'central-warehouse', to: 'hub-north', cost: 12 },
    { from: 'central-warehouse', to: 'hub-south', cost: 8 },
    { from: 'central-warehouse', to: 'hub-east', cost: 15 },
    { from: 'hub-north', to: 'clinic-a', cost: 7 },
    { from: 'hub-north', to: 'clinic-b', cost: 5 },
    { from: 'hub-north', to: 'clinic-e', cost: 10 },
    { from: 'hub-south', to: 'clinic-b', cost: 9 },
    { from: 'hub-south', to: 'clinic-c', cost: 4 },
    { from: 'hub-south', to: 'hub-east', cost: 6 },
    { from: 'hub-east', to: 'clinic-c', cost: 8 },
    { from: 'hub-east', to: 'clinic-d', cost: 3 },
    { from: 'clinic-b', to: 'clinic-e', cost: 6 },
    { from: 'clinic-c', to: 'pharmacy-f', cost: 5 },
    { from: 'clinic-c', to: 'clinic-d', cost: 11 },
    { from: 'clinic-e', to: 'pharmacy-f', cost: 14 },
    { from: 'clinic-a', to: 'clinic-e', cost: 4 },
    { from: 'clinic-d', to: 'pharmacy-f', cost: 7 },
  ]
};

// Build adjacency list from edges (undirected graph)
export function buildAdjacencyList(graph) {
  const adj = {};
  graph.nodes.forEach(n => { adj[n.id] = {}; });
  graph.edges.forEach(e => {
    adj[e.from][e.to] = e.cost;
    adj[e.to][e.from] = e.cost;
  });
  return adj;
}
