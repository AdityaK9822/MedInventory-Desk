import { useState } from 'react';
import { useBarcodeSearch } from '../../hooks/useBarcodeSearch';
import { useInventory } from '../../context/InventoryContext';
import {
  ScanBarcode,
  Search,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  History,
  Trash2
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function BarcodeChecker() {
  const { drugs } = useInventory();
  const { 
    query, 
    setQuery, 
    search, 
    partialSearch, 
    searchHistory, 
    clearHistory 
  } = useBarcodeSearch(drugs);

  const [inputVal, setInputVal] = useState('');
  const [activeMatch, setActiveMatch] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (val) => {
    setInputVal(val);
    if (val.trim()) {
      const matches = partialSearch(val);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const executeLookup = (barcode) => {
    setInputVal(barcode);
    setSuggestions([]);
    const match = search(barcode);
    setActiveMatch(match);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeLookup(inputVal);
  };

  const selectSuggestion = (item) => {
    executeLookup(item.barcode);
  };

  const demoBarcodes = [
    { barcode: 'MED-AMX-500-001', label: 'Amoxicillin B1' },
    { barcode: 'MED-PAR-500-001', label: 'Paracetamol B1' },
    { barcode: 'MED-INS-100-001', label: 'Insulin Glargine B1' },
    { barcode: 'MED-INVALID-999', label: 'Invalid Serial' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Barcode Checker</h1>
        <p>Perform O(1) hash map searches to instantly verify barcodes and batches.</p>
      </div>

      <div style={layoutGridStyle}>
        {/* Main Search Panel */}
        <div className="glass-card" style={{ flex: 2 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-6)' }}>
            <ScanBarcode size={20} color="var(--color-accent)" />
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: '600' }}>Scanner Simulation</h3>
          </div>

          <form onSubmit={handleFormSubmit} style={formStyle}>
            <div style={searchWrapperStyle}>
              <Search size={18} color="var(--color-text-tertiary)" style={searchIconStyle} />
              <input 
                type="text" 
                value={inputVal}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Scan or type medicine barcode / serial number..."
                style={barcodeInputStyle}
                autoFocus
              />
              <button type="submit" className="btn btn-primary" style={searchButtonStyle}>
                Verify
              </button>

              {suggestions.length > 0 && (
                <div style={suggestionsDropdownStyle}>
                  {suggestions.map((item, index) => (
                    <div 
                      key={index} 
                      onClick={() => selectSuggestion(item)}
                      style={suggestionItemStyle}
                    >
                      <ScanBarcode size={14} color="var(--color-text-tertiary)" />
                      <div>
                        <span style={suggNameStyle}>{item.drugName}</span>
                        <span style={suggBarcodeStyle}>{item.barcode} ({item.batchId})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Quick Demo Buttons */}
          <div style={demoBarcodesContainerStyle}>
            <span style={demoLabelStyle}>Scan Mock Barcode:</span>
            <div style={demoButtonsStyle}>
              {demoBarcodes.map((item, index) => (
                <button 
                  key={index} 
                  className="btn btn-secondary btn-sm"
                  onClick={() => executeLookup(item.barcode)}
                  style={{ fontFamily: 'monospace' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {activeMatch ? (
            <div style={matchCardStyle} className="animate-scale-in">
              <div style={matchHeaderStyle}>
                <div style={successIconStyle}>
                  <CheckCircle size={24} color="var(--color-success)" />
                </div>
                <div>
                  <h3 style={matchTitleStyle}>Barcode Verified</h3>
                  <p style={matchSubtitleStyle}>System records match verified successfully.</p>
                </div>
              </div>

              <div style={matchInfoGridStyle}>
                <div style={matchInfoFieldStyle}>
                  <span style={fieldLabelStyle}>Medication Name</span>
                  <span style={fieldValueStyle}>{activeMatch.drugName}</span>
                </div>
                <div style={matchInfoFieldStyle}>
                  <span style={fieldLabelStyle}>Generic Name</span>
                  <span style={fieldValueStyle}>{activeMatch.genericName}</span>
                </div>
                <div style={matchInfoFieldStyle}>
                  <span style={fieldLabelStyle}>Batch ID</span>
                  <span style={fieldValueStyle}>{activeMatch.batchId}</span>
                </div>
                <div style={matchInfoFieldStyle}>
                  <span style={fieldLabelStyle}>Barcode Serial</span>
                  <span style={fieldValueStyle}>{activeMatch.barcode}</span>
                </div>
                <div style={matchInfoFieldStyle}>
                  <span style={fieldLabelStyle}>Manufacturer</span>
                  <span style={fieldValueStyle}>{activeMatch.manufacturer}</span>
                </div>
                <div style={matchInfoFieldStyle}>
                  <span style={fieldLabelStyle}>Category</span>
                  <span style={fieldValueStyle}>{activeMatch.category}</span>
                </div>
              </div>

              <div style={badgeRowStyle}>
                <div style={metaBadgeStyle}>
                  <MapPin size={14} />
                  <span>Location: {activeMatch.location}</span>
                </div>
                <div style={metaBadgeStyle}>
                  <Calendar size={14} />
                  <span>Expiry: {formatDate(activeMatch.expiry)}</span>
                </div>
                <div style={metaBadgeStyle}>
                  <span>In-stock: {activeMatch.quantity} units</span>
                </div>
              </div>
            </div>
          ) : query ? (
            <div style={noMatchCardStyle} className="animate-scale-in">
              <AlertTriangle size={24} color="var(--color-danger)" />
              <div>
                <h3 style={noMatchTitleStyle}>Unregistered Barcode</h3>
                <p style={noMatchSubtitleStyle}>No matching drug or batch record found for: <strong style={{ fontFamily: 'monospace' }}>{query}</strong></p>
              </div>
            </div>
          ) : (
            <div style={searchPromptStyle}>
              <ScanBarcode size={48} color="var(--color-text-muted)" />
              <p>Type or click one of the mock barcodes above to simulate scan verification.</p>
            </div>
          )}
        </div>

        {/* History Panel */}
        <div className="glass-card" style={{ flex: 1 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="flex items-center gap-3">
              <History size={20} color="var(--color-accent)" />
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: '600' }}>Recent Scans</h3>
            </div>
            {searchHistory.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearHistory}>
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {searchHistory.length === 0 ? (
            <div style={emptyHistoryStyle}>No recent scans.</div>
          ) : (
            <div style={historyListStyle}>
              {searchHistory.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => executeLookup(item.barcode)}
                  style={{
                    ...historyItemStyle,
                    borderLeft: `3px solid ${item.found ? 'var(--color-success)' : 'var(--color-danger)'}`,
                  }}
                >
                  <div style={historyItemMainStyle}>
                    <div style={historyBarcodeStyle}>{item.barcode}</div>
                    <div style={historyNameStyle}>{item.drugName || 'Unknown Serial'}</div>
                  </div>
                  <span className={`badge ${item.found ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '9px' }}>
                    {item.found ? 'Verified' : 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          )}
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

const formStyle = {
  marginBottom: 'var(--space-4)',
};

const searchWrapperStyle = {
  position: 'relative',
  display: 'flex',
  gap: 'var(--space-3)',
};

const searchIconStyle = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

const barcodeInputStyle = {
  paddingLeft: '40px',
  paddingRight: '120px',
  height: '46px',
  fontSize: 'var(--font-size-base)',
};

const searchButtonStyle = {
  height: '46px',
  padding: '0 var(--space-6)',
};

const suggestionsDropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: '120px',
  backgroundColor: 'var(--color-bg-secondary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-lg)',
  zIndex: 100,
  maxHeight: '200px',
  overflowY: 'auto',
  marginTop: '4px',
};

const suggestionItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: '10px 14px',
  cursor: 'pointer',
  transition: 'background var(--transition-fast)',
  borderBottom: '1px solid var(--color-border)',
  '&:hover': {
    backgroundColor: 'var(--color-bg-tertiary)',
  }
};

const suggNameStyle = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: '600',
  color: 'var(--color-text-primary)',
  display: 'block',
};

const suggBarcodeStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
  display: 'block',
};

const demoBarcodesContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2)',
  marginBottom: 'var(--space-8)',
};

const demoLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const demoButtonsStyle = {
  display: 'flex',
  gap: 'var(--space-2)',
  flexWrap: 'wrap',
};

const matchCardStyle = {
  backgroundColor: 'var(--color-bg-tertiary)',
  border: '1px solid var(--color-border-accent)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-6)',
  boxShadow: 'var(--shadow-glow)',
};

const matchHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
  borderBottom: '1px solid var(--color-border)',
  paddingBottom: 'var(--space-4)',
  marginBottom: 'var(--space-6)',
};

const successIconStyle = {
  width: '44px',
  height: '44px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--color-success-bg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const matchTitleStyle = {
  fontSize: 'var(--font-size-md)',
  fontWeight: '700',
  color: 'var(--color-text-primary)',
};

const matchSubtitleStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
};

const matchInfoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 'var(--space-4)',
  marginBottom: 'var(--space-6)',
};

const matchInfoFieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const fieldLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
  fontWeight: '600',
};

const fieldValueStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-primary)',
  fontWeight: '500',
};

const badgeRowStyle = {
  display: 'flex',
  gap: 'var(--space-3)',
};

const metaBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  backgroundColor: 'var(--color-bg-secondary)',
  padding: '6px 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
};

const noMatchCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
  backgroundColor: 'var(--color-danger-bg)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-6)',
};

const noMatchTitleStyle = {
  fontSize: 'var(--font-size-md)',
  fontWeight: '700',
  color: 'var(--color-danger-light)',
};

const noMatchSubtitleStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
};

const searchPromptStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--space-12) 0',
  color: 'var(--color-text-muted)',
  textAlign: 'center',
  gap: 'var(--space-3)',
};

const emptyHistoryStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-muted)',
  textAlign: 'center',
  padding: 'var(--space-8) 0',
};

const historyListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2)',
};

const historyItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-3)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-bg-tertiary)',
  border: '1px solid var(--color-border)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  '&:hover': {
    borderColor: 'var(--color-border-hover)',
    transform: 'translateX(2px)',
  }
};

const historyItemMainStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const historyBarcodeStyle = {
  fontSize: 'var(--font-size-xs)',
  fontFamily: 'monospace',
  fontWeight: '600',
  color: 'var(--color-text-secondary)',
};

const historyNameStyle = {
  fontSize: '11px',
  color: 'var(--color-text-tertiary)',
};
