import React from 'react';
import { LayoutDashboard, Table2, LogOut, ExternalLink, QrCode } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', desc: 'Semua hasil survey', icon: LayoutDashboard },
  { id: 'responses', label: 'Data Responden', desc: 'Cek satu per satu', icon: Table2 },
];

const fmt = (n) => (n ?? 0).toLocaleString('id-ID');

export default function Sidebar({ activeTab, onTabChange, user, totalCount }) {
  const { signOut } = useAuth();

  return (
    <aside className="dash-sidebar hidden lg:flex sticky top-0 h-screen w-[264px] shrink-0 flex-col px-4 py-6">
      {/* Brand */}
      <div className="px-2 mb-8">
        <div className="rounded-2xl bg-white px-4 py-3 inline-flex">
          <img src="/assets/pxchange-logo.png" alt="Pekanbaru Xchange" className="h-8 w-auto" />
        </div>
        <p className="mt-4 font-display text-white text-lg font-bold leading-tight">Visitor Insight</p>
        <p className="text-white/50 text-xs">Survey Pengunjung PXchange</p>
      </div>

      {/* Nav */}
      <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">Menu</p>
      <nav className="space-y-1.5">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => onTabChange(item.id)} className={`dash-nav-item ${active ? 'active' : ''}`}>
              <Icon size={19} className="shrink-0" />
              <span className="flex flex-col items-start leading-tight">
                <span>{item.label}</span>
                <span className={`text-[11px] font-normal ${active ? 'text-white/80' : 'text-white/35'}`}>{item.desc}</span>
              </span>
              {item.id === 'responses' && totalCount > 0 && <span className="nav-badge tabular">{fmt(totalCount)}</span>}
            </button>
          );
        })}
      </nav>

      {/* Survey link card */}
      <div className="mt-auto">
        <div className="relative overflow-hidden rounded-2xl p-4 mb-4 border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(0,165,156,0.25), rgba(180,30,142,0.25))' }}>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-1.5 shrink-0">
              <img src="/assets/qr-mallsurvey.png" alt="QR Survey" className="h-12 w-12" style={{ imageRendering: 'pixelated' }} />
            </div>
            <div className="min-w-0">
              <p className="text-white text-[13px] font-semibold flex items-center gap-1"><QrCode size={13} /> Link Survey</p>
              <a href="/" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white text-[11px] inline-flex items-center gap-1 transition-colors">
                Buka form <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #ED145B, #F15A29)' }}>
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-[12px] font-semibold">Admin</p>
            <p className="text-white/45 text-[11px] truncate">{user?.email || 'admin'}</p>
          </div>
          <button onClick={signOut} title="Logout" className="h-8 w-8 rounded-lg flex items-center justify-center text-white/50 hover:text-rose-300 hover:bg-rose-500/15 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="dash-bottom-nav lg:hidden">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        return (
          <button key={item.id} onClick={() => onTabChange(item.id)} className={activeTab === item.id ? 'active' : ''}>
            <Icon size={17} /> {item.label}
          </button>
        );
      })}
    </nav>
  );
}
