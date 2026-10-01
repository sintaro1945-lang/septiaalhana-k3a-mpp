import React, { useState } from 'react';
import { Ship, Route as RouteIcon, Users, Building2, Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { Vessel, Route, Crew, Client, VesselType, VesselStatus } from '../types';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface MasterDataProps {
  vessels: Vessel[];
  routes: Route[];
  crew: Crew[];
  clients: Client[];
  onRefresh: () => void;
}

type MasterSubTab = 'vessels' | 'routes' | 'crew' | 'clients';

export const MasterData: React.FC<MasterDataProps> = ({ vessels, routes, crew, clients, onRefresh }) => {
  const [subTab, setSubTab] = useState<MasterSubTab>('vessels');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [vesselForm, setVesselForm] = useState({
    name: '',
    type: 'Container' as VesselType,
    capacityDWT: 10000,
    capacityTEU: 1000,
    builtYear: 2020,
    status: 'Berlayar' as VesselStatus,
    captain: '',
    currentLocation: ''
  });

  const [routeForm, setRouteForm] = useState({
    code: '',
    origin: '',
    destination: '',
    distanceNauticalMiles: 400,
    estimatedHours: 36
  });

  const [crewForm, setCrewForm] = useState({
    name: '',
    position: 'Mualim I' as Crew['position'],
    seamanBookNo: '',
    vesselId: vessels[0]?.id || '',
    phone: '',
    status: 'Aktif Bertugas' as Crew['status']
  });

  const [clientForm, setClientForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    cargoType: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    if (subTab === 'vessels') {
      setVesselForm({ name: '', type: 'Container', capacityDWT: 10000, capacityTEU: 1000, builtYear: 2020, status: 'Berlayar', captain: '', currentLocation: 'Pelabuhan Utama' });
    } else if (subTab === 'routes') {
      setRouteForm({ code: 'JKT-XXX', origin: '', destination: '', distanceNauticalMiles: 400, estimatedHours: 36 });
    } else if (subTab === 'crew') {
      setCrewForm({ name: '', position: 'Mualim I', seamanBookNo: 'SB-', vesselId: vessels[0]?.id || '', phone: '', status: 'Aktif Bertugas' });
    } else if (subTab === 'clients') {
      setClientForm({ companyName: '', contactPerson: '', email: '', phone: '', address: '', cargoType: '' });
    }
    setShowModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    if (subTab === 'vessels') {
      setVesselForm({
        name: item.name,
        type: item.type,
        capacityDWT: item.capacityDWT,
        capacityTEU: item.capacityTEU || 500,
        builtYear: item.builtYear,
        status: item.status,
        captain: item.captain,
        currentLocation: item.currentLocation
      });
    } else if (subTab === 'routes') {
      setRouteForm({
        code: item.code,
        origin: item.origin,
        destination: item.destination,
        distanceNauticalMiles: item.distanceNauticalMiles,
        estimatedHours: item.estimatedHours
      });
    } else if (subTab === 'crew') {
      setCrewForm({
        name: item.name,
        position: item.position,
        seamanBookNo: item.seamanBookNo,
        vesselId: item.vesselId,
        phone: item.phone,
        status: item.status
      });
    } else if (subTab === 'clients') {
      setClientForm({
        companyName: item.companyName,
        contactPerson: item.contactPerson,
        email: item.email,
        phone: item.phone,
        address: item.address,
        cargoType: item.cargoType
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
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
      if (subTab === 'vessels') {
        const id = editingItem ? editingItem.id : 'v-' + Date.now();
        const payload: Vessel = {
          id,
          ...vesselForm,
          coordinates: editingItem ? editingItem.coordinates : { lat: -6.1, lng: 106.8 },
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'vessels', id), payload);
      } else if (subTab === 'routes') {
        const id = editingItem ? editingItem.id : 'r-' + Date.now();
        const payload: Route = { id, ...routeForm };
        await setDoc(doc(db, 'routes', id), payload);
      } else if (subTab === 'crew') {
        const id = editingItem ? editingItem.id : 'c-' + Date.now();
        const payload: Crew = { id, ...crewForm };
        await setDoc(doc(db, 'crew', id), payload);
      } else if (subTab === 'clients') {
        const id = editingItem ? editingItem.id : 'cl-' + Date.now();
        const payload: Client = { id, ...clientForm };
        await setDoc(doc(db, 'clients', id), payload);
      }
      setShowModal(false);
      onRefresh();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, subTab);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & SubTabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Manajemen Master Data</h2>
          <p className="text-slate-400 text-xs mt-1">Kelola data kapal, rute pelabuhan, kru, dan klien secara real-time.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Tambah Data Baru
        </button>
      </div>

      {/* SubTab navigation buttons */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setSubTab('vessels')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'vessels' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Ship className="w-4 h-4" /> Kapal ({vessels.length})
        </button>
        <button
          onClick={() => setSubTab('routes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'routes' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <RouteIcon className="w-4 h-4" /> Rute & Pelabuhan ({routes.length})
        </button>
        <button
          onClick={() => setSubTab('crew')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'crew' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Kru Kapal ({crew.length})
        </button>
        <button
          onClick={() => setSubTab('clients')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            subTab === 'clients' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Klien / Shipper ({clients.length})
        </button>
      </div>

      {/* Tables for each subtab */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden">
        {subTab === 'vessels' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Nama Kapal</th>
                  <th className="pb-3 px-3">Jenis</th>
                  <th className="pb-3 px-3">Kapasitas</th>
                  <th className="pb-3 px-3">Tahun</th>
                  <th className="pb-3 px-3">Kapten Utama</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {vessels.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">{v.name}</td>
                    <td className="py-3.5 px-3 text-slate-300">{v.type}</td>
                    <td className="py-3.5 px-3 text-slate-300">{v.capacityDWT.toLocaleString()} DWT</td>
                    <td className="py-3.5 px-3 text-slate-400">{v.builtYear}</td>
                    <td className="py-3.5 px-3 text-cyan-300">{v.captain}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        v.status === 'Berlayar' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        v.status === 'Sandar' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(v)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(v.id, 'vessels')} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subTab === 'routes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Kode Rute</th>
                  <th className="pb-3 px-3">Pelabuhan Asal</th>
                  <th className="pb-3 px-3">Pelabuhan Tujuan</th>
                  <th className="pb-3 px-3">Jarak (Mil Laut)</th>
                  <th className="pb-3 px-3">Estimasi Waktu</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {routes.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-cyan-400">{r.code}</td>
                    <td className="py-3.5 px-3 text-white">{r.origin}</td>
                    <td className="py-3.5 px-3 text-white">{r.destination}</td>
                    <td className="py-3.5 px-3 text-slate-300">{r.distanceNauticalMiles} NM</td>
                    <td className="py-3.5 px-3 text-slate-300">{r.estimatedHours} Jam</td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(r)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(r.id, 'routes')} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subTab === 'crew' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Nama Kru</th>
                  <th className="pb-3 px-3">Jabatan</th>
                  <th className="pb-3 px-3">No. Buku Pelaut</th>
                  <th className="pb-3 px-3">No. Telepon</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {crew.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">{c.name}</td>
                    <td className="py-3.5 px-3 text-cyan-300 font-medium">{c.position}</td>
                    <td className="py-3.5 px-3 text-slate-300">{c.seamanBookNo}</td>
                    <td className="py-3.5 px-3 text-slate-300">{c.phone}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(c)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(c.id, 'crew')} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subTab === 'clients' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Nama Perusahaan</th>
                  <th className="pb-3 px-3">Contact Person</th>
                  <th className="pb-3 px-3">Email & Telp</th>
                  <th className="pb-3 px-3">Jenis Kargo</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {clients.map(cl => (
                  <tr key={cl.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">{cl.companyName}</td>
                    <td className="py-3.5 px-3 text-slate-300">{cl.contactPerson}</td>
                    <td className="py-3.5 px-3 text-slate-300">{cl.email} / {cl.phone}</td>
                    <td className="py-3.5 px-3 text-cyan-300">{cl.cargoType}</td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(cl)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(cl.id, 'clients')} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">
                {editingItem ? 'Edit Data' : 'Tambah Data Baru'} ({subTab.toUpperCase()})
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {subTab === 'vessels' && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Nama Kapal</label>
                    <input
                      type="text"
                      required
                      value={vesselForm.name}
                      onChange={e => setVesselForm({ ...vesselForm, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      placeholder="Contoh: KM. Nusantara Jaya"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Jenis Kapal</label>
                      <select
                        value={vesselForm.type}
                        onChange={e => setVesselForm({ ...vesselForm, type: e.target.value as VesselType })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Container">Container</option>
                        <option value="Tanker">Tanker</option>
                        <option value="Bulk Carrier">Bulk Carrier</option>
                        <option value="Tug Boat">Tug Boat</option>
                        <option value="Passenger">Passenger</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Status</label>
                      <select
                        value={vesselForm.status}
                        onChange={e => setVesselForm({ ...vesselForm, status: e.target.value as VesselStatus })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Berlayar">Berlayar</option>
                        <option value="Sandar">Sandar</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Siaga">Siaga</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Kapasitas DWT</label>
                      <input
                        type="number"
                        required
                        value={vesselForm.capacityDWT}
                        onChange={e => setVesselForm({ ...vesselForm, capacityDWT: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Tahun Pembuatan</label>
                      <input
                        type="number"
                        required
                        value={vesselForm.builtYear}
                        onChange={e => setVesselForm({ ...vesselForm, builtYear: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Kapten Utama</label>
                    <input
                      type="text"
                      required
                      value={vesselForm.captain}
                      onChange={e => setVesselForm({ ...vesselForm, captain: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      placeholder="Contoh: Capt. Ahmad"
                    />
                  </div>
                </>
              )}

              {subTab === 'routes' && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Kode Rute</label>
                    <input
                      type="text"
                      required
                      value={routeForm.code}
                      onChange={e => setRouteForm({ ...routeForm, code: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      placeholder="Contoh: JKT-SBY"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Pelabuhan Asal</label>
                      <input
                        type="text"
                        required
                        value={routeForm.origin}
                        onChange={e => setRouteForm({ ...routeForm, origin: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Pelabuhan Tujuan</label>
                      <input
                        type="text"
                        required
                        value={routeForm.destination}
                        onChange={e => setRouteForm({ ...routeForm, destination: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Jarak (Mil Laut)</label>
                      <input
                        type="number"
                        required
                        value={routeForm.distanceNauticalMiles}
                        onChange={e => setRouteForm({ ...routeForm, distanceNauticalMiles: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Estimasi Waktu (Jam)</label>
                      <input
                        type="number"
                        required
                        value={routeForm.estimatedHours}
                        onChange={e => setRouteForm({ ...routeForm, estimatedHours: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {subTab === 'crew' && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Nama Lengkap Kru</label>
                    <input
                      type="text"
                      required
                      value={crewForm.name}
                      onChange={e => setCrewForm({ ...crewForm, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Jabatan</label>
                      <select
                        value={crewForm.position}
                        onChange={e => setCrewForm({ ...crewForm, position: e.target.value as Crew['position'] })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Kapten">Kapten</option>
                        <option value="Mualim I">Mualim I</option>
                        <option value="KKM (Kepala Kamar Mesin)">KKM</option>
                        <option value="Juru Mudi">Juru Mudi</option>
                        <option value="Koki">Koki</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">No. Buku Pelaut</label>
                      <input
                        type="text"
                        required
                        value={crewForm.seamanBookNo}
                        onChange={e => setCrewForm({ ...crewForm, seamanBookNo: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">No. Telepon</label>
                      <input
                        type="text"
                        required
                        value={crewForm.phone}
                        onChange={e => setCrewForm({ ...crewForm, phone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Status Tugas</label>
                      <select
                        value={crewForm.status}
                        onChange={e => setCrewForm({ ...crewForm, status: e.target.value as Crew['status'] })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Aktif Bertugas">Aktif Bertugas</option>
                        <option value="Cuti">Cuti</option>
                        <option value="Cadangan">Cadangan</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {subTab === 'clients' && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Nama Perusahaan / Shipper</label>
                    <input
                      type="text"
                      required
                      value={clientForm.companyName}
                      onChange={e => setClientForm({ ...clientForm, companyName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Contact Person</label>
                      <input
                        type="text"
                        required
                        value={clientForm.contactPerson}
                        onChange={e => setClientForm({ ...clientForm, contactPerson: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Jenis Kargo</label>
                      <input
                        type="text"
                        required
                        value={clientForm.cargoType}
                        onChange={e => setClientForm({ ...clientForm, cargoType: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Email</label>
                      <input
                        type="email"
                        required
                        value={clientForm.email}
                        onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">No. Telepon</label>
                      <input
                        type="text"
                        required
                        value={clientForm.phone}
                        onChange={e => setClientForm({ ...clientForm, phone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Alamat Perusahaan</label>
                    <input
                      type="text"
                      required
                      value={clientForm.address}
                      onChange={e => setClientForm({ ...clientForm, address: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl shadow-md"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
