import React from 'react';
import { LayoutDashboard, Ship, Database, FileText, Anchor, Compass } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'master' | 'transactions' | 'reports' | 'tracking';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'dashboard', label: 'Dashboard Analitik', icon: <LayoutDashboard className="w-5 h-5" />, desc: 'Real-time monitoring & statistik' },
    { id: 'master', label: 'Master Data', icon: <Database className="w-5 h-5" />, desc: 'Kapal, Rute, Kru, & Klien' },
    { id: 'transactions', label: 'Transaksi & Logistik', icon: <Ship className="w-5 h-5" />, desc: 'Booking, Voyage, & Maintenance' },
    { id: 'reports', label: 'Laporan Keuangan', icon: <FileText className="w-5 h-5" />, desc: 'Pendapatan, Biaya, & Export' },
    { id: 'tracking', label: 'Pelacakan & Alert', icon: <Compass className="w-5 h-5" />, desc: 'Live Radar & Notifikasi' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-1.5">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Menu Utama</div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-start gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/40 text-white font-medium shadow-lg shadow-cyan-500/5'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className={`mt-0.5 p-2 rounded-lg transition-colors ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'}`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className={`text-sm ${isActive ? 'text-white font-semibold' : 'text-slate-300'}`}>{item.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 m-4 bg-slate-800/40 border border-slate-800 rounded-2xl text-center">
        <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 text-cyan-400">
          <Anchor className="w-4 h-4" />
        </div>
        <div className="text-xs font-semibold text-white">Versi 3.4 Enterprise</div>
        <p className="text-[10px] text-slate-400 mt-0.5">Database Real-Time Aktif</p>
      </div>
    </aside>
  );
};
