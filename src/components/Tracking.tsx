import React from 'react';
import { Compass, CheckCircle2, AlertTriangle, Navigation, Anchor, Bell } from 'lucide-react';
import { VoyageLog, MaritimeNotification } from '../types';

interface TrackingProps {
  voyages: VoyageLog[];
  notifications: MaritimeNotification[];
}

export const Tracking: React.FC<TrackingProps> = ({ voyages, notifications }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white">Histori Pelacakan Voyage & Notifikasi Otomatis</h2>
        <p className="text-slate-400 text-xs mt-1">Pantau timeline perjalanan armada kapal secara real-time dengan pemberitahuan sistem otomatis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voyage Tracking History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" /> Timeline Pelacakan Voyage
          </h3>

          <div className="space-y-4">
            {voyages.map(v => (
              <div key={v.id} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">{v.voyageNumber}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-medium">
                    {v.status}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{v.vesselName}</div>
                <div className="text-xs text-slate-300">{v.routeDescription}</div>

                {/* Timeline steps */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-[10px]">
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <div className="font-semibold text-emerald-400">Departure</div>
                    <div className="text-slate-400 mt-0.5">{new Date(v.departureDate).toLocaleDateString()}</div>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <div className="font-semibold text-cyan-400">En Route</div>
                    <div className="text-slate-400 mt-0.5">{v.weatherCondition}</div>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <div className="font-semibold text-slate-300">Est. Arrival</div>
                    <div className="text-slate-400 mt-0.5">{new Date(v.estimatedArrivalDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & System Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" /> Log Notifikasi Otomatis
          </h3>

          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
                <div className="mt-0.5">
                  {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {n.type === 'info' && <Anchor className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-500">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
