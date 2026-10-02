import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { seedInitialDataIfNeeded } from './seedData';
import { UserProfile, Vessel, Route, Crew, Client, Booking, VoyageLog, MaintenanceRecord, MaritimeNotification } from './types';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MasterData } from './components/MasterData';
import { Transactions } from './components/Transactions';
import { Reports } from './components/Reports';
import { Tracking } from './components/Tracking';
import { Anchor } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pelita_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);

  // Firestore data states
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [voyages, setVoyages] = useState<VoyageLog[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [notifications, setNotifications] = useState<MaritimeNotification[]>([]);

  useEffect(() => {
    async function init() {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.warn('Auth fallback:', err);
      }
      await seedInitialDataIfNeeded();
      setIsInitialized(true);
    }
    init();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Real-time snapshot listeners for all collections
    const unsubVessels = onSnapshot(collection(db, 'vessels'), (snapshot) => {
      setVessels(snapshot.docs.map(doc => doc.data() as Vessel));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'vessels'));

    const unsubRoutes = onSnapshot(collection(db, 'routes'), (snapshot) => {
      setRoutes(snapshot.docs.map(doc => doc.data() as Route));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'routes'));

    const unsubCrew = onSnapshot(collection(db, 'crew'), (snapshot) => {
      setCrew(snapshot.docs.map(doc => doc.data() as Crew));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'crew'));

    const unsubClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
      setClients(snapshot.docs.map(doc => doc.data() as Client));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'clients'));

    const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      setBookings(snapshot.docs.map(doc => doc.data() as Booking));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'bookings'));

    const unsubVoyages = onSnapshot(collection(db, 'voyageLogs'), (snapshot) => {
      setVoyages(snapshot.docs.map(doc => doc.data() as VoyageLog));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'voyageLogs'));

    const unsubMaint = onSnapshot(collection(db, 'maintenance'), (snapshot) => {
      setMaintenance(snapshot.docs.map(doc => doc.data() as MaintenanceRecord));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'maintenance'));

    const unsubNotifs = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      setNotifications(snapshot.docs.map(doc => doc.data() as MaritimeNotification));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'notifications'));

    return () => {
      unsubVessels();
      unsubRoutes();
      unsubCrew();
      unsubClients();
      unsubBookings();
      unsubVoyages();
      unsubMaint();
      unsubNotifs();
    };
  }, [isInitialized]);

  const handleLogout = () => {
    localStorage.removeItem('pelita_user');
    setUser(null);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 gap-4">
        <Anchor className="w-12 h-12 animate-bounce" />
        <p className="text-sm font-semibold tracking-wide">Menghubungkan ke Database Real-Time PelitaNusantara...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        user={user}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard vessels={vessels} bookings={bookings} voyages={voyages} maintenance={maintenance} />
            )}
            {activeTab === 'master' && (
              <MasterData
                vessels={vessels}
                routes={routes}
                crew={crew}
                clients={clients}
                onRefresh={() => {}}
              />
            )}
            {activeTab === 'transactions' && (
              <Transactions
                bookings={bookings}
                voyages={voyages}
                maintenance={maintenance}
                vessels={vessels}
                clients={clients}
                routes={routes}
                onRefresh={() => {}}
              />
            )}
            {activeTab === 'reports' && (
              <Reports
                bookings={bookings}
                maintenance={maintenance}
                vessels={vessels}
              />
            )}
            {activeTab === 'tracking' && (
              <Tracking
                voyages={voyages}
                notifications={notifications}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
