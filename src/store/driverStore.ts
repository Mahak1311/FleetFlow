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
    name: 'John Martinez',
    licenseNumber: 'CDL-12345',
    licenseCategory: 'Class A',
    licenseExpiry: '2026-09-15',
    status: 'On Duty',
    safetyScore: 98,
    tripCompletionRate: 99.2,
    phone: '555-0101',
    email: 'john.martinez@example.com',
  },
  {
    id: '2',
    name: 'Lisa Anderson',
    licenseNumber: 'CDL-67890',
    licenseCategory: 'Class A',
    licenseExpiry: '2026-12-20',
    status: 'On Trip',
    safetyScore: 95,
    tripCompletionRate: 98.5,
    phone: '555-0102',
    email: 'lisa.anderson@example.com',
  },
  {
    id: '3',
    name: 'Robert Brown',
    licenseNumber: 'CDL-11223',
    licenseCategory: 'Class B',
    licenseExpiry: '2025-03-10',
    status: 'On Duty',
    safetyScore: 92,
    tripCompletionRate: 97.8,
    phone: '555-0103',
    email: 'robert.brown@example.com',
  },
  {
    id: '4',
    name: 'Maria Garcia',
    licenseNumber: 'CDL-44556',
    licenseCategory: 'Class A',
    licenseExpiry: '2027-01-05',
    status: 'On Duty',
    safetyScore: 99,
    tripCompletionRate: 99.8,
    phone: '555-0104',
    email: 'maria.garcia@example.com',
  },
  {
    id: '5',
    name: 'David Wilson',
    licenseNumber: 'CDL-78901',
    licenseCategory: 'Class B',
    licenseExpiry: '2024-06-18',
    status: 'Suspended',
    safetyScore: 78,
    tripCompletionRate: 94.2,
    phone: '555-0105',
    email: 'david.wilson@example.com',
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
