import { createContext, useContext, useReducer, useEffect } from 'react';
import { drugCatalog, flattenDrugs } from '../data/mockDrugs';
import { deepClone } from '../utils/helpers';

const InventoryContext = createContext(null);

const STORAGE_KEY = 'medinventory_catalog';

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return null;
}

function saveToStorage(catalog) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// Recursively find and update a drug node in the tree
function updateDrugInTree(node, drugId, updater) {
  if (node.id === drugId && node.type === 'drug') {
    return updater(node);
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map(child => updateDrugInTree(child, drugId, updater)),
    };
  }
  return node;
}

function inventoryReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_STOCK': {
      const { drugId, batchId, newQuantity } = action.payload;
      const newCatalog = updateDrugInTree(deepClone(state.catalog), drugId, (drug) => {
        const batch = drug.batches.find(b => b.batchId === batchId);
        if (batch) {
          batch.quantity = newQuantity;
        }
        return drug;
      });
      return { ...state, catalog: newCatalog };
    }

    case 'UPDATE_DRUG_STOCK': {
      const { drugId, newTotalStock } = action.payload;
      const newCatalog = updateDrugInTree(deepClone(state.catalog), drugId, (drug) => {
        drug.totalStock = newTotalStock;
        return drug;
      });
      return { ...state, catalog: newCatalog };
    }

    case 'RESET_CATALOG': {
      return { ...state, catalog: deepClone(drugCatalog) };
    }

    default:
      return state;
  }
}

export function InventoryProvider({ children }) {
  const initialCatalog = loadFromStorage() || deepClone(drugCatalog);
  const [state, dispatch] = useReducer(inventoryReducer, { catalog: initialCatalog });

  // Persist on changes
  useEffect(() => {
    saveToStorage(state.catalog);
  }, [state.catalog]);

  // Derive flat drug list
  const drugs = flattenDrugs(state.catalog);

  return (
    <InventoryContext.Provider value={{ catalog: state.catalog, drugs, dispatch }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}
