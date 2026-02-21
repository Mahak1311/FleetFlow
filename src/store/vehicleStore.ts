import { create } from 'zustand';
import { Vehicle, VehicleStatus } from '@/types';

interface VehicleState {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  updateVehicleStatus: (id: string, status: VehicleStatus) => void;
  getAvailableVehicles: () => Vehicle[];
  getVehicleById: (id: string) => Vehicle | undefined;
}

const initialVehicles: Vehicle[] = [
  {
    id: '1',
    vehicleId: 'MH-02-AB-1234',
    model: 'Tata Prima 4940.S',
    licensePlate: 'MH-02-AB-1234',
    maxCapacity: 26000,
    odometer: 145000,
    acquisitionCost: 4500000,
    status: 'Available',
    type: 'Truck',
    region: 'North',
    licenseExpiry: '2026-08-15',
    nextServiceDue: 150000,
  },
  {
    id: '2',
    vehicleId: 'DL-01-XY-5678',
    model: 'Ashok Leyland 4825',
    licensePlate: 'DL-01-XY-5678',
    maxCapacity: 24000,
    odometer: 89000,
    acquisitionCost: 4200000,
    status: 'On Trip',
    type: 'Truck',
    region: 'South',
    licenseExpiry: '2026-11-20',
    nextServiceDue: 95000,
  },
  {
    id: '3',
    vehicleId: 'KA-03-DE-9012',
    model: 'Mahindra Supro',
    licensePlate: 'KA-03-DE-9012',
    maxCapacity: 3500,
    odometer: 62000,
    acquisitionCost: 800000,
    status: 'In Shop',
    type: 'Van',
    region: 'East',
    licenseExpiry: '2024-12-10',
    nextServiceDue: 65000,
  },
  {
    id: '4',
    vehicleId: 'GJ-01-GH-3456',
    model: 'BharatBenz 4928',
    licensePlate: 'GJ-01-GH-3456',
    maxCapacity: 28000,
    odometer: 210000,
    acquisitionCost: 5000000,
    status: 'Available',
    type: 'Semi',
    region: 'West',
    licenseExpiry: '2026-05-18',
    nextServiceDue: 215000,
  },
  {
    id: '5',
    vehicleId: 'TN-07-JK-7890',
    model: 'Tata Ace Mega',
    licensePlate: 'TN-07-JK-7890',
    maxCapacity: 4000,
    odometer: 45000,
    acquisitionCost: 650000,
    status: 'Available',
    type: 'Van',
    region: 'North',
    licenseExpiry: '2027-01-05',
    nextServiceDue: 50000,
  },
  {
    id: '6',
    vehicleId: 'TRK-004',
    model: 'Peterbilt 579',
    licensePlate: 'MNO-2345',
    maxCapacity: 25000,
    odometer: 178000,
    acquisitionCost: 150000,
    status: 'Retired',
    type: 'Truck',
    region: 'South',
    licenseExpiry: '2023-09-12',
  },
];

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: initialVehicles,
  
  addVehicle: (vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: Date.now().toString(),
    };
    set((state) => ({ vehicles: [...state.vehicles, newVehicle] }));
  },
  
  updateVehicle: (id, updates) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  },
  
  deleteVehicle: (id) => {
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
    }));
  },
  
  updateVehicleStatus: (id, status) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, status } : v)),
    }));
  },
  
  getAvailableVehicles: () => {
    return get().vehicles.filter((v) => v.status === 'Available');
  },
  
  getVehicleById: (id) => {
    return get().vehicles.find((v) => v.id === id);
  },
}));
