import { create } from 'zustand';
import { FuelLog } from '@/types';

interface FuelState {
  logs: FuelLog[];
  addLog: (log: Omit<FuelLog, 'id' | 'pricePerLiter'>) => void;
  updateLog: (id: string, log: Partial<FuelLog>) => void;
  deleteLog: (id: string) => void;
  getLogsByVehicle: (vehicleId: string) => FuelLog[];
}

const initialLogs: FuelLog[] = [
  {
    id: '1',
    vehicleId: '1',
    liters: 380,
    cost: 520,
    date: '2024-02-10',
    odometer: 144000,
    location: 'Shell Station - Highway 5',
    pricePerLiter: 1.37,
  },
  {
    id: '2',
    vehicleId: '2',
    liters: 420,
    cost: 588,
    date: '2024-02-12',
    odometer: 88000,
    location: 'BP Station - I-10',
    pricePerLiter: 1.4,
  },
  {
    id: '3',
    vehicleId: '3',
    liters: 65,
    cost: 85,
    date: '2024-02-08',
    odometer: 61500,
    location: 'Mobil - Downtown',
    pricePerLiter: 1.31,
  },
  {
    id: '4',
    vehicleId: '4',
    liters: 450,
    cost: 639,
    date: '2024-02-15',
    odometer: 209000,
    location: 'Chevron - Route 66',
    pricePerLiter: 1.42,
  },
  {
    id: '5',
    vehicleId: '1',
    liters: 390,
    cost: 531,
    date: '2024-02-18',
    odometer: 145000,
    location: 'Shell Station - Highway 5',
    pricePerLiter: 1.36,
  },
];

export const useFuelStore = create<FuelState>((set, get) => ({
  logs: initialLogs,
  
  addLog: (log) => {
    const pricePerLiter = log.cost / log.liters;
    const newLog = {
      ...log,
      id: Date.now().toString(),
      pricePerLiter: Number(pricePerLiter.toFixed(2)),
    };
    set((state) => ({ logs: [...state.logs, newLog] }));
  },
  
  updateLog: (id, updates) => {
    set((state) => ({
      logs: state.logs.map((l) => {
        if (l.id === id) {
          const updated = { ...l, ...updates };
          if (updates.cost || updates.liters) {
            updated.pricePerLiter = Number((updated.cost / updated.liters).toFixed(2));
          }
          return updated;
        }
        return l;
      }),
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
