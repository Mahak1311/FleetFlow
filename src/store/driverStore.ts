import { create } from 'zustand';
import { Driver, DriverStatus } from '@/types';

interface DriverState {
  drivers: Driver[];
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  updateDriverStatus: (id: string, status: DriverStatus) => void;
  getAvailableDrivers: () => Driver[];
  getDriverById: (id: string) => Driver | undefined;
}

const initialDrivers: Driver[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    licenseNumber: 'DL-MH12345',
    licenseCategory: 'Class A',
    licenseExpiry: '2026-09-15',
    status: 'On Duty',
    safetyScore: 98,
    tripCompletionRate: 99.2,
    phone: '+91-98765-43210',
    email: 'rajesh.kumar@fleetflow.in',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    licenseNumber: 'DL-DL67890',
    licenseCategory: 'Class A',
    licenseExpiry: '2026-12-20',
    status: 'On Trip',
    safetyScore: 95,
    tripCompletionRate: 98.5,
    phone: '+91-98765-43211',
    email: 'priya.sharma@fleetflow.in',
  },
  {
    id: '3',
    name: 'Amit Patel',
    licenseNumber: 'DL-GJ11223',
    licenseCategory: 'Class B',
    licenseExpiry: '2025-03-10',
    status: 'On Duty',
    safetyScore: 92,
    tripCompletionRate: 97.8,
    phone: '+91-98765-43212',
    email: 'amit.patel@fleetflow.in',
  },
  {
    id: '4',
    name: 'Sunita Reddy',
    licenseNumber: 'DL-TN44556',
    licenseCategory: 'Class A',
    licenseExpiry: '2027-01-05',
    status: 'On Duty',
    safetyScore: 99,
    tripCompletionRate: 99.8,
    phone: '+91-98765-43213',
    email: 'sunita.reddy@fleetflow.in',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    licenseNumber: 'DL-HR78901',
    licenseCategory: 'Class B',
    licenseExpiry: '2024-06-18',
    status: 'Suspended',
    safetyScore: 78,
    tripCompletionRate: 94.2,
    phone: '+91-98765-43214',
    email: 'vikram.singh@fleetflow.in',
  },
];

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: initialDrivers,
  
  addDriver: (driver) => {
    const newDriver = {
      ...driver,
      id: Date.now().toString(),
    };
    set((state) => ({ drivers: [...state.drivers, newDriver] }));
  },
  
  updateDriver: (id, updates) => {
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  },
  
  deleteDriver: (id) => {
    set((state) => ({
      drivers: state.drivers.filter((d) => d.id !== id),
    }));
  },
  
  updateDriverStatus: (id, status) => {
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === id ? { ...d, status } : d)),
    }));
  },
  
  getAvailableDrivers: () => {
    return get().drivers.filter((d) => d.status === 'On Duty');
  },
  
  getDriverById: (id) => {
    return get().drivers.find((d) => d.id === id);
  },
}));
