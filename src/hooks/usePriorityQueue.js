import { useState, useCallback } from 'react';

// Binary Min-Heap based priority queue
// Lower priority number = higher urgency = dequeued first
export function usePriorityQueue(initialItems = []) {
  const [heap, setHeap] = useState(() => {
    const h = [...initialItems];
    // Build heap from initial items
    for (let i = Math.floor(h.length / 2) - 1; i >= 0; i--) {
      siftDown(h, i);
    }
    return h;
  });

  const enqueue = useCallback((item) => {
    setHeap(prev => {
      const newHeap = [...prev, item];
      siftUp(newHeap, newHeap.length - 1);
      return newHeap;
    });
  }, []);

  const dequeue = useCallback(() => {
    let removed = null;
    setHeap(prev => {
      if (prev.length === 0) return prev;
      const newHeap = [...prev];
      removed = newHeap[0];
      newHeap[0] = newHeap[newHeap.length - 1];
      newHeap.pop();
      if (newHeap.length > 0) siftDown(newHeap, 0);
      return newHeap;
    });
    return removed;
  }, []);

  const peek = useCallback(() => {
    return heap.length > 0 ? heap[0] : null;
  }, [heap]);

  const removeById = useCallback((id) => {
    setHeap(prev => {
      const idx = prev.findIndex(item => item.id === id);
      if (idx === -1) return prev;
      const newHeap = [...prev];
      newHeap[idx] = newHeap[newHeap.length - 1];
      newHeap.pop();
      if (newHeap.length > 0 && idx < newHeap.length) {
        siftDown(newHeap, idx);
        siftUp(newHeap, idx);
      }
      return newHeap;
    });
  }, []);

  return {
    queue: heap,
    enqueue,
    dequeue,
    peek,
    removeById,
    size: heap.length,
    isEmpty: heap.length === 0,
  };
}

// Heap helpers — compare by priority, then by timestamp
function compare(a, b) {
  if (a.priority !== b.priority) return a.priority - b.priority;
  return new Date(a.timestamp) - new Date(b.timestamp);
}

function siftUp(heap, idx) {
  while (idx > 0) {
    const parent = Math.floor((idx - 1) / 2);
    if (compare(heap[idx], heap[parent]) < 0) {
      [heap[idx], heap[parent]] = [heap[parent], heap[idx]];
      idx = parent;
    } else {
      break;
    }
  }
}

function siftDown(heap, idx) {
  const n = heap.length;
  while (true) {
    let smallest = idx;
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;

    if (left < n && compare(heap[left], heap[smallest]) < 0) smallest = left;
    if (right < n && compare(heap[right], heap[smallest]) < 0) smallest = right;

    if (smallest !== idx) {
      [heap[idx], heap[smallest]] = [heap[smallest], heap[idx]];
      idx = smallest;
    } else {
      break;
    }
  }
}
