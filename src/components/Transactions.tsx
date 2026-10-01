import React, { useState } from 'react';
import { Package, Ship, Wrench, Plus, Edit, Trash2, X, CheckCircle, Clock } from 'lucide-react';
import { Booking, VoyageLog, MaintenanceRecord, Vessel, Client, Route } from '../types';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface TransactionsProps {
  bookings: Booking[];
  voyages: VoyageLog[];
  maintenance: MaintenanceRecord[];
  vessels: Vessel[];
  clients: Client[];
  routes: Route[];
  onRefresh: () => void;
}

type TransSubTab = 'bookings' | 'voyages' | 'maintenance';

export const Transactions: React.FC<TransactionsProps> = ({
  bookings,
  voyages,
  maintenance,
  vessels,
  clients,
  routes,
  onRefresh
}) => {
  const [subTab, setSubTab] = useState<TransSubTab>('bookings');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [bookingForm, setBookingForm] = useState({
    clientId: clients[0]?.id || '',
    vesselId: vessels[0]?.id || '',
    routeId: routes[0]?.id || '',
    cargoDescription: '',
    weightTons: 100,
    freightRateIDR: 50000000,
    paymentStatus: 'Lunas' as Booking['paymentStatus'],
    bookingStatus: 'Dalam Perjalanan' as Booking['bookingStatus']
  });

  const [voyageForm, setVoyageForm] = useState({
    voyageNumber: 'VOY-' + Math.floor(Math.random() * 89999 + 10000),
    vesselId: vessels[0]?.id || '',
    routeId: routes[0]?.id || '',
    fuelConsumedTons: 25.0,
    weatherCondition: 'Cerah' as VoyageLog['weatherCondition'],
    status: 'In Progress' as VoyageLog['status'],
    notes: ''
  });

  const [maintForm, setMaintForm] = useState({
    vesselId: vessels[0]?.id || '',
    dockingLocation: 'Galangan Tanjung Priok',
    repairType: 'Perawatan Mesin & Pengecatan',
    costIDR: 150000000,
    status: 'Proses Pengerjaan' as MaintenanceRecord['status'],
    technicianInCharge: 'Ir. Budi Teknisi'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    if (subTab === 'bookings') {
      setBookingForm({
        clientId: clients[0]?.id || '',
        vesselId: vessels[0]?.id || '',
        routeId: routes[0]?.id || '',
        cargoDescription: '',
        weightTons: 100,
        freightRateIDR: 50000000,
        paymentStatus: 'Lunas',
        bookingStatus: 'Dalam Perjalanan'
      });
    } else if (subTab === 'voyages') {
      setVoyageForm({
        voyageNumber: 'VOY-' + Math.floor(Math.random() * 89999 + 10000),
        vesselId: vessels[0]?.id || '',
        routeId: routes[0]?.id || '',
        fuelConsumedTons: 25.0,
        weatherCondition: 'Cerah',
        status: 'In Progress',
        notes: 'Pelayaran dimulai tepat waktu.'
      });
    } else if (subTab === 'maintenance') {
      setMaintForm({
        vesselId: vessels[0]?.id || '',
        dockingLocation: 'Galangan Utama',
        repairType: 'Perbaikan Sistem Navigasi',
        costIDR: 100000000,
        status: 'Proses Pengerjaan',
        technicianInCharge: 'Tim Ahli Mesin'
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      onRefresh();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, collectionName);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (subTab === 'bookings') {
        const id = editingItem ? editingItem.id : 'bkg-' + Date.now();
        const client = clients.find(c => c.id === bookingForm.clientId);
        const vessel = vessels.find(v => v.id === bookingForm.vesselId);
        const route = routes.find(r => r.id === bookingForm.routeId);

        const payload: Booking = {
          id,
          bookingNumber: editingItem ? editingItem.bookingNumber : 'BKG-2026-' + Math.floor(Math.random() * 899 + 100),
          clientId: bookingForm.clientId,
          clientName: client?.companyName || 'Shipper Umum',
          vesselId: bookingForm.vesselId,
          vesselName: vessel?.name || 'Kapal Pelita',
          routeId: bookingForm.routeId,
          routeDescription: route ? `${route.origin} -> ${route.destination}` : 'Rute Nasional',
          cargoDescription: bookingForm.cargoDescription,
          weightTons: Number(bookingForm.weightTons),
          freightRateIDR: Number(bookingForm.freightRateIDR),
          paymentStatus: bookingForm.paymentStatus,
          bookingStatus: bookingForm.bookingStatus,
          createdAt: editingItem ? editingItem.createdAt : new Date().toISOString()
        };
        await setDoc(doc(db, 'bookings', id), payload);
      } else if (subTab === 'voyages') {
        const id = editingItem ? editingItem.id : 'voy-' + Date.now();
        const vessel = vessels.find(v => v.id === voyageForm.vesselId);
        const route = routes.find(r => r.id === voyageForm.routeId);

        const payload: VoyageLog = {
          id,
          voyageNumber: voyageForm.voyageNumber,
          vesselId: voyageForm.vesselId,
          vesselName: vessel?.name || 'Kapal Pelita',
          routeId: voyageForm.routeId,
          routeDescription: route ? `${route.origin} - ${route.destination}` : 'Pelayaran Domestik',
          departureDate: editingItem ? editingItem.departureDate : new Date().toISOString(),
          estimatedArrivalDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          fuelConsumedTons: Number(voyageForm.fuelConsumedTons),
          weatherCondition: voyageForm.weatherCondition,
          status: voyageForm.status,
          notes: voyageForm.notes
        };
        await setDoc(doc(db, 'voyageLogs', id), payload);
      } else if (subTab === 'maintenance') {
        const id = editingItem ? editingItem.id : 'maint-' + Date.now();
        const vessel = vessels.find(v => v.id === maintForm.vesselId);

        const payload: MaintenanceRecord = {
          id,
          vesselId: maintForm.vesselId,
          vesselName: vessel?.name || 'Kapal Pelita',
          dockingLocation: maintForm.dockingLocation,
          repairType: maintForm.repairType,
          costIDR: Number(maintForm.costIDR),
          startDate: editingItem ? editingItem.startDate : new Date().toISOString(),
          completionDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          status: maintForm.status,
          technicianInCharge: maintForm.technicianInCharge
        };
        await setDoc(doc(db, 'maintenance', id), payload);
      }
      setShowModal(false);
      onRefresh();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, subTab);
    }
  };

  const formatIDR = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  return (
    <div className="space-y-6">
      {/* Header & SubTabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Transaksi & Logistik Operasional</h2>
          <p className="text-slate-400 text-xs mt-1">Kelola pemesanan muatan kargo, log voyage pelayaran, dan jadwal perawatan armada.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Buat Transaksi Baru
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setSubTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'bookings' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> Manifest Booking Muatan ({bookings.length})
        </button>
        <button
          onClick={() => setSubTab('voyages')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'voyages' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Ship className="w-4 h-4" /> Log Voyage Pelayaran ({voyages.length})
        </button>
        <button
          onClick={() => setSubTab('maintenance')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'maintenance' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" /> Maintenance Kapal ({maintenance.length})
        </button>
      </div>

      {/* Content tables */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden">
        {subTab === 'bookings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">No. Booking</th>
                  <th className="pb-3 px-3">Shipper / Klien</th>
                  <th className="pb-3 px-3">Armada Kapal</th>
                  <th className="pb-3 px-3">Rute Pelayaran</th>
                  <th className="pb-3 px-3">Kargo & Berat</th>
                  <th className="pb-3 px-3">Pembayaran</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">{b.bookingNumber}</td>
                    <td className="py-3.5 px-3 text-slate-300">{b.clientName}</td>
                    <td className="py-3.5 px-3 text-cyan-300 font-medium">{b.vesselName}</td>
                    <td className="py-3.5 px-3 text-slate-300">{b.routeDescription}</td>
                    <td className="py-3.5 px-3 text-slate-300">{b.cargoDescription} ({b.weightTons} Ton)</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${b.paymentStatus === 'Lunas' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDelete(b.id, 'bookings')} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subTab === 'voyages' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">No. Voyage</th>
                  <th className="pb-3 px-3">Kapal</th>
                  <th className="pb-3 px-3">Rute</th>
                  <th className="pb-3 px-3">BBM Terpakai</th>
                  <th className="pb-3 px-3">Cuaca</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {voyages.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-cyan-400">{v.voyageNumber}</td>
                    <td className="py-3.5 px-3 text-white font-medium">{v.vesselName}</td>
                    <td className="py-3.5 px-3 text-slate-300">{v.routeDescription}</td>
                    <td className="py-3.5 px-3 text-slate-300">{v.fuelConsumedTons} Ton HFO</td>
                    <td className="py-3.5 px-3 text-slate-300">{v.weatherCondition}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDelete(v.id, 'voyageLogs')} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subTab === 'maintenance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Kapal</th>
                  <th className="pb-3 px-3">Lokasi Docking</th>
                  <th className="pb-3 px-3">Jenis Perbaikan</th>
                  <th className="pb-3 px-3">Teknisi Penanggung Jawab</th>
                  <th className="pb-3 px-3">Biaya</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {maintenance.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">{m.vesselName}</td>
                    <td className="py-3.5 px-3 text-slate-300">{m.dockingLocation}</td>
                    <td className="py-3.5 px-3 text-cyan-300">{m.repairType}</td>
                    <td className="py-3.5 px-3 text-slate-300">{m.technicianInCharge}</td>
                    <td className="py-3.5 px-3 text-emerald-400 font-medium">{formatIDR(m.costIDR)}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDelete(m.id, 'maintenance')} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">Tambah Transaksi ({subTab.toUpperCase()})</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {subTab === 'bookings' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Pilih Klien / Shipper</label>
                      <select
                        value={bookingForm.clientId}
                        onChange={e => setBookingForm({ ...bookingForm, clientId: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      >
                        {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Pilih Kapal</label>
                      <select
                        value={bookingForm.vesselId}
                        onChange={e => setBookingForm({ ...bookingForm, vesselId: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      >
                        {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Pilih Rute Pelayaran</label>
                    <select
                      value={bookingForm.routeId}
                      onChange={e => setBookingForm({ ...bookingForm, routeId: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {routes.map(r => <option key={r.id} value={r.id}>{`${r.code}: ${r.origin} \u2192 ${r.destination}`}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Deskripsi Kargo & Muatan</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.cargoDescription}
                      onChange={e => setBookingForm({ ...bookingForm, cargoDescription: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      placeholder="Contoh: General Cargo / Container 40ft (50 Unit)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Berat (Ton)</label>
                      <input
                        type="number"
                        required
                        value={bookingForm.weightTons}
                        onChange={e => setBookingForm({ ...bookingForm, weightTons: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Tarif Freight (IDR)</label>
                      <input
                        type="number"
                        required
                        value={bookingForm.freightRateIDR}
                        onChange={e => setBookingForm({ ...bookingForm, freightRateIDR: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {subTab === 'voyages' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Pilih Kapal</label>
                      <select
                        value={voyageForm.vesselId}
                        onChange={e => setVoyageForm({ ...voyageForm, vesselId: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      >
                        {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Pilih Rute</label>
                      <select
                        value={voyageForm.routeId}
                        onChange={e => setVoyageForm({ ...voyageForm, routeId: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      >
                        {routes.map(r => <option key={r.id} value={r.id}>{r.code}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">BBM Terpakai (Ton)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={voyageForm.fuelConsumedTons}
                        onChange={e => setVoyageForm({ ...voyageForm, fuelConsumedTons: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Kondisi Cuaca</label>
                      <select
                        value={voyageForm.weatherCondition}
                        onChange={e => setVoyageForm({ ...voyageForm, weatherCondition: e.target.value as VoyageLog['weatherCondition'] })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Cerah">Cerah</option>
                        <option value="Berawan">Berawan</option>
                        <option value="Hujan Ringan">Hujan Ringan</option>
                        <option value="Badai / Ombak Besar">Badai / Ombak Besar</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Catatan Voyage</label>
                    <input
                      type="text"
                      required
                      value={voyageForm.notes}
                      onChange={e => setVoyageForm({ ...voyageForm, notes: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </>
              )}

              {subTab === 'maintenance' && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Pilih Kapal</label>
                    <select
                      value={maintForm.vesselId}
                      onChange={e => setMaintForm({ ...maintForm, vesselId: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Lokasi Docking</label>
                      <input
                        type="text"
                        required
                        value={maintForm.dockingLocation}
                        onChange={e => setMaintForm({ ...maintForm, dockingLocation: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Biaya Perbaikan (IDR)</label>
                      <input
                        type="number"
                        required
                        value={maintForm.costIDR}
                        onChange={e => setMaintForm({ ...maintForm, costIDR: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Jenis Perbaikan</label>
                    <input
                      type="text"
                      required
                      value={maintForm.repairType}
                      onChange={e => setMaintForm({ ...maintForm, repairType: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Teknisi Penanggung Jawab</label>
                    <input
                      type="text"
                      required
                      value={maintForm.technicianInCharge}
                      onChange={e => setMaintForm({ ...maintForm, technicianInCharge: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Batal</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl">Simpan Transaksi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
