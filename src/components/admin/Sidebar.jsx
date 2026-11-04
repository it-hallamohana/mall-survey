import React from 'react';
import { LayoutDashboard, Users, TrendingUp, UtensilsCrossed, Gamepad2, Megaphone, Star, Table2, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'demographics', label: 'Demografi', icon: Users },
  { id: 'behavior', label: 'Perilaku', icon: TrendingUp },
  { id: 'fnb', label: 'Kuliner & F&B', icon: UtensilsCrossed },
  { id: 'entertainment', label: 'Hiburan & Event', icon: Gamepad2 },
  { id: 'promo', label: 'Media & Promosi', icon: Megaphone },
  { id: 'experience', label: 'Pengalaman', icon: Star },
  { id: 'responses', label: 'Data Responden', icon: Table2 },
];

export default function Sidebar({ activeTab, onTabChange, onClose, user }) {
  const { signOut } = useAuth();

  const handleNav = (id) => {
    onTabChange(id);
    if (onClose) onClose();
  };

  return (
    <div className="sidebar w-[260px] h-screen flex flex-col custom-scrollbar overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/10">
        <img src="/assets/pxchange-logo.png" alt="PXchange" className="h-8 w-auto brightness-0 invert" />
        <div>
          <p className="text-white text-sm font-semibold leading-tight">Visitor Survey</p>
          <p className="text-gray-500 text-[11px]">Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-4 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`sidebar-item w-full text-left ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon size={18} className="sidebar-icon shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-pxchange-teal/20 flex items-center justify-center text-pxchange-teal text-sm font-bold shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <p className="text-gray-400 text-xs truncate">{user?.email || 'admin'}</p>
        </div>
        <button
          onClick={signOut}
          className="sidebar-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
