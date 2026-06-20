// Dijkstra's shortest path algorithm
// Returns { distances, previous } for path reconstruction

class MinHeap {
  constructor() {
    this.heap = [];
  }
  push(val) {
    this.heap.push(val);
    this.bubbleUp();
  }
  pop() {
    if (this.size() === 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown();
    return top;
  }
  size() {
    return this.heap.length;
  }
  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].cost <= this.heap[index].cost) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }
  bubbleDown() {
    let index = 0;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let swap = null;
      if (left < this.heap.length) {
        if (this.heap[left].cost < this.heap[index].cost) swap = left;
      }
      if (right < this.heap.length) {
        if (
          (swap === null && this.heap[right].cost < this.heap[index].cost) ||
          (swap !== null && this.heap[right].cost < this.heap[left].cost)
        ) swap = right;
      }
      if (swap === null) break;
      [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
      index = swap;
    }
  }
}

export function dijkstra(adjacencyList, startNode) {
  const distances = {};
  const previous = {};
  const visited = new Set();

  const pq = new MinHeap();

  // Initialize
  Object.keys(adjacencyList).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[startNode] = 0;
  pq.push({ node: startNode, cost: 0 });

  while (pq.size() > 0) {
    const { node: current } = pq.pop();

    if (visited.has(current)) continue;
    visited.add(current);

    // Relax neighbors
    const neighbors = adjacencyList[current] || {};
    for (const neighbor in neighbors) {
      if (visited.has(neighbor)) continue;

      const edgeCost = neighbors[neighbor];
      const newDist = distances[current] + edgeCost;

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = current;
        pq.push({ node: neighbor, cost: newDist });
      }
    }
  }

  return { distances, previous };
}

// Reconstruct path from start to end
export function reconstructPath(previous, endNode) {
  const path = [];
  let current = endNode;

  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  // If path has only the end node and it doesn't match start, no path exists
  return path;
}

// Get shortest path and cost between two nodes
export function findShortestPath(adjacencyList, startNode, endNode) {
  const { distances, previous } = dijkstra(adjacencyList, startNode);
  const path = reconstructPath(previous, endNode);
  const cost = distances[endNode];

  return {
    path,
    cost: cost === Infinity ? -1 : cost,
    reachable: cost !== Infinity,
  };
}
