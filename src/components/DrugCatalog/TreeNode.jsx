import { useState } from 'react';
import { Folder, FolderOpen, Pill, ChevronRight, ChevronDown } from 'lucide-react';

export default function TreeNode({ node, onSelectDrug, selectedDrugId }) {
  const [isOpen, setIsOpen] = useState(false);

  const isFolder = node.type === 'folder';
  const isSelected = selectedDrugId === node.id;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelectDrug(node);
    }
  };

  return (
    <div style={treeNodeStyle}>
      <div 
        style={{
          ...itemHeaderStyle,
          backgroundColor: isSelected ? 'var(--color-bg-hover)' : 'transparent',
          borderLeft: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
        }}
        onClick={handleToggle}
      >
        {/* Chevron */}
        {isFolder ? (
          <span style={chevronStyle}>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        ) : (
          <span style={{ width: '14px' }} />
        )}

        {/* Icon */}
        <span style={iconStyle}>
          {isFolder ? (
            isOpen ? <FolderOpen size={16} color="var(--color-accent-light)" /> : <Folder size={16} color="var(--color-accent)" />
          ) : (
            <Pill size={16} color="var(--color-success-light)" />
          )}
        </span>

        {/* Label */}
        <span style={{
          ...labelStyle,
          fontWeight: isFolder ? '600' : '400',
          color: isFolder ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
        }}>
          {node.name}
        </span>

        {/* Stock Badge for drugs */}
        {!isFolder && (
          <span className={`badge ${node.totalStock <= node.reorderLevel ? 'badge-danger' : 'badge-success'}`} style={{ marginLeft: 'auto', fontSize: '10px' }}>
            {node.totalStock} units
          </span>
        )}
      </div>

      {/* Children rendering */}
      {isFolder && isOpen && node.children && (
        <div style={childrenContainerStyle}>
          {node.children.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              onSelectDrug={onSelectDrug} 
              selectedDrugId={selectedDrugId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const treeNodeStyle = {
  userSelect: 'none',
};

const itemHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '6px 12px',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  transition: 'background-color var(--transition-fast)',
  gap: '8px',
  '&:hover': {
    backgroundColor: 'var(--color-bg-tertiary)',
  }
};

const chevronStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-tertiary)',
};

const iconStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const labelStyle = {
  fontSize: 'var(--font-size-sm)',
};

const childrenContainerStyle = {
  paddingLeft: '18px',
  borderLeft: '1px solid var(--color-border)',
  marginLeft: '20px',
  marginTop: '2px',
  marginBottom: '2px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};
