import { useState } from 'react';
import { useBinPacking } from '../../hooks/useBinPacking';
import ShelfVisual from './ShelfVisual';
import {
  Layers,
  Package,
  BarChart,
  TrendingUp,
  Inbox
} from 'lucide-react';

const initialShelves = [
  { id: 'shelf-1', name: 'Cold Zone A (Biologics)', capacity: 80, used: 0, items: [] },
  { id: 'shelf-2', name: 'Fast-Moving B (Antibiotics)', capacity: 120, used: 0, items: [] },
  { id: 'shelf-3', name: 'Standard C (Cardio/Gastric)', capacity: 150, used: 0, items: [] },
  { id: 'shelf-4', name: 'Bulk Storage D', capacity: 200, used: 0, items: [] },
];

const initialBoxes = [
  { id: 'box-1', name: 'Amoxicillin Pallet', size: 40 },
  { id: 'box-2', name: 'Insulin Cold Pack', size: 25 },
  { id: 'box-3', name: 'Paracetamol Crate', size: 60 },
  { id: 'box-4', name: 'Ibuprofen Boxes', size: 15 },
  { id: 'box-5', name: 'Losartan Cartons', size: 30 },
  { id: 'box-6', name: 'Metformin Shippers', size: 50 },
  { id: 'box-7', name: 'Ondansetron Vial Box', size: 10 },
  { id: 'box-8', name: 'Salbutamol Inhaler Packs', size: 20 },
];

