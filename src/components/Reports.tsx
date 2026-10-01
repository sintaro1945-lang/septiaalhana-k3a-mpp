import React from 'react';
import { FileText, Download, DollarSign, TrendingUp, ShieldCheck, Printer } from 'lucide-react';
import { Booking, MaintenanceRecord, Vessel } from '../types';

interface ReportsProps {
  bookings: Booking[];
  maintenance: MaintenanceRecord[];
  vessels: Vessel[];
}

export const Reports: React.FC<ReportsProps> = ({ bookings, maintenance, vessels }) => {
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.freightRateIDR || 0), 0);
  const totalMaintenanceCost = maintenance.reduce((acc, m) => acc + (m.costIDR || 0), 0);
  const netProfit = totalRevenue - totalMaintenanceCost;

  const formatIDR = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "No Booking,Shipper,Kapal,Rute,Tarif IDR,Status\n"
      + bookings.map(b => `"${b.bookingNumber}","${b.clientName}","${b.vesselName}","${b.routeDescription}",${b.freightRateIDR},"${b.bookingStatus}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan_manifest_pelayaran.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Laporan Keuangan & Kinerja Finansial</h2>
          <p className="text-slate-400 text-xs mt-1">Rekapitulasi pendapatan freight muatan, biaya operasional docking, dan laba bersih perusahaan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Printer className="w-4 h-4" /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Pendapatan (Freight)</span>
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatIDR(totalRevenue)}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> Akumulasi dari {bookings.length} kontrak pengiriman
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Biaya Maintenance & Docking</span>
            <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatIDR(totalMaintenanceCost)}</div>
          <div className="text-xs text-rose-400 font-medium">
            Biaya perbaikan {maintenance.length} armada kapal
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Estimasi Laba Bersih</span>
            <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-400 mb-1">{formatIDR(netProfit)}</div>
          <div className="text-xs text-slate-400">
            Margin operasional sehat & stabil
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-white font-bold text-sm">Rincian Keuangan per Kontrak & Manifest</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Kontrak Booking</th>
                <th className="pb-3 px-3">Klien</th>
                <th className="pb-3 px-3">Armada Kapal</th>
                <th className="pb-3 px-3">Status Pembayaran</th>
                <th className="pb-3 px-3 text-right">Nilai Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-white">{b.bookingNumber}</td>
                  <td className="py-3 px-3 text-slate-300">{b.clientName}</td>
                  <td className="py-3 px-3 text-cyan-300">{b.vesselName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300">
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-emerald-400">{formatIDR(b.freightRateIDR)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
