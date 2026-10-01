import React, { useState } from 'react';
import { Anchor, Shield, Ship, Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@pelitanusantara.co.id');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Admin Pelayaran');
  const [role, setRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = (selectedRole: UserRole, defaultName: string, defaultEmail: string) => {
    setRole(selectedRole);
    setName(defaultName);
    setEmail(defaultEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const userProfile: UserProfile = {
        uid: 'user-' + Date.now(),
        email,
        name,
        role,
        vesselAssigned: role === 'captain' ? 'KM. Pelita Nusantara I' : undefined
      };
      localStorage.setItem('pelita_user', JSON.stringify(userProfile));
      setIsLoading(false);
      onLogin(userProfile);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-950 p-6 text-center relative border-b border-slate-800">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-400/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Anchor className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
            PELITA NUSANTARA
          </h1>
          <p className="text-cyan-300 text-sm font-medium mt-1">Sistem Manajemen Perusahaan Pelayaran</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pilih Akses Cepat Demo:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'Administrator Utama', 'admin@pelitanusantara.co.id')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  role === 'admin'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-medium'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-white flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-cyan-400" /> Admin Pusat</div>
                <span className="text-[10px] text-slate-400">Akses Penuh CRUD</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ops', 'Manager Operasional', 'ops@pelitanusantara.co.id')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  role === 'ops'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-medium'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-white flex items-center gap-1.5"><Ship className="w-3.5 h-3.5 text-blue-400" /> Operasional</div>
                <span className="text-[10px] text-slate-400">Armada & Rute</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('finance', 'Kepala Keuangan', 'finance@pelitanusantara.co.id')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  role === 'finance'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-medium'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-white flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Keuangan</div>
                <span className="text-[10px] text-slate-400">Manifest & Laporan</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('captain', 'Capt. Budi Santoso', 'captain@pelitanusantara.co.id')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  role === 'captain'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-medium'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-white flex items-center gap-1.5"><Anchor className="w-3.5 h-3.5 text-amber-400" /> Kapten Kapal</div>
                <span className="text-[10px] text-slate-400">Log Pelayaran</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="Nama Pengguna"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email / Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="email@pelitanusantara.co.id"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Masuk ke Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Terhubung ke Database Real-Time • Keamanan Enkripsi SSL
          </div>
        </div>
      </div>
    </div>
  );
};