export default function ShelfManager() {
  const {
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
  } = useBinPacking(initialShelves, initialBoxes);

  // Form states
  const [shelfName, setShelfName] = useState('');
  const [shelfCap, setShelfCap] = useState('');
  const [boxName, setBoxName] = useState('');
  const [boxSize, setBoxSize] = useState('');

  // Dropdown manual assignment mapping
  const [selectedBoxId, setSelectedBoxId] = useState('');
  const [selectedShelfId, setSelectedShelfId] = useState('');

  const handleCreateShelf = (e) => {
    e.preventDefault();
    const cap = parseInt(shelfCap, 10);
    if (!shelfName || isNaN(cap) || cap <= 0) return;
    addShelf(shelfName, cap);
    setShelfName('');
    setShelfCap('');
  };

  const handleCreateBox = (e) => {
    e.preventDefault();
    const size = parseInt(boxSize, 10);
    if (!boxName || isNaN(size) || size <= 0) return;
    addBox(boxName, size);
    setBoxName('');
    setBoxSize('');
  };

  const handleManualPlace = (e) => {
    e.preventDefault();
    if (!selectedBoxId || !selectedShelfId) return;
    
    const box = unplacedBoxes.find(b => b.id === selectedBoxId);
    const shelf = shelves.find(s => s.id === selectedShelfId);
    
    if (shelf.used + box.size > shelf.capacity) {
      alert(`Error: Cannot place box ${box.name} (${box.size} kg). Setting it here exceeds shelf capacity of ${shelf.capacity} kg.`);
      return;
    }

    placeBox(selectedBoxId, selectedShelfId);
    setSelectedBoxId('');
    setSelectedShelfId('');
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Shelf Load Manager</h1>
          <p>Optimize cargo box distributions on warehouse shelves to prevent space overload via bin packing.</p>
        </div>
        <button className="btn btn-primary" onClick={autoPlace} disabled={unplacedBoxes.length === 0}>
          <Layers size={16} />
          <span>Auto Pack FFD</span>
        </button>
      </div>

      {/* Utilization and space metrics */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="glass-card stat-card" style={{ '--stat-color': 'var(--color-accent)' }}>
          <div className="stat-icon"><BarChart size={20} /></div>
          <div className="stat-value">{utilization.toFixed(1)}%</div>
          <div className="stat-label">Space Utilization</div>
        </div>

        <div className="glass-card stat-card" style={{ '--stat-color': 'var(--color-success)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-success-bg)' }}>
            <TrendingUp size={20} color="var(--color-success)" />
          </div>
          <div className="stat-value">{totalUsed} kg</div>
          <div className="stat-label">Total Loaded Weight</div>
        </div>

        <div className="glass-card stat-card" style={{ '--stat-color': 'var(--color-info)' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-info-bg)' }}>
            <Layers size={20} color="var(--color-info)" />
          </div>
          <div className="stat-value">{unplacedBoxes.length}</div>
          <div className="stat-label">Unplaced Boxes</div>
        </div>
      </div>

      <div style={layoutGridStyle}>
        {/* Left Side: Visual Shelves */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: '600' }}>Active Warehouse Bays</h3>
          <div style={shelvesGridStyle}>
            {shelves.map((s) => (
              <ShelfVisual 
                key={s.id} 
                shelf={s} 
                onRemoveBox={removeBox} 
                onRemoveShelf={removeShelf}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Box Queue and Forms */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Unplaced Box Queue */}
          <div className="glass-card">
            <h3 style={sectionTitleStyle}>Unplaced Box Queue</h3>
            
            {unplacedBoxes.length === 0 ? (
              <div style={emptyQueueStyle}>
                <Inbox size={32} color="var(--color-text-muted)" />
                <p style={{ fontSize: 'var(--font-size-xs)' }}>All boxes safely packed.</p>
              </div>
            ) : (
              <div style={queueBoxListStyle}>
                {unplacedBoxes.map((box) => (
                  <div key={box.id} style={queueBoxItemStyle}>
                    <div className="flex items-center gap-2">
                      <Package size={14} color="var(--color-warning-light)" />
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600' }}>{box.name}</span>
                    </div>
                    <span className="badge badge-accent">{box.size} kg</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Placement Override Form */}
          {unplacedBoxes.length > 0 && (
            <div className="glass-card">
              <h3 style={sectionTitleStyle}>Manual Override Placement</h3>
              <form onSubmit={handleManualPlace} style={manualFormStyle}>
                <div className="form-group">
                  <select 
                    value={selectedBoxId} 
                    onChange={(e) => setSelectedBoxId(e.target.value)}
                    required
                  >
                    <option value="">Choose Box...</option>
                    {unplacedBoxes.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.size} kg)</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <select 
                    value={selectedShelfId} 
                    onChange={(e) => setSelectedShelfId(e.target.value)}
                    required
                  >
                    <option value="">Choose Shelf Bay...</option>
                    {shelves.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (Available: {s.capacity - s.used} kg)</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  Place Box Manually
                </button>
              </form>
            </div>
          )}

          {/* Configuration Form */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={sectionTitleStyle}>Warehouse Setup</h3>
            
            <form onSubmit={handleCreateShelf} style={addFormStyle}>
              <h4 style={formTitleStyle}>Register New Shelf Bay</h4>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Shelf label (e.g. Zone X)" 
                  value={shelfName}
                  onChange={(e) => setShelfName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="number" 
                  placeholder="Capacity limit (kg)" 
                  value={shelfCap}
                  onChange={(e) => setShelfCap(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Add Shelf
              </button>
            </form>

            <form onSubmit={handleCreateBox} style={addFormStyle}>
              <h4 style={formTitleStyle}>Receive New Cargo Box</h4>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Cargo label (e.g. Vitamin Crate)" 
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="number" 
                  placeholder="Box weight (kg)" 
                  value={boxSize}
                  onChange={(e) => setBoxSize(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Receive Box
              </button>
            </form>
          </div>
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

const shelvesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 'var(--space-4)',
};

const sectionTitleStyle = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: '600',
  marginBottom: 'var(--space-4)',
};

const emptyQueueStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-6) 0',
  color: 'var(--color-text-muted)',
};

const queueBoxListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  maxHeight: '200px',
  overflowY: 'auto',
};

const queueBoxItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 10px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-bg-tertiary)',
  border: '1px solid var(--color-border)',
};

const manualFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2)',
};

const addFormStyle = {
  backgroundColor: 'var(--color-bg-tertiary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-3)',
};

const formTitleStyle = {
  fontSize: '11px',
  textTransform: 'uppercase',
  color: 'var(--color-text-tertiary)',
  fontWeight: '600',
  letterSpacing: '0.05em',
  marginBottom: 'var(--space-2)',
};
