export type UserRole = 'admin' | 'ops' | 'finance' | 'captain';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  vesselAssigned?: string;
}

export type VesselType = 'Container' | 'Tanker' | 'Bulk Carrier' | 'Tug Boat' | 'Passenger';
export type VesselStatus = 'Berlayar' | 'Sandar' | 'Maintenance' | 'Siaga';

export interface Vessel {
  id: string;
  name: string;
  type: VesselType;
  capacityDWT: number;
  capacityTEU?: number;
  builtYear: number;
  status: VesselStatus;
  captain: string;
  currentLocation: string;
  coordinates: { lat: number; lng: number };
  updatedAt: string;
}

export interface Route {
  id: string;
  code: string;
  origin: string;
  destination: string;
  distanceNauticalMiles: number;
  estimatedHours: number;
}

export interface Crew {
  id: string;
  name: string;
  position: 'Kapten' | 'Mualim I' | 'KKM (Kepala Kamar Mesin)' | 'Juru Mudi' | 'Koki' | 'Engineer';
  seamanBookNo: string;
  vesselId: string;
  phone: string;
  status: 'Aktif Bertugas' | 'Cuti' | 'Cadangan';
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  cargoType: string;
}

export type BookingStatus = 'Menunggu Muat' | 'Dalam Perjalanan' | 'Tiba di Tujuan' | 'Bongkar Selesai' | 'Dibatalkan';
export type PaymentStatus = 'Lunas' | 'DP (Down Payment)' | 'Belum Bayar';

export interface Booking {
  id: string;
  bookingNumber: string;
  clientId: string;
  clientName: string;
  vesselId: string;
  vesselName: string;
  routeId: string;
  routeDescription: string;
  cargoDescription: string;
  weightTons: number;
  freightRateIDR: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
}

export interface VoyageLog {
  id: string;
  voyageNumber: string;
  vesselId: string;
  vesselName: string;
  routeId: string;
  routeDescription: string;
  departureDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate?: string;
  fuelConsumedTons: number;
  weatherCondition: 'Cerah' | 'Berawan' | 'Hujan Ringan' | 'Badai / Ombak Besar';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
  notes: string;
}

export interface MaintenanceRecord {
  id: string;
  vesselId: string;
  vesselName: string;
  dockingLocation: string;
  repairType: string;
  costIDR: number;
  startDate: string;
  completionDate: string;
  status: 'Terjadwal' | 'Proses Pengerjaan' | 'Selesai';
  technicianInCharge: string;
}

export interface MaritimeNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  timestamp: string;
  read: boolean;
}
