import React from 'react';
import { Ship, Anchor, DollarSign, Package, Compass, TrendingUp, AlertCircle, CheckCircle2, Navigation } from 'lucide-react';
import { Vessel, Booking, VoyageLog, MaintenanceRecord } from '../types';

interface DashboardProps {
  vessels: Vessel[];
  bookings: Booking[];
  voyages: VoyageLog[];
  maintenance: MaintenanceRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ vessels, bookings, voyages, maintenance }) => {
  const activeVessels = vessels.filter(v => v.status === 'Berlayar').length;
  const dockedVessels = vessels.filter(v => v.status === 'Sandar').length;
  const maintVessels = vessels.filter(v => v.status === 'Maintenance').length;

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.freightRateIDR || 0), 0);
  const totalCargoWeight = bookings.reduce((acc, b) => acc + (b.weightTons || 0), 0);

  const formatIDR = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 animate-spin-slow" /> Real-Time Fleet & Logistics Intelligence
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Dashboard Operasional Pelayaran</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Memantau status armada, manifest muatan kargo, log pelayaran, dan performa finansial perusahaan secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/60 px-4 py-2.5 rounded-xl">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-xs font-medium text-emerald-400">Database Online Terhubung</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Armada Aktif</span>
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Ship className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{vessels.length} Kapal</div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{activeVessels} Berlayar</span> • 
            <span className="text-amber-400 font-semibold">{dockedVessels} Sandar</span> • 
            <span className="text-rose-400 font-semibold">{maintVessels} Maint</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Pendapatan Freight</span>
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-bold text-white mb-1">{formatIDR(totalRevenue)}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +14.8% dari bulan lalu
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Muatan Kargo</span>
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{totalCargoWeight.toLocaleString('id-ID')} Ton</div>
          <div className="text-xs text-slate-400">
            {bookings.length} Manifest aktif terdaftar
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Voyage & Maintenance</span>
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Anchor className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{voyages.length} Voyage Aktif</div>
          <div className="text-xs text-slate-400">
            {maintenance.length} jadwal docking & perbaikan
          </div>
        </div>
      </div>

      {/* Two Columns: Live Vessel Radar & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Radar Simulator */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" /> Radar Posisi Armada
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">Live GPS</span>
          </div>

          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
            {/* Radar scanner visual effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

            <div className="space-y-3 relative z-10">
              {vessels.map(v => (
                <div key={v.id} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-white text-xs font-semibold flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${v.status === 'Berlayar' ? 'bg-emerald-400 animate-pulse' : v.status === 'Sandar' ? 'bg-amber-400' : 'bg-rose-400'}`}></div>
                      {v.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{v.currentLocation}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    v.status === 'Berlayar' ? 'bg-emerald-500/20 text-emerald-300' :
                    v.status === 'Sandar' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-center relative z-10">
              <span className="text-[11px] text-cyan-400 font-medium">Satelit AIS Terhubung • Sinyal Kuat</span>
            </div>
          </div>
        </div>

        {/* Recent Manifest & Bookings Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" /> Manifest Pengiriman Muatan Terbaru
            </h3>
            <span className="text-xs text-slate-400">{bookings.length} Total Booking</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">No. Booking</th>
                  <th className="pb-3 px-3">Klien / Shipper</th>
                  <th className="pb-3 px-3">Kapal</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Nilai Freight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{b.bookingNumber}</td>
                    <td className="py-3 px-3 text-slate-300">{b.clientName}</td>
                    <td className="py-3 px-3 text-cyan-300 font-medium">{b.vesselName}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        b.bookingStatus === 'Dalam Perjalanan' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        b.bookingStatus === 'Tiba di Tujuan' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-emerald-400">{formatIDR(b.freightRateIDR)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
