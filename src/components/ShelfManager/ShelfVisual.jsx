import { Package, Trash2, ShieldAlert } from 'lucide-react';

export default function ShelfVisual({ shelf, onRemoveBox, onRemoveShelf }) {
  const percentage = Math.min(100, Math.round((shelf.used / shelf.capacity) * 100));
  
  // Decide fill color
  let barColor = 'var(--color-success)';
  if (percentage > 90) barColor = 'var(--color-danger)';
  else if (percentage > 70) barColor = 'var(--color-warning)';

  return (
    <div style={shelfCardStyle} className="glass-card">
      <div style={shelfHeaderStyle}>
        <div>
          <h4 style={shelfNameStyle}>{shelf.name}</h4>
          <span style={shelfCapLabelStyle}>
            Used: {shelf.used} / {shelf.capacity} kg ({percentage}%)
          </span>
        </div>
        <button 
          className="btn btn-ghost btn-danger btn-sm"
          onClick={() => onRemoveShelf(shelf.id)}
          title="Decommission Shelf"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={progressBgStyle}>
        <div style={{
          ...progressFillStyle,
          width: `${percentage}%`,
          backgroundColor: barColor,
        }} />
      </div>

      {/* Overload alert banner */}
      {percentage > 90 && (
        <div style={alertBannerStyle}>
          <ShieldAlert size={12} color="var(--color-danger-light)" />
          <span>Shelf is near weight limits. Do not pack more items.</span>
        </div>
      )}

      {/* Box listing inside shelf */}
      <div style={boxListStyle}>
        {shelf.items.length === 0 ? (
          <div style={emptyShelfTextStyle}>No boxes packed.</div>
        ) : (
          shelf.items.map((box) => (
            <div key={box.id} style={boxItemStyle}>
              <div className="flex items-center gap-2">
                <Package size={12} color="var(--color-accent-light)" />
                <span style={boxNameStyle}>{box.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span style={boxWeightStyle}>{box.size} kg</span>
                <button 
                  style={removeBoxButtonStyle}
                  onClick={() => onRemoveBox(box.id, shelf.id)}
                  title="Unload Box"
                >
                  &times;
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const shelfCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
  padding: 'var(--space-4)',
  position: 'relative',
};

const shelfHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const shelfNameStyle = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: '700',
  color: 'var(--color-text-primary)',
};

const shelfCapLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
  fontWeight: '500',
  display: 'block',
  marginTop: '2px',
};

const progressBgStyle = {
  width: '100%',
  height: '6px',
  backgroundColor: 'var(--color-bg-tertiary)',
  borderRadius: 'var(--radius-full)',
  overflow: 'hidden',
};

const progressFillStyle = {
  height: '100%',
  borderRadius: 'var(--radius-full)',
  transition: 'width var(--transition-base), background-color var(--transition-base)',
};

const alertBannerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'var(--color-danger-bg)',
  border: '1px solid rgba(239, 68, 68, 0.1)',
  borderRadius: 'var(--radius-sm)',
  padding: '6px 8px',
  fontSize: '10px',
  color: 'var(--color-danger-light)',
};

const boxListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginTop: 'var(--space-2)',
  maxHeight: '120px',
  overflowY: 'auto',
  paddingRight: '4px',
};

const emptyShelfTextStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  textAlign: 'center',
  padding: 'var(--space-3) 0',
};

const boxItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 8px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-bg-tertiary)',
  border: '1px solid var(--color-border)',
};

const boxNameStyle = {
  fontSize: '11px',
  fontWeight: '500',
  color: 'var(--color-text-secondary)',
};

const boxWeightStyle = {
  fontSize: '10px',
  fontWeight: '600',
  color: 'var(--color-text-tertiary)',
};

const removeBoxButtonStyle = {
  border: 'none',
  background: 'none',
  color: 'var(--color-text-tertiary)',
  fontSize: '14px',
  cursor: 'pointer',
  padding: '0 2px',
  '&:hover': {
    color: 'var(--color-danger-light)',
  }
};
