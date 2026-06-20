import { useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Package,
  AlertTriangle,
  Activity,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { getExpiryUrgency } from '../../utils/expirationSort';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { drugs } = useInventory();

  // Statistics calculations
  const stats = useMemo(() => {
    let totalItems = 0;
    let lowStockCount = 0;
    let expiredCount = 0;
    let expiringSoonCount = 0; // within 30 days
    const categoryTotals = {};

    drugs.forEach(d => {
      totalItems += d.totalStock;
      if (d.totalStock <= d.reorderLevel) {
        lowStockCount++;
      }

      d.batches.forEach(b => {
        const urgency = getExpiryUrgency(b.expiry);
        if (urgency.level === 'expired') {
          expiredCount++;
        } else if (urgency.level === 'critical') {
          expiringSoonCount++;
        }
      });

      categoryTotals[d.category] = (categoryTotals[d.category] || 0) + d.totalStock;
    });

    const categoryData = Object.keys(categoryTotals).map(cat => ({
      name: cat,
      Stock: categoryTotals[cat],
    }));

    return {
      totalTypes: drugs.length,
      totalItems,
      lowStockCount,
      expiredCount,
      expiringSoonCount,
      categoryData,
    };
  }, [drugs]);

  // Expiration alerts to showcase
  const criticalBatches = useMemo(() => {
    const list = [];
    drugs.forEach(d => {
      d.batches.forEach(b => {
        const urgency = getExpiryUrgency(b.expiry);
        if (urgency.level === 'expired' || urgency.level === 'critical') {
          list.push({
            drugName: d.name,
            batchId: b.batchId,
            expiry: b.expiry,
            urgency,
            quantity: b.quantity
          });
        }
      });
    });
    return list.slice(0, 5); // limit to 5
  }, [drugs]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>MedInventory Analytics</h1>
        <p>Real-time clinical pharmacy logistics and safety parameters.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="glass-card stat-card" style={{ '--stat-color': 'var(--color-accent)' }}>
          <div className="stat-icon"><Package size={20} /></div>
          <div className="stat-value">{stats.totalTypes}</div>
          <div className="stat-label">Medicine Formulas</div>
        </div>

        <div className="glass-card stat-card" style={{ '--stat-color': 'var(--color-info)' }}>
          <div className="stat-icon"><Activity size={20} /></div>
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-label">Total Units Stocked</div>
        </div>

        <div className="glass-card stat-card" style={{ '--stat-color': 'var(--color-warning)' }}>
          <div className="stat-icon"><AlertTriangle size={20} /></div>
          <div className="stat-value">{stats.lowStockCount}</div>
          <div className="stat-label">Low Stock Warnings</div>
        </div>

        <div className="glass-card stat-card" style={{ '--stat-color': 'var(--color-danger)' }}>
          <div className="stat-icon"><Flame size={20} /></div>
          <div className="stat-value">{stats.expiredCount}</div>
          <div className="stat-label">Expired Batches</div>
        </div>
      </div>

      <div style={dashboardGridStyle}>
        {/* Chart Card */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={sectionTitleStyle}>Stock Distribution by Category</h3>
          <div style={{ height: '300px', marginTop: 'var(--space-4)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-bg-elevated)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)' 
                  }} 
                />
                <Bar dataKey="Stock" fill="var(--color-accent-light)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expiration Alert Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={sectionTitleStyle}>Immediate Expiry Alert</h3>
            <Link to="/expiration" style={viewAllLinkStyle}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={alertListStyle}>
            {criticalBatches.length === 0 ? (
              <div className="empty-state">
                <CheckCircle2 size={36} color="var(--color-success)" />
                <p>No critical expirations detected.</p>
              </div>
            ) : (
              criticalBatches.map((b, i) => (
                <div key={i} style={alertItemStyle}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: b.urgency.color 
                    }} />
                    <div>
                      <div style={drugNameStyle}>{b.drugName}</div>
                      <div style={batchInfoStyle}>Batch: {b.batchId} • Expiry: {b.expiry}</div>
                    </div>
                  </div>
                  <span className={`badge ${b.urgency.level === 'expired' ? 'badge-danger' : 'badge-warning'}`}>
                    {b.urgency.days <= 0 ? 'Expired' : `${b.urgency.days} days left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const dashboardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 'var(--space-6)',
};

const sectionTitleStyle = {
  fontSize: 'var(--font-size-md)',
  fontWeight: '600',
  color: 'var(--color-text-primary)',
};

const viewAllLinkStyle = {
  fontSize: 'var(--font-size-xs)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: 'var(--color-accent-light)',
};

const alertListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
  flex: 1,
};

const alertItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-3)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-bg-tertiary)',
  border: '1px solid var(--color-border)',
};

const drugNameStyle = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: '600',
  color: 'var(--color-text-primary)',
};

const batchInfoStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
};
