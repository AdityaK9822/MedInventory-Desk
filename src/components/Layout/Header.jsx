import { useMemo } from 'react';
import { Bell, ShieldAlert, ThermometerSnowflake, Sun, Moon, Monitor } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useTheme } from '../../context/ThemeContext';
import { getExpiryUrgency } from '../../utils/expirationSort';

export default function Header() {
  const { drugs } = useInventory();
  const { mode, setTheme } = useTheme();

  // Find critical items to notify about
  const notifications = useMemo(() => {
    const alerts = [];
    drugs.forEach(d => {
      d.batches.forEach(b => {
        const urgency = getExpiryUrgency(b.expiry);
        if (urgency.level === 'expired') {
          alerts.push(`Batch ${b.batchId} of ${d.name} has expired!`);
        } else if (urgency.level === 'critical') {
          alerts.push(`Batch ${b.batchId} of ${d.name} is expiring within 30 days!`);
        }
      });
      if (d.totalStock <= d.reorderLevel) {
        alerts.push(`Stock warning: ${d.name} is low on stock (${d.totalStock} left)`);
      }
    });
    return alerts;
  }, [drugs]);

  return (
    <header style={headerStyle}>
      <div style={actionsContainerStyle}>
        <div style={themeToggleStyle} role="group" aria-label="Theme">
          <button
            type="button"
            className={`theme-btn ${mode === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            aria-label="Use light theme"
            aria-pressed={mode === 'light'}
            title="Light"
          >
            <Sun size={14} />
          </button>
          <button
            type="button"
            className={`theme-btn ${mode === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            aria-label="Use dark theme"
            aria-pressed={mode === 'dark'}
            title="Dark"
          >
            <Moon size={14} />
          </button>
          <button
            type="button"
            className={`theme-btn ${mode === 'system' ? 'active' : ''}`}
            onClick={() => setTheme('system')}
            aria-label="Follow system theme"
            aria-pressed={mode === 'system'}
            title="System"
          >
            <Monitor size={14} />
          </button>
        </div>

        <div style={badgeListStyle}>
          <div style={systemBadgeStyle}>
            <ThermometerSnowflake size={14} color="var(--color-info-light)" />
            <span>Cold Chain: OK (4.2°C)</span>
          </div>
        </div>

        <div style={bellContainerStyle} title={`${notifications.length} alerts active`}>
          <Bell size={20} color="var(--color-text-secondary)" />
          {notifications.length > 0 && (
            <span style={bellBadgeStyle}>{notifications.length}</span>
          )}

          {/* Notification dropdown on hover or just simple click, for now simple indicator */}
          <div className="notif-dropdown" style={dropdownStyle}>
            <h4 style={dropdownTitleStyle}>System Notifications</h4>
            <div style={dropdownListStyle}>
              {notifications.length === 0 ? (
                <div style={noNotifStyle}>All systems normal. No pending alerts.</div>
              ) : (
                notifications.slice(0, 5).map((n, i) => (
                  <div key={i} style={dropdownItemStyle}>
                    <ShieldAlert size={14} color="var(--color-danger)" />
                    <span>{n}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const headerStyle = {
  height: 'var(--header-height)',
  backgroundColor: 'var(--color-bg-secondary)',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 var(--space-8)',
  position: 'sticky',
  top: 0,
  zIndex: 9,
};

const actionsContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-6)',
};

const badgeListStyle = {
  display: 'flex',
  gap: 'var(--space-2)',
};

const systemBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-info-light)',
  backgroundColor: 'var(--color-info-bg)',
  padding: '4px 10px',
  borderRadius: 'var(--radius-full)',
  border: '1px solid var(--color-border)',
};

const themeToggleStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
  padding: '3px',
  borderRadius: 'var(--radius-full)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-secondary)',
};

const bellContainerStyle = {
  position: 'relative',
  cursor: 'pointer',
  padding: '4px',
};

const bellBadgeStyle = {
  position: 'absolute',
  top: '0px',
  right: '0px',
  backgroundColor: 'var(--color-danger)',
  color: 'white',
  fontSize: '9px',
  fontWeight: '700',
  borderRadius: 'var(--radius-full)',
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  width: '300px',
  backgroundColor: 'var(--color-bg-secondary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-lg)',
  display: 'none',
  padding: 'var(--space-3)',
  marginTop: '8px',
};

const dropdownTitleStyle = {
  fontSize: 'var(--font-size-xs)',
  textTransform: 'uppercase',
  color: 'var(--color-text-tertiary)',
  borderBottom: '1px solid var(--color-border)',
  paddingBottom: 'var(--space-2)',
  marginBottom: 'var(--space-2)',
};

const dropdownListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2)',
};

const dropdownItemStyle = {
  display: 'flex',
  gap: 'var(--space-2)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  padding: '6px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-bg-tertiary)',
};

const noNotifStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
  textAlign: 'center',
  padding: 'var(--space-4) 0',
};
