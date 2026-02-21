import { create } from 'zustand';
import { MaintenanceLog } from '@/types';

interface MaintenanceState {
  logs: MaintenanceLog[];
  addLog: (log: Omit<MaintenanceLog, 'id'>) => void;
  updateLog: (id: string, log: Partial<MaintenanceLog>) => void;
  deleteLog: (id: string) => void;
  getLogsByVehicle: (vehicleId: string) => MaintenanceLog[];
}

const initialLogs: MaintenanceLog[] = [
  {
    id: '1',
    vehicleId: '1',
    serviceType: 'Oil Change',
    cost: 350,
    date: '2024-01-15',
    odometer: 140000,
    description: 'Regular oil change and filter replacement',
    performedBy: 'Quick Service Center',
    nextServiceDue: 145000,
  },
  {
    id: '2',
    vehicleId: '2',
    serviceType: 'Tire Replacement',
    cost: 1800,
    date: '2024-02-01',
    odometer: 85000,
    description: 'Replaced all 6 tires',
    performedBy: 'Tire Pro',
    nextServiceDue: 165000,
  },
  {
    id: '3',
    vehicleId: '3',
    serviceType: 'Engine Repair',
    cost: 4500,
    date: '2024-02-18',
    odometer: 62000,
    description: 'Turbocharger replacement',
    performedBy: 'Mercedes Service Center',
  },
  {
    id: '4',
    vehicleId: '4',
    serviceType: 'Brake Service',
    cost: 1200,
    date: '2024-01-20',
    odometer: 205000,
    description: 'Brake pads and rotors replacement',
    performedBy: 'Brake Masters',
    nextServiceDue: 245000,
  },
];

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  logs: initialLogs,
  
  addLog: (log) => {
    const newLog = {
      ...log,
      id: Date.now().toString(),
    };
    set((state) => ({ logs: [...state.logs, newLog] }));
  },
  
  updateLog: (id, updates) => {
    set((state) => ({
      logs: state.logs.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  },
  
  deleteLog: (id) => {
    set((state) => ({
      logs: state.logs.filter((l) => l.id !== id),
    }));
  },
  
  getLogsByVehicle: (vehicleId) => {
    return get().logs.filter((l) => l.vehicleId === vehicleId);
  },
}));
