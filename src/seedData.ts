import { collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Vessel, Route, Crew, Client, Booking, VoyageLog, MaintenanceRecord, MaritimeNotification } from './types';

export async function seedInitialDataIfNeeded() {
  try {
    const vesselsSnap = await getDocs(collection(db, 'vessels')).catch(err => {
      handleFirestoreError(err, OperationType.LIST, 'vessels');
      return null;
    });

    if (vesselsSnap && vesselsSnap.empty) {
      console.log('Seeding initial maritime data...');

      // 1. Vessels
      const initialVessels: Vessel[] = [
        {
          id: 'v1',
          name: 'KM. Pelita Nusantara I',
          type: 'Container',
          capacityDWT: 15000,
          capacityTEU: 1200,
          builtYear: 2018,
          status: 'Berlayar',
          captain: 'Capt. Budi Santoso',
          currentLocation: 'Laut Jawa (Lat -5.2, Long 110.4)',
          coordinates: { lat: -5.2, lng: 110.4 },
          updatedAt: new Date().toISOString()
        },
        {
          id: 'v2',
          name: 'MT. Pertiwi Prima',
          type: 'Tanker',
          capacityDWT: 30000,
          builtYear: 2020,
          status: 'Berlayar',
          captain: 'Capt. Hendra Wijaya',
          currentLocation: 'Selat Makassar (Lat -2.1, Long 118.5)',
          coordinates: { lat: -2.1, lng: 118.5 },
          updatedAt: new Date().toISOString()
        },
        {
          id: 'v3',
          name: 'TB. Mahakam Perkasa 08',
          type: 'Tug Boat',
          capacityDWT: 4500,
          builtYear: 2019,
          status: 'Sandar',
          captain: 'Capt. Slamet Riyadi',
          currentLocation: 'Pelabuhan Tanjung Priok, Jakarta',
          coordinates: { lat: -6.1, lng: 106.88 },
          updatedAt: new Date().toISOString()
        },
        {
          id: 'v4',
          name: 'KM. Samudera Indah',
          type: 'Bulk Carrier',
          capacityDWT: 22000,
          builtYear: 2016,
          status: 'Maintenance',
          captain: 'Capt. Rahmat Hidayat',
          currentLocation: 'Galangan Kapal Surabaya',
          coordinates: { lat: -7.2, lng: 112.7 },
          updatedAt: new Date().toISOString()
        }
      ];

      for (const v of initialVessels) {
        await setDoc(doc(db, 'vessels', v.id), v);
      }

      // 2. Routes
      const initialRoutes: Route[] = [
        { id: 'r1', code: 'JKT-SBY', origin: 'Tanjung Priok, Jakarta', destination: 'Tanjung Perak, Surabaya', distanceNauticalMiles: 430, estimatedHours: 36 },
        { id: 'r2', code: 'SBY-MKS', origin: 'Tanjung Perak, Surabaya', destination: 'Soekarno-Hatta, Makassar', distanceNauticalMiles: 460, estimatedHours: 40 },
        { id: 'r3', code: 'JKT-BLN', origin: 'Tanjung Priok, Jakarta', destination: 'Belawan, Medan', distanceNauticalMiles: 1050, estimatedHours: 90 },
        { id: 'r4', code: 'SBY-BPN', origin: 'Tanjung Perak, Surabaya', destination: 'Semayang, Balikpapan', distanceNauticalMiles: 580, estimatedHours: 48 }
      ];
      for (const r of initialRoutes) {
        await setDoc(doc(db, 'routes', r.id), r);
      }

      // 3. Crew
      const initialCrew: Crew[] = [
        { id: 'c1', name: 'Capt. Budi Santoso', position: 'Kapten', seamanBookNo: 'SB-88231', vesselId: 'v1', phone: '081234567890', status: 'Aktif Bertugas' },
        { id: 'c2', name: 'Eko Prasetyo, S.Tr.Pel', position: 'Mualim I', seamanBookNo: 'SB-99120', vesselId: 'v1', phone: '081345678901', status: 'Aktif Bertugas' },
        { id: 'c3', name: 'Ir. Joko Widodo', position: 'KKM (Kepala Kamar Mesin)', seamanBookNo: 'SB-77341', vesselId: 'v1', phone: '081298765432', status: 'Aktif Bertugas' },
        { id: 'c4', name: 'Capt. Hendra Wijaya', position: 'Kapten', seamanBookNo: 'SB-44210', vesselId: 'v2', phone: '085233445566', status: 'Aktif Bertugas' },
      ];
      for (const c of initialCrew) {
        await setDoc(doc(db, 'crew', c.id), c);
      }

      // 4. Clients
      const initialClients: Client[] = [
        { id: 'cl1', companyName: 'PT. Nusantara Logistik Utama', contactPerson: 'Bapak Gunawan', email: 'gunawan@nusantaralog.co.id', phone: '021-5551234', address: 'Jl. Samudera No. 45, Jakarta Utara', cargoType: 'Container 20ft/40ft' },
        { id: 'cl2', companyName: 'PT. Energi Borneo Mandiri', contactPerson: 'Ibu Siska Dewi', email: 'siska@energiborneo.com', phone: '0542-778899', address: 'Jl. Minyak Raya No. 12, Balikpapan', cargoType: 'BBM & Crude Oil' },
        { id: 'cl3', companyName: 'PT. Semen Mega Jaya', contactPerson: 'Bapak Hartono', email: 'hartono@semenmegajaya.co.id', phone: '031-7482211', address: 'Jl. Industri Pelabuhan No. 8, Surabaya', cargoType: 'Bulk Semen & Clinker' }
      ];
      for (const cl of initialClients) {
        await setDoc(doc(db, 'clients', cl.id), cl);
      }

      // 5. Bookings
      const initialBookings: Booking[] = [
        {
          id: 'b1',
          bookingNumber: 'BKG-2026-001',
          clientId: 'cl1',
          clientName: 'PT. Nusantara Logistik Utama',
          vesselId: 'v1',
          vesselName: 'KM. Pelita Nusantara I',
          routeId: 'r1',
          routeDescription: 'Tanjung Priok, Jakarta -> Tanjung Perak, Surabaya',
          cargoDescription: 'Elektronik & Barang Konsumsi (50 Container)',
          weightTons: 1250,
          freightRateIDR: 450000000,
          paymentStatus: 'Lunas',
          bookingStatus: 'Dalam Perjalanan',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'b2',
          bookingNumber: 'BKG-2026-002',
          clientId: 'cl2',
          clientName: 'PT. Energi Borneo Mandiri',
          vesselId: 'v2',
          vesselName: 'MT. Pertiwi Prima',
          routeId: 'r4',
          routeDescription: 'Tanjung Perak, Surabaya -> Semayang, Balikpapan',
          cargoDescription: 'Solar Industri (HSD) 15,000 KL',
          weightTons: 14000,
          freightRateIDR: 1250000000,
          paymentStatus: 'DP (Down Payment)',
          bookingStatus: 'Dalam Perjalanan',
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
        }
      ];
      for (const b of initialBookings) {
        await setDoc(doc(db, 'bookings', b.id), b);
      }

      // 6. Voyage Logs
      const initialVoyages: VoyageLog[] = [
        {
          id: 'voy-1',
          voyageNumber: 'VOY-JKT-SBY-042',
          vesselId: 'v1',
          vesselName: 'KM. Pelita Nusantara I',
          routeId: 'r1',
          routeDescription: 'Jakarta - Surabaya',
          departureDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          estimatedArrivalDate: new Date(Date.now() + 86400000 * 1).toISOString(),
          fuelConsumedTons: 45.2,
          weatherCondition: 'Cerah',
          status: 'In Progress',
          notes: 'Pelayaran berjalan lancar sesuai jadwal. Kecepatan rata-rata 14.5 knot.'
        }
      ];
      for (const voy of initialVoyages) {
        await setDoc(doc(db, 'voyageLogs', voy.id), voy);
      }

      // 7. Maintenance
      const initialMaintenance: MaintenanceRecord[] = [
        {
          id: 'maint-1',
          vesselId: 'v4',
          vesselName: 'KM. Samudera Indah',
          dockingLocation: 'PT. Dok dan Perkapalan Surabaya',
          repairType: 'Overhaul Mesin Utama & Pengecatan Lambung',
          costIDR: 850000000,
          startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
          completionDate: new Date(Date.now() + 86400000 * 10).toISOString(),
          status: 'Proses Pengerjaan',
          technicianInCharge: 'Ir. Bambang Sugiarto'
        }
      ];
      for (const m of initialMaintenance) {
        await setDoc(doc(db, 'maintenance', m.id), m);
      }

      // 8. Notifications
      const initialNotifs: MaritimeNotification[] = [
        {
          id: 'n1',
          title: 'Keberangkatan KM. Pelita Nusantara I',
          message: 'Kapal telah bertolak dari Pelabuhan Tanjung Priok menuju Surabaya.',
          type: 'success',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          read: false
        },
        {
          id: 'n2',
          title: 'Peringatan Cuaca Ekstrim',
          message: 'Gelombang setinggi 2.5 meter terpantau di Selat Madura. Harap waspada.',
          type: 'warning',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          read: false
        }
      ];
      for (const n of initialNotifs) {
        await setDoc(doc(db, 'notifications', n.id), n);
      }

      console.log('Seed data successfully created!');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}
