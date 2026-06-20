import { useState, useCallback, useMemo } from 'react';
import { generateId } from '../utils/helpers';


export function useBinPacking(initialShelves = [], initialBoxes = []) {
  const [shelves, setShelves] = useState(initialShelves);
  const [unplacedBoxes, setUnplacedBoxes] = useState(initialBoxes);


  const addShelf = useCallback((name, capacity) => {
    const shelf = {
      id: generateId('shelf'),
      name,
      capacity,
      items: [],
    };
    setShelves(prev => [...prev, shelf]);
    return shelf;
  }, []);


  const removeShelf = useCallback((shelfId) => {
    let removedItems = [];
    setShelves(prev => {
      const shelf = prev.find(s => s.id === shelfId);
      if (shelf) {
        removedItems = shelf.items;
      }
      return prev.filter(s => s.id !== shelfId);
    });
    if (removedItems.length > 0) {
      setUnplacedBoxes(u => [...u, ...removedItems]);
    }
  }, []);


  const addBox = useCallback((name, size) => {
    const box = {
      id: generateId('box'),
      name,
      size,
    };
    setUnplacedBoxes(prev => [...prev, box]);
    return box;
  }, []);


  const autoPlace = useCallback(() => {
    let remainingBoxes = [];
    setShelves(prev => {

      let allBoxes = [];
      const clearedShelves = prev.map(s => {
        allBoxes = [...allBoxes, ...s.items];
        return { ...s, items: [] };
      });

      allBoxes = [...allBoxes, ...unplacedBoxes];


      allBoxes.sort((a, b) => b.size - a.size);


      allBoxes.forEach(box => {
        
        let placed = false;
        for (let i = 0; i < clearedShelves.length; i++) {
          const currentUsed = clearedShelves[i].items.reduce((sum, b) => sum + b.size, 0);
          if (currentUsed + box.size <= clearedShelves[i].capacity) {
            clearedShelves[i].items.push(box);
            placed = true;
            break;
          }
        }
        if (!placed) {
          remainingBoxes.push(box);
        }
      });

      return clearedShelves;
    });
    setUnplacedBoxes(remainingBoxes);
  }, [unplacedBoxes]);


  const placeBox = useCallback((boxId, shelfId) => {
    let boxToPlace = null;
    setUnplacedBoxes(prev => {
      const box = prev.find(b => b.id === boxId);
      if (!box) return prev;
      boxToPlace = box;
      return prev.filter(b => b.id !== boxId);
    });

    if (boxToPlace) {
      setShelves(s => s.map(shelf => {
        const currentUsed = shelf.items.reduce((sum, b) => sum + b.size, 0);
        if (shelf.id === shelfId && currentUsed + boxToPlace.size <= shelf.capacity) {
          return {
            ...shelf,
            items: [...shelf.items, boxToPlace],
          };
        }
        return shelf;
      }));
    }
  }, []);


  const removeBox = useCallback((boxId, shelfId) => {
    let boxToRemove = null;
    setShelves(prev => prev.map(shelf => {
      if (shelf.id !== shelfId) return shelf;
      const box = shelf.items.find(b => b.id === boxId);
      if (!box) return shelf;
      boxToRemove = box;
      return {
        ...shelf,
        items: shelf.items.filter(b => b.id !== boxId),
      };
    }));
    if (boxToRemove) {
      setUnplacedBoxes(u => [...u, boxToRemove]);
    }
  }, []);


  const { totalCapacity, totalUsed, utilization } = useMemo(() => {
    const cap = shelves.reduce((sum, s) => sum + s.capacity, 0);
    const used = shelves.reduce((sum, s) => sum + s.items.reduce((sumI, b) => sumI + b.size, 0), 0);
    return {
      totalCapacity: cap,
      totalUsed: used,
      utilization: cap > 0 ? (used / cap * 100) : 0,
    };
  }, [shelves]);

  return {
    shelves,
    unplacedBoxes,
    addShelf,
    removeShelf,
    addBox,
    autoPlace,
    placeBox,
    removeBox,
    totalCapacity,
    totalUsed,
    utilization,
  };
}
