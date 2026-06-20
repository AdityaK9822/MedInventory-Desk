import { useMemo, useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { getSortedBatchesByExpiry, groupByUrgency } from '../../utils/expirationSort';
import {
  CalendarClock,
  Trash2,
  ArrowRightLeft,
  Percent,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { formatDate, generateId } from '../../utils/helpers';

export default function ExpirationSorter() {
  const { drugs, dispatch } = useInventory();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'expired', 'critical', 'warning', 'safe'

  // Derive sorted batch list
  const sortedBatches = useMemo(() => {
    return getSortedBatchesByExpiry(drugs);
  }, [drugs]);

  // Group by urgency level for stat counters
  const groups = useMemo(() => {
    return groupByUrgency(sortedBatches);
  }, [sortedBatches]);

  const filteredBatches = useMemo(() => {
    if (activeFilter === 'all') return sortedBatches;
    return sortedBatches.filter(b => b.urgency.level === activeFilter);
  }, [sortedBatches, activeFilter]);

  const handleDispose = (batch) => {
    // Dispatch removal or setting stock of batch to 0
    dispatch({
      type: 'UPDATE_STOCK',
      payload: {
        drugId: batch.drugId,
        batchId: batch.batchId,
        newQuantity: 0,
      }
    });

    // Write disposal action to undo log
    const changeLog = JSON.parse(localStorage.getItem('medinventory_undo_log') || '[]');
    const changeRecord = {
      id: generateId('change'),
      timestamp: new Date().toISOString(),
      drugId: batch.drugId,
      drugName: batch.drugName,
      batchId: batch.batchId,
      oldValue: batch.quantity,
      newValue: 0,
      user: 'Disposal Agent',
    };
    localStorage.setItem('medinventory_undo_log', JSON.stringify([changeRecord, ...changeLog]));

    alert(`Disposed expired/expired-risk batch ${batch.batchId} of ${batch.drugName}.`);
  };

  const handleApplyDiscount = (batch) => {
    alert(`Applied 30% discount alert label to batch ${batch.batchId} of ${batch.drugName} to expedite usage.`);
  };

  const handleTransfer = (batch) => {
    alert(`Initiating transfer of batch ${batch.batchId} (${batch.quantity} units) to Central Hub to prevent waste.`);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Expiration Sorter</h1>
        <p>Rank and categorize medication batches by expiration urgency to enforce FEFO safety.</p>
      </div>

      {/* Urgency Counter Blocks */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        <div 
          onClick={() => setActiveFilter('expired')}
          className="glass-card stat-card interactive" 
          style={{ 
            '--stat-color': 'var(--color-danger)',
            borderColor: activeFilter === 'expired' ? 'var(--color-danger)' : 'transparent',
            cursor: 'pointer'
          }}
        >
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-danger-bg)' }}>
            <Flame size={20} color="var(--color-danger)" />
          </div>
          <div className="stat-value">{groups.expired.length}</div>
          <div className="stat-label">Expired Batches</div>
        </div>

        <div 
          onClick={() => setActiveFilter('critical')}
          className="glass-card stat-card interactive" 
          style={{ 
            '--stat-color': 'var(--color-danger-light)',
            borderColor: activeFilter === 'critical' ? 'var(--color-danger-light)' : 'transparent',
            cursor: 'pointer'
          }}
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)' }}>
            <ShieldAlert size={20} color="var(--color-danger-light)" />
          </div>
          <div className="stat-value">{groups.critical.length}</div>
          <div className="stat-label">Critical (≤30 Days)</div>
        </div>

        <div 
          onClick={() => setActiveFilter('warning')}
          className="glass-card stat-card interactive" 
          style={{ 
            '--stat-color': 'var(--color-warning)',
            borderColor: activeFilter === 'warning' ? 'var(--color-warning)' : 'transparent',
            cursor: 'pointer'
          }}
        >
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
            <AlertTriangle size={20} color="var(--color-warning)" />
          </div>
          <div className="stat-value">{groups.warning.length}</div>
          <div className="stat-label">Warning (≤90 Days)</div>
        </div>

        <div 
          onClick={() => setActiveFilter('all')}
          className="glass-card stat-card interactive" 
          style={{ 
            '--stat-color': 'var(--color-accent)',
            borderColor: activeFilter === 'all' ? 'var(--color-accent)' : 'transparent',
            cursor: 'pointer'
          }}
        >
          <div className="stat-icon"><CalendarClock size={20} /></div>
          <div className="stat-value">{sortedBatches.length}</div>
          <div className="stat-label">Total Batches</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={filterTabsStyle}>
        <button 
          className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveFilter('all')}
        >
          All Batches
        </button>
        <button 
          className={`btn ${activeFilter === 'expired' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveFilter('expired')}
        >
          Expired ({groups.expired.length})
        </button>
        <button 
          className={`btn ${activeFilter === 'critical' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveFilter('critical')}
        >
          Critical ({groups.critical.length})
        </button>
        <button 
          className={`btn ${activeFilter === 'warning' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveFilter('warning')}
        >
          Warning ({groups.warning.length})
        </button>
      </div>

      {/* Batches Table */}
      <div className="glass-card">
        {filteredBatches.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={48} color="var(--color-success)" />
            <h2>No Batches in this category</h2>
            <p>Great! No pending items require immediate attention in this section.</p>
          </div>
        ) : (
          <div style={tableWrapperStyle}>
            <table>
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Batch ID</th>
                  <th>Location</th>
                  <th>Expiration Date</th>
                  <th>Status</th>
                  <th>Stock Qty</th>
                  <th style={{ textAlign: 'right' }}>Preventative Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((b, i) => (
                  <tr key={i}>
                    <td>
                      <div>
                        <div style={drugNameStyle}>{b.drugName}</div>
                        <div style={genericNameStyle}>{b.genericName}</div>
                      </div>
                    </td>
                    <td><span style={codeStyle}>{b.batchId}</span></td>
                    <td>{b.location}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} color="var(--color-text-tertiary)" />
                        <span>{formatDate(b.expiry)}</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="badge"
                        style={{
                          backgroundColor: b.urgency.color + '22',
                          color: b.urgency.color,
                          border: `1px solid ${b.urgency.color}33`,
                        }}
                      >
                        {b.urgency.label} ({b.urgency.days <= 0 ? 'Passed' : `${b.urgency.days}d left`})
                      </span>
                    </td>
                    <td><span style={{ fontWeight: '600' }}>{b.quantity}</span> units</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={actionGroupStyle}>
                        {b.urgency.level === 'expired' ? (
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDispose(b)}
                            title="Safe Disposal / Write-off"
                          >
                            <Trash2 size={12} />
                            <span>Dispose</span>
                          </button>
                        ) : (
                          <>
                            {b.urgency.days <= 90 && (
                              <button 
                                className="btn btn-warning btn-sm"
                                onClick={() => handleApplyDiscount(b)}
                                title="Promote use with discount"
                              >
                                <Percent size={12} />
                                <span>Discount</span>
                              </button>
                            )}
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleTransfer(b)}
                              title="Transfer to higher demand clinic"
                            >
                              <ArrowRightLeft size={12} />
                              <span>Transfer</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const filterTabsStyle = {
  display: 'flex',
  gap: 'var(--space-2)',
  marginBottom: 'var(--space-4)',
};

const tableWrapperStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
};

const drugNameStyle = {
  fontWeight: '600',
  color: 'var(--color-text-primary)',
};

const genericNameStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
};

const codeStyle = {
  fontFamily: 'monospace',
  fontSize: 'var(--font-size-xs)',
};

const actionGroupStyle = {
  display: 'flex',
  gap: 'var(--space-2)',
  justifyContent: 'flex-end',
};
