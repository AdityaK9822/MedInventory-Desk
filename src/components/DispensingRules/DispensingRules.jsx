import { useState, useMemo } from 'react';
import { useDispensingRules } from '../../context/DispensingRulesContext';
import { useInventory } from '../../context/InventoryContext';
import {
  ShieldAlert,
  Plus,
  Search,
  Trash2,
  Info,
  AlertTriangle
} from 'lucide-react';

export default function DispensingRules() {
  const { rules, addRule, updateRule, deleteRule } = useDispensingRules();
  const { drugs } = useInventory();

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [maxDailyDose, setMaxDailyDose] = useState('');
  const [maxSingleDose, setMaxSingleDose] = useState('');
  const [frequency, setFrequency] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [contraindications, setContraindications] = useState('');
  const [interactions, setInteractions] = useState('');
  const [notes, setNotes] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [requiresApproval, setRequiresApproval] = useState(false);

  // Search filter
  const [filterQuery, setFilterQuery] = useState('');

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!selectedDrugId) return;

    const drug = drugs.find(d => d.id === selectedDrugId);
    if (!drug) return;

    const rule = {
      drugId: selectedDrugId,
      maxDailyDose,
      maxSingleDose,
      frequency,
      ageRestriction,
      requiresApproval,
      contraindications: contraindications.split(',').map(s => s.trim()).filter(Boolean),
      interactions: interactions.split(',').map(s => s.trim()).filter(Boolean),
      notes,
      severity,
    };

    addRule(rule);
    
    // Clear states
    setSelectedDrugId('');
    setMaxDailyDose('');
    setMaxSingleDose('');
    setFrequency('');
    setAgeRestriction('');
    setContraindications('');
    setInteractions('');
    setNotes('');
    setSeverity('medium');
    setRequiresApproval(false);
    setShowForm(false);
  };

  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      const drug = drugs.find(d => d.id === r.drugId);
      const name = drug ? drug.name.toLowerCase() : '';
      return name.includes(filterQuery.toLowerCase()) ||
             r.notes.toLowerCase().includes(filterQuery.toLowerCase());
    });
  }, [rules, drugs, filterQuery]);

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Dispensing Rules Hub</h1>
          <p>Enforce clinical safety parameters, contraindications, and dose-ceiling protocols.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          <span>Add Clinical Rule</span>
        </button>
      </div>

      {/* Search Bar */}
      <div style={searchContainerStyle}>
        <Search size={18} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: '12px' }} />
        <input 
          type="text" 
          placeholder="Filter rules by medicine name or instructions..." 
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          style={{ paddingLeft: '38px', height: '40px' }}
        />
      </div>

      <div style={layoutGridStyle}>
        {/* Rules List Grid */}
        <div style={rulesGridStyle}>
          {filteredRules.length === 0 ? (
            <div className="glass-card empty-state" style={{ gridColumn: 'span 2' }}>
              <ShieldAlert size={48} />
              <h2>No Rules Registered</h2>
              <p>Search yielded no matching rules. Create a new clinical rule above.</p>
            </div>
          ) : (
            filteredRules.map((rule) => {
              const accentColor = rule.severity === 'high' ? 'var(--color-danger)' : rule.severity === 'medium' ? 'var(--color-warning)' : 'var(--color-info)';
              
              return (
                <div key={rule.id} className="glass-card" style={{ ...ruleCardStyle, borderLeft: `4px solid ${accentColor}` }}>
                  <div style={cardHeaderStyle}>
                    <div>
                      <h3 style={cardTitleStyle}>{drugs.find(d => d.id === rule.drugId)?.name || 'Unknown Drug'}</h3>
                      <span className="badge badge-accent" style={{ fontSize: '9px', marginTop: '4px' }}>
                        Approval Required: {rule.requiresApproval ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <button 
                      className="btn btn-ghost btn-danger btn-sm"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={cardInfoListStyle}>
                    <div style={cardItemStyle}>
                      <span style={cardLabelStyle}>Max Daily Dose:</span>
                      <span style={cardValueStyle}>{rule.maxDailyDose || 'None Specified'}</span>
                    </div>
                    <div style={cardItemStyle}>
                      <span style={cardLabelStyle}>Single Dose Cap:</span>
                      <span style={cardValueStyle}>{rule.maxSingleDose || 'None Specified'}</span>
                    </div>
                    <div style={cardItemStyle}>
                      <span style={cardLabelStyle}>Age Limits:</span>
                      <span style={cardValueStyle}>{rule.ageRestriction || 'None'}</span>
                    </div>
                  </div>

                  {rule.interactions && rule.interactions.length > 0 && (
                    <div style={alertBlockStyle}>
                      <AlertTriangle size={12} color="var(--color-warning-light)" />
                      <div style={{ fontSize: 'var(--font-size-xs)' }}>
                        <strong>Interactions:</strong> {rule.interactions.join(', ')}
                      </div>
                    </div>
                  )}

                  {rule.notes && (
                    <div style={notesBlockStyle}>
                      <Info size={12} color="var(--color-info-light)" />
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        {rule.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal-style Sidebar Form */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content animate-scale-in" style={{ maxWidth: '600px' }}>
              <h2>Add Clinical Rule</h2>
              <form onSubmit={handleAddRule}>
                <div className="form-group">
                  <label>Select Medicine</label>
                  <select 
                    value={selectedDrugId} 
                    onChange={(e) => setSelectedDrugId(e.target.value)}
                    required
                  >
                    <option value="">Choose medicine...</option>
                    {drugs.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Max Daily Dose</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2000mg" 
                      value={maxDailyDose}
                      onChange={(e) => setMaxDailyDose(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Single Dose</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 500mg" 
                      value={maxSingleDose}
                      onChange={(e) => setMaxSingleDose(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Frequency</label>
                    <input 
                      type="text" 
                      placeholder="e.g. BID, QID" 
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Age Restriction</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 12+ years" 
                      value={ageRestriction}
                      onChange={(e) => setAgeRestriction(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Drug Interactions (Comma Separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Warfarin, Lithium, Aspirin" 
                    value={interactions}
                    onChange={(e) => setInteractions(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Contraindications (Comma Separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Penicillin allergy, Renal failure" 
                    value={contraindications}
                    onChange={(e) => setContraindications(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Severity Category</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                    <option value="low">Low Alert (General note)</option>
                    <option value="medium">Medium Alert (Precautionary)</option>
                    <option value="high">High Alert (Severe Interactivity/Dose cap)</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'var(--space-4)' }}>
                  <input 
                    type="checkbox" 
                    checked={requiresApproval}
                    onChange={(e) => setRequiresApproval(e.target.checked)}
                    id="req-approval"
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  <label htmlFor="req-approval" style={{ margin: 0, cursor: 'pointer' }}>Requires Supervisor Sign-off</label>
                </div>

                <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                  <label>Instructions & Safety Notes</label>
                  <textarea 
                    placeholder="Provide additional clinical guidelines..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Discard
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const searchContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  marginBottom: 'var(--space-6)',
};

const layoutGridStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const rulesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 'var(--space-6)',
};

const ruleCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
  position: 'relative',
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const cardTitleStyle = {
  fontSize: 'var(--font-size-md)',
  fontWeight: '700',
  color: 'var(--color-text-primary)',
};

const cardInfoListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  backgroundColor: 'var(--color-bg-tertiary)',
  padding: 'var(--space-3) var(--space-4)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
};

const cardItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 'var(--font-size-xs)',
};

const cardLabelStyle = {
  color: 'var(--color-text-tertiary)',
  fontWeight: '600',
};

const cardValueStyle = {
  color: 'var(--color-text-primary)',
  fontWeight: '600',
};

const alertBlockStyle = {
  backgroundColor: 'var(--color-warning-bg)',
  border: '1px solid rgba(245, 158, 11, 0.2)',
  padding: 'var(--space-2) var(--space-3)',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  color: 'var(--color-warning-light)',
};

const notesBlockStyle = {
  backgroundColor: 'var(--color-info-bg)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  padding: 'var(--space-3)',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  gap: 'var(--space-2)',
  alignItems: 'flex-start',
};
