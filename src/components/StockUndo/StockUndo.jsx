import { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Undo2, History, RotateCcw, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { formatDateTime, generateId } from '../../utils/helpers';
import { undoLog } from '../../utils/undoLog';

export default function StockUndo() {
  const { drugs, dispatch } = useInventory();
  const [logs, setLogs] = useState([]);

  // Load logs from localStorage
  const loadLogs = () => {
    setLogs(undoLog.getLogs());
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleUndo = (logItem) => {
    // Find the current drug matching this ID
    const drug = drugs.find(d => d.id === logItem.drugId);
    if (!drug) return;

    // Dispatch update stock action back to the old value
    dispatch({
      type: 'UPDATE_STOCK',
      payload: {
        drugId: logItem.drugId,
        batchId: logItem.batchId,
        newQuantity: logItem.oldValue, // Revert to old value
      }
    });

    // Create a new entry in the log showing the Revert/Undo action
    const newLogItem = {
      id: generateId('change'),
      timestamp: new Date().toISOString(),
      drugId: logItem.drugId,
      drugName: logItem.drugName,
      batchId: logItem.batchId,
      oldValue: logItem.newValue,
      newValue: logItem.oldValue,
      user: 'Admin Pharmacist (Undo)',
      isUndoAction: true,
    };

    // Remove the undone item from log list (or just append a revert log)
    // To make it easy to undo, we will filter out the log item that was undone, and update the list.
    const updatedLogs = undoLog.removeAndAdd(logItem.id, newLogItem);
    setLogs(updatedLogs);
  };

  const handleClearLogs = () => {
    setLogs(undoLog.clearLogs());
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Stock Change Log</h1>
          <p>Track all adjustments to medicine quantities and perform safely-audited undos.</p>
        </div>
        {logs.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleClearLogs}>
            Clear History
          </button>
        )}
      </div>

      <div className="glass-card">
        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-6)' }}>
          <History size={20} color="var(--color-accent)" />
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: '600' }}>Modification Timeline</h3>
        </div>

        {logs.length === 0 ? (
          <div className="empty-state">
            <History size={48} />
            <h2>No Stock Modifications Yet</h2>
            <p>Any stock adjustments made in the Drug Catalog will be registered here for instant undo capabilities.</p>
          </div>
        ) : (
          <div style={tableWrapperStyle}>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Medication</th>
                  <th>Batch ID</th>
                  <th>Adjustment</th>
                  <th>User</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const isIncrease = log.newValue > log.oldValue;
                  const difference = Math.abs(log.newValue - log.oldValue);

                  return (
                    <tr key={log.id}>
                      <td>{formatDateTime(log.timestamp)}</td>
                      <td>
                        <span style={drugNameStyle}>{log.drugName}</span>
                      </td>
                      <td><span style={codeStyle}>{log.batchId}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={oldValStyle}>{log.oldValue}</span>
                          <ArrowRightLeft size={12} color="var(--color-text-tertiary)" />
                          <span style={newValStyle}>{log.newValue}</span>
                          <span className={`badge ${isIncrease ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                            {isIncrease ? '+' : '-'}{difference}
                          </span>
                        </div>
                      </td>
                      <td>{log.user}</td>
                      <td>
                        {log.isUndoAction ? (
                          <span className="badge badge-info" style={{ gap: '4px' }}>
                            <RotateCcw size={10} />
                            <span>Undone</span>
                          </span>
                        ) : (
                          <span className="badge badge-accent">Adjusted</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {!log.isUndoAction && (
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleUndo(log)}
                            style={{ gap: '4px' }}
                          >
                            <Undo2 size={12} />
                            <span>Undo Change</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const tableWrapperStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
};

const drugNameStyle = {
  fontWeight: '600',
  color: 'var(--color-text-primary)',
};

const codeStyle = {
  fontFamily: 'monospace',
  fontSize: 'var(--font-size-xs)',
};

const oldValStyle = {
  color: 'var(--color-text-tertiary)',
  textDecoration: 'line-through',
};

const newValStyle = {
  fontWeight: '600',
  color: 'var(--color-text-primary)',
};
