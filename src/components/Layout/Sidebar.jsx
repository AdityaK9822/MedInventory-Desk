import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  Undo2,
  ListOrdered,
  ScanBarcode,
  CalendarClock,
  ShieldAlert,
  Route,
  Layers,
  HeartPulse,
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/catalog', label: 'Drug Catalog', icon: FolderTree },
  { path: '/undo', label: 'Stock Undo Log', icon: Undo2 },
  { path: '/queue', label: 'Prescription Queue', icon: ListOrdered },
  { path: '/barcode', label: 'Barcode Checker', icon: ScanBarcode },
  { path: '/expiration', label: 'Expiration Sorter', icon: CalendarClock },
  { path: '/rules', label: 'Dispensing Rules', icon: ShieldAlert },
  { path: '/routing', label: 'Delivery Route', icon: Route },
  { path: '/shelf', label: 'Shelf Load Manager', icon: Layers },
];


export default function Sidebar() {
  return (
    <aside
      className="sidebar"
      aria-label="Primary navigation"
    >
      <div className="sidebar-logo">
        <HeartPulse size={28} color="var(--color-accent)" aria-hidden="true" />
        <div className="label">
          <span style={logoTextStyle}>MedInventory</span>
          <span style={logoSubtitleStyle}>Desk Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Pages">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={avatarStyle} aria-hidden="true">Ph</div>
        <div className="label">
          <div style={userTitleStyle}>Pharmacist Panel</div>
          <div style={userStatusStyle}>Online</div>
        </div>
      </div>
    </aside>
  );
}

const logoTextStyle = {
  fontSize: 'var(--font-size-md)',
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: 'var(--color-text-primary)',
  lineHeight: 1.2,
};

const logoSubtitleStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const avatarStyle = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--color-accent)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: 'var(--font-size-sm)',
  flexShrink: 0,
};

const userTitleStyle = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: '600',
  color: 'var(--color-text-primary)',
  lineHeight: 1.2,
};

const userStatusStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-success-light)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginTop: '2px',
};
