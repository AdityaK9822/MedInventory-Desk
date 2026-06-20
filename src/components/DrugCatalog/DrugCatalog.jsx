import { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import TreeNode from './TreeNode';
import { Pill, Edit2, AlertTriangle, Check } from 'lucide-react';
import { formatCurrency, formatDate, generateId } from '../../utils/helpers';
import { undoLog } from '../../utils/undoLog';
import { styles } from './DrugCatalog.styles';

export default function DrugCatalog() {
  const { catalog, drugs, dispatch } = useInventory();
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [editingBatch, setEditingBatch] = useState(null);
  const [editQty, setEditQty] = useState('');

  // Find the live updated drug object from the list
  const liveDrug = selectedDrug ? drugs.find(d => d.id === selectedDrug.id) : null;

  const handleSelectDrug = (drug) => {
    setSelectedDrug(drug);
    setEditingBatch(null);
  };

  const handleStartEdit = (batch) => {
    setEditingBatch(batch);
    setEditQty(batch.quantity.toString());
  };

  const handleSaveStock = (batch) => {
    const newQty = parseInt(editQty, 10);
    if (isNaN(newQty) || newQty < 0) return;

    // Trigger update stock action (which goes to InventoryContext reducer)
    dispatch({
      type: 'UPDATE_STOCK',
      payload: {
        drugId: liveDrug.id,
        batchId: batch.batchId,
        newQuantity: newQty
      }
    });

    // Write to Undo Log history
    const changeRecord = {
      id: generateId('change'),
      timestamp: new Date().toISOString(),
      drugId: liveDrug.id,
      drugName: liveDrug.name,
      batchId: batch.batchId,
      oldValue: batch.quantity,
      newValue: newQty,
      user: 'Admin Pharmacist',
    };
    undoLog.pushLog(changeRecord);

    setEditingBatch(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Drug Catalog Viewer</h1>
        <p>Explore medications, manage batches, and adjust stock parameters.</p>
      </div>

      <div style={styles.layoutGrid}>
        {/* Left Side: Tree View */}
        <div className="glass-card" style={styles.treePanel}>
          <h3 style={styles.panelTitle}>Medication Hierarchy</h3>
          <div style={styles.treeContainer}>
            {catalog.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                onSelectDrug={handleSelectDrug}
                selectedDrugId={selectedDrug?.id}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Details View */}
        <div className="glass-card" style={styles.detailsPanel}>
          {liveDrug ? (
            <div style={styles.detailsContent}>
              {/* Header */}
              <div style={styles.drugHeader}>
                <div style={styles.drugTitleGroup}>
                  <div style={styles.pillIconContainer}>
                    <Pill size={28} color="var(--color-accent-light)" />
                  </div>
                  <div>
                    <h2 style={styles.drugTitle}>{liveDrug.name}</h2>
                    <p style={styles.genericName}>{liveDrug.genericName} • {liveDrug.manufacturer}</p>
                  </div>
                </div>
                <div style={styles.badgeContainer}>
                  <span className={`badge ${liveDrug.totalStock <= liveDrug.reorderLevel ? 'badge-danger' : 'badge-success'}`}>
                    Total: {liveDrug.totalStock} units
                  </span>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div style={styles.quickInfoGrid}>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Category</span>
                  <span style={styles.infoValue}>{liveDrug.category}</span>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Dosage Form</span>
                  <span style={styles.infoValue}>{liveDrug.form}</span>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Strength</span>
                  <span style={styles.infoValue}>{liveDrug.strength}</span>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Unit Price</span>
                  <span style={styles.infoValue}>{formatCurrency(liveDrug.unitPrice)}</span>
                </div>
              </div>

              {/* Threshold alerts */}
              {liveDrug.totalStock <= liveDrug.reorderLevel && (
                <div style={styles.stockAlert}>
                  <AlertTriangle size={18} color="var(--color-danger-light)" />
                  <span>Stock levels are below reorder threshold ({liveDrug.reorderLevel} units). Reorder recommended.</span>
                </div>
              )}

              {/* Batches Table */}
              <div style={{ marginTop: 'var(--space-6)' }}>
                <h3 style={styles.sectionTitle}>Batch Management</h3>
                <div style={styles.tableWrapper}>
                  <table>
                    <thead>
                      <tr>
                        <th>Batch ID</th>
                        <th>Barcode</th>
                        <th>Expiry Date</th>
                        <th>Location</th>
                        <th>Qty (Units)</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveDrug.batches.map((b) => (
                        <tr key={b.batchId}>
                          <td><span style={styles.boldCode}>{b.batchId}</span></td>
                          <td><span style={styles.code}>{b.barcode}</span></td>
                          <td>{formatDate(b.expiry)}</td>
                          <td>{b.location}</td>
                          <td>
                            {editingBatch?.batchId === b.batchId ? (
                              <input
                                type="number"
                                value={editQty}
                                onChange={(e) => setEditQty(e.target.value)}
                                style={styles.editInput}
                              />
                            ) : (
                              <span>{b.quantity}</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {editingBatch?.batchId === b.batchId ? (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleSaveStock(b)}
                                style={{ marginRight: 'var(--space-2)' }}
                              >
                                <Check size={12} />
                                <span>Save</span>
                              </button>
                            ) : (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleStartEdit(b)}
                              >
                                <Edit2 size={12} />
                                <span>Adjust Qty</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Pill size={48} />
              <h2>No Medicine Selected</h2>
              <p>Select a medicine from the folder hierarchy tree to view its batch lists, total stocks, and active warnings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
