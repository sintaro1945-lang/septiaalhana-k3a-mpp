import React, { useState } from 'react';
import { Anchor, Bell, LogOut, Shield, User, Ship, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { UserProfile, MaritimeNotification } from '../types';

interface NavbarProps {
  user: UserProfile;
  onLogout: () => void;
  notifications: MaritimeNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, notifications, onMarkNotificationRead }) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">Administrator</span>;
      case 'ops':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">Operasional</span>;
      case 'finance':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">Keuangan</span>;
      case 'captain':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">Kapten / Kru</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-600/20 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400">
          <Anchor className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
            PelitaNusantara Maritime
          </h2>
          <p className="text-slate-400 text-xs">Sistem Manajemen Armada & Logistik Pelayaran</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700/80 rounded-xl flex items-center justify-center text-slate-300 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
                <span className="font-semibold text-white text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" /> Notifikasi Sistem
                </span>
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} Baru
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">Tidak ada notifikasi baru</div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3.5 hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 ${
                        notif.read ? 'opacity-60' : 'bg-slate-800/20'
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                        {notif.type === 'danger' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                        {notif.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-white">{notif.title}</h4>
                          <span className="text-[10px] text-slate-500">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-white">{user.name}</div>
            <div className="mt-0.5">{getRoleBadge(user.role)}</div>
          </div>

          <button
            onClick={onLogout}
            title="Keluar / Logout"
            className="w-10 h-10 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
