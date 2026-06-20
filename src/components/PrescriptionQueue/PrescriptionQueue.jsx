import { useState } from 'react';
import { usePriorityQueue } from '../../hooks/usePriorityQueue';
import { initialPrescriptions, priorityLabels, priorityColors } from '../../data/mockPrescriptions';
import { useInventory } from '../../context/InventoryContext';
import { useDispensingRules } from '../../context/DispensingRulesContext';
import {
  ListOrdered,
  Plus,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { formatDateTime, generateId } from '../../utils/helpers';

export default function PrescriptionQueue() {
  const { drugs } = useInventory();
  const { getRuleForDrug } = useDispensingRules();
  const { queue, enqueue, dequeue, removeById, size } = usePriorityQueue(initialPrescriptions);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [dosage, setDosage] = useState('');
  const [priority, setPriority] = useState('3'); // Default medium
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Dispensing warning trigger
  const [activeWarning, setActiveWarning] = useState(null);

  const handleDrugChange = (drugId) => {
    setSelectedDrugId(drugId);
    // Auto-check dispensing rules for this drug
    const rule = getRuleForDrug(drugId);
    if (rule) {
      const drug = drugs.find(d => d.id === drugId);
      setActiveWarning({
        drugName: drug?.name || 'Unknown Medication',
        maxDailyDose: rule.maxDailyDose,
        contraindications: rule.contraindications,
        notes: rule.notes,
        severity: rule.severity,
      });
    } else {
      setActiveWarning(null);
    }
  };

  const handleAddPrescription = (e) => {
    e.preventDefault();
    if (!patientName || !selectedDrugId) return;

    const drug = drugs.find(d => d.id === selectedDrugId);
    if (!drug) return;

    const newRx = {
      id: generateId('rx'),
      patientName,
      patientId: patientId || generateId('P'),
      drugId: selectedDrugId,
      drugName: drug.name,
      dosage: dosage || 'As directed by physician',
      priority: parseInt(priority, 10),
      status: 'pending',
      prescribedBy: 'Staff Physician',
      timestamp: new Date().toISOString(),
      notes,
    };

    enqueue(newRx);

    // Reset form
    setPatientName('');
    setPatientId('');
    setSelectedDrugId('');
    setDosage('');
    setPriority('3');
    setNotes('');
    setActiveWarning(null);
    setShowForm(false);
  };

  const handleFillNext = () => {
    const nextItem = dequeue();
    if (nextItem) {
      alert(`Filing Prescription for ${nextItem.patientName}:\nDispensing: ${nextItem.drugName}\nDosage: ${nextItem.dosage}`);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Prescription Filling Queue</h1>
          <p>Order high-priority medicine requests via a binary min-heap queue.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={16} />
            <span>New Order</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleFillNext}
            disabled={size === 0}
          >
            <UserCheck size={16} />
            <span>Fill Next Priority</span>
          </button>
        </div>
      </div>

      <div style={layoutGridStyle}>
        {/* Left Side: Priority Queue View */}
        <div className="glass-card" style={{ flex: 2 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="flex items-center gap-3">
              <ListOrdered size={20} color="var(--color-accent)" />
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: '600' }}>Active Queue ({size} pending)</h3>
            </div>
            {size > 0 && (
              <span className="badge badge-accent">
                Next: {queue[0]?.patientName} (Priority {queue[0]?.priority})
              </span>
            )}
          </div>

          {size === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={48} color="var(--color-success)" />
              <h2>Queue is Empty</h2>
              <p>No prescriptions are currently in the filling queue.</p>
            </div>
          ) : (
            <div style={queueListStyle}>
              {queue.map((item, index) => {
                const isNext = index === 0;
                const borderLeftColor = priorityColors[item.priority] || 'var(--color-border)';

                return (
                  <div 
                    key={item.id} 
                    style={{
                      ...queueItemStyle,
                      borderLeft: `4px solid ${borderLeftColor}`,
                      boxShadow: isNext ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                      borderColor: isNext ? 'var(--color-accent-light)' : 'var(--color-border)',
                    }}
                  >
                    <div style={itemMainStyle}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div style={patientTitleStyle}>
                            <span>{item.patientName}</span>
                            <span style={patientIdStyle}>#{item.patientId}</span>
                          </div>
                          <div style={drugLineStyle}>{item.drugName} ({item.dosage})</div>
                          {item.notes && <div style={notesStyle}>Notes: {item.notes}</div>}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span 
                            className="badge" 
                            style={{ 
                              backgroundColor: `rgba(${item.priority === 1 ? '239, 68, 68' : item.priority === 2 ? '245, 158, 11' : '59, 130, 246'}, 0.1)`, 
                              color: borderLeftColor 
                            }}
                          >
                            {priorityLabels[item.priority]}
                          </span>
                          <div style={timeStyle}>
                            <Clock size={12} />
                            <span>{formatDateTime(item.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <div style={itemFooterStyle}>
                        <div style={doctorStyle}>Prescribed by: {item.prescribedBy}</div>
                        <button 
                          className="btn btn-ghost btn-sm btn-danger"
                          onClick={() => removeById(item.id)}
                          style={{ padding: '2px 8px' }}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: New Prescription Entry Form */}
        {showForm && (
          <div className="glass-card animate-scale-in" style={{ flex: 1, alignSelf: 'start' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: '600', marginBottom: 'var(--space-6)' }}>
              Enqueue Prescription
            </h3>
            
            <form onSubmit={handleAddPrescription}>
              <div className="form-group">
                <label>Patient Name</label>
                <input 
                  type="text" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)} 
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Patient ID (Optional)</label>
                <input 
                  type="text" 
                  value={patientId} 
                  onChange={(e) => setPatientId(e.target.value)} 
                  placeholder="e.g. P-12345"
                />
              </div>

              <div className="form-group">
                <label>Prescribe Medicine</label>
                <select 
                  value={selectedDrugId} 
                  onChange={(e) => handleDrugChange(e.target.value)}
                  required
                >
                  <option value="">Select a drug...</option>
                  {drugs.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.totalStock} left)</option>
                  ))}
                </select>
              </div>

              {/* Live warning hub injection */}
              {activeWarning && (
                <div style={{
                  ...warningBoxStyle,
                  backgroundColor: activeWarning.severity === 'high' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                  borderColor: activeWarning.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: '600', marginBottom: '4px' }}>
                    <AlertTriangle size={14} color={activeWarning.severity === 'high' ? 'var(--color-danger-light)' : 'var(--color-warning-light)'} />
                    <span style={{ color: activeWarning.severity === 'high' ? 'var(--color-danger-light)' : 'var(--color-warning-light)' }}>
                      Dispensing Warning: {activeWarning.drugName}
                    </span>
                  </div>
                  <div style={warningNotesStyle}>
                    <div>• Max Daily Dose: {activeWarning.maxDailyDose}</div>
                    <div>• Alert: {activeWarning.notes}</div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Dosage Instructions</label>
                <input 
                  type="text" 
                  value={dosage} 
                  onChange={(e) => setDosage(e.target.value)} 
                  placeholder="e.g. 500mg BID for 7 days"
                />
              </div>

              <div className="form-group">
                <label>Priority Rank</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="1">1 - Critical (Urgent response needed)</option>
                  <option value="2">2 - High (Hypertensive/Pain Crisis)</option>
                  <option value="3">3 - Medium (Regular Antibiotics)</option>
                  <option value="4">4 - Low (Maintenance dosage)</option>
                  <option value="5">5 - Routine (General Supplements)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Clinical Notes</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Additional context..."
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button type="button" className="btn btn-secondary flex-1" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Enqueue Order
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const layoutGridStyle = {
  display: 'flex',
  gap: 'var(--space-6)',
  alignItems: 'start',
};

const queueListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
};

const queueItemStyle = {
  backgroundColor: 'var(--color-bg-secondary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-4)',
  transition: 'all var(--transition-base)',
};

const itemMainStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};

const patientTitleStyle = {
  fontSize: 'var(--font-size-md)',
  fontWeight: '700',
  color: 'var(--color-text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const patientIdStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
};

const drugLineStyle = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: '600',
  color: 'var(--color-accent-light)',
  marginTop: '2px',
};

const notesStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  backgroundColor: 'var(--color-bg-tertiary)',
  padding: '6px 10px',
  borderRadius: 'var(--radius-sm)',
  marginTop: '6px',
};

const timeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
};

const itemFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid var(--color-border)',
  paddingTop: 'var(--space-3)',
  marginTop: 'var(--space-2)',
};

const doctorStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
};

const warningBoxStyle = {
  border: '1px solid',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-3)',
  marginBottom: 'var(--space-4)',
  fontSize: 'var(--font-size-xs)',
};

const warningNotesStyle = {
  color: 'var(--color-text-secondary)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};
