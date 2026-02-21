import { apiClient } from './client';

export interface Vehicle {
  id: string;
  registration: string;
  type: string;
  make: string;
  model: string;
  year: number;
  status: string;
  currentDriverId?: string;
  mileage: number;
  lastService: string;
  nextService: string;
  purchasePrice: number;
  currentValue: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  experience: number;
  status: string;
  safetyScore: number;
  completionRate: number;
  totalTrips: number;
  onTimeDelivery: number;
  photoUrl?: string;
  address?: string;
  dutyStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  distance: number;
  startTime: string;
  endTime?: string;
  status: string;
  revenue: number;
  fuelCost: number;
  cargo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  driver?: Driver;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  fuelType: string;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  location: string;
  odometer: number;
  efficiency?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  scheduledDate: string;
  completedDate?: string;
  status: string;
  serviceProvider?: string;
  parts?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
}

// Vehicles API
export const vehiclesApi = {
  getAll: () => apiClient.get<Vehicle[]>('/vehicles'),
  getById: (id: string) => apiClient.get<Vehicle>(`/vehicles/${id}`),
  create: (data: Partial<Vehicle>) => apiClient.post<Vehicle>('/vehicles', data),
  update: (id: string, data: Partial<Vehicle>) => 
    apiClient.put<Vehicle>(`/vehicles/${id}`, data),
  delete: (id: string) => apiClient.delete(`/vehicles/${id}`),
};

// Drivers API
export const driversApi = {
  getAll: () => apiClient.get<Driver[]>('/drivers'),
  getById: (id: string) => apiClient.get<Driver>(`/drivers/${id}`),
  create: (data: Partial<Driver>) => apiClient.post<Driver>('/drivers', data),
  update: (id: string, data: Partial<Driver>) => 
    apiClient.put<Driver>(`/drivers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/drivers/${id}`),
};

// Trips API
export const tripsApi = {
  getAll: (status?: string) => 
    apiClient.get<Trip[]>(`/trips${status ? `?status=${status}` : ''}`),
  getById: (id: string) => apiClient.get<Trip>(`/trips/${id}`),
  create: (data: Partial<Trip>) => apiClient.post<Trip>('/trips', data),
  update: (id: string, data: Partial<Trip>) => 
    apiClient.put<Trip>(`/trips/${id}`, data),
  delete: (id: string) => apiClient.delete(`/trips/${id}`),
};

// Fuel API
export const fuelApi = {
  getAll: (vehicleId?: string) => 
    apiClient.get<FuelRecord[]>(`/fuel${vehicleId ? `?vehicleId=${vehicleId}` : ''}`),
  getById: (id: string) => apiClient.get<FuelRecord>(`/fuel/${id}`),
  create: (data: Partial<FuelRecord>) => apiClient.post<FuelRecord>('/fuel', data),
  update: (id: string, data: Partial<FuelRecord>) => 
    apiClient.put<FuelRecord>(`/fuel/${id}`, data),
  delete: (id: string) => apiClient.delete(`/fuel/${id}`),
};

// Maintenance API
export const maintenanceApi = {
  getAll: (params?: { vehicleId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.vehicleId) query.append('vehicleId', params.vehicleId);
    if (params?.status) query.append('status', params.status);
    return apiClient.get<Maintenance[]>(`/maintenance${query.toString() ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiClient.get<Maintenance>(`/maintenance/${id}`),
  create: (data: Partial<Maintenance>) => 
    apiClient.post<Maintenance>('/maintenance', data),
  update: (id: string, data: Partial<Maintenance>) => 
    apiClient.put<Maintenance>(`/maintenance/${id}`, data),
  delete: (id: string) => apiClient.delete(`/maintenance/${id}`),
};

// Auth API
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) => 
    apiClient.post<AuthResponse>('/auth/login', credentials),
  register: (data: RegisterData) => 
    apiClient.post<AuthResponse>('/auth/register', data),
};
