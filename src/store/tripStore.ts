import { create } from 'zustand';
import { Trip, TripStatus } from '@/types';

interface TripState {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'tripNumber' | 'createdAt'>) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  updateTripStatus: (id: string, status: TripStatus) => void;
  completeTrip: (id: string, endOdometer: number) => void;
  getTripsByStatus: (status: TripStatus) => Trip[];
  getTripById: (id: string) => Trip | undefined;
}

const initialTrips: Trip[] = [
  {
    id: '1',
    tripNumber: 'TRP-2024-001',
    vehicleId: '2',
    driverId: '2',
    cargoWeight: 18000,
    origin: 'Mumbai, Maharashtra',
    destination: 'Pune, Maharashtra',
    status: 'On Route',
    estimatedRevenue: 85000,
    createdAt: '2024-02-15T08:00:00Z',
    dispatchedAt: '2024-02-15T09:00:00Z',
    startOdometer: 88500,
  },
  {
    id: '2',
    tripNumber: 'TRP-2024-002',
    vehicleId: '1',
    driverId: '1',
    cargoWeight: 22000,
    origin: 'Delhi, NCR',
    destination: 'Jaipur, Rajasthan',
    status: 'Draft',
    estimatedRevenue: 65000,
    createdAt: '2024-02-18T10:30:00Z',
  },
  {
    id: '3',
    tripNumber: 'TRP-2024-003',
    vehicleId: '5',
    driverId: '3',
    cargoWeight: 3000,
    origin: 'Bangalore, Karnataka',
    destination: 'Chennai, Tamil Nadu',
    status: 'Completed',
    estimatedRevenue: 45000,
    createdAt: '2024-02-10T07:00:00Z',
    dispatchedAt: '2024-02-10T08:00:00Z',
    completedAt: '2024-02-10T14:30:00Z',
    startOdometer: 44000,
    endOdometer: 44500,
  },
];

export const useTripStore = create<TripState>((set, get) => ({
  trips: initialTrips,
  
  addTrip: (trip) => {
    const tripCount = get().trips.length + 1;
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
      tripNumber: `TRP-2024-${tripCount.toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ trips: [...state.trips, newTrip] }));
  },
  
  updateTrip: (id, updates) => {
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },
  
  updateTripStatus: (id, status) => {
    const updates: Partial<Trip> = { status };
    
    if (status === 'Dispatched') {
      updates.dispatchedAt = new Date().toISOString();
    } else if (status === 'Completed') {
      updates.completedAt = new Date().toISOString();
    }
    
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },
  
  completeTrip: (id, endOdometer) => {
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'Completed' as TripStatus,
              endOdometer,
              completedAt: new Date().toISOString(),
            }
          : t
      ),
    }));
  },
  
  getTripsByStatus: (status) => {
    return get().trips.filter((t) => t.status === status);
  },
  
  getTripById: (id) => {
    return get().trips.find((t) => t.id === id);
  },
}));
