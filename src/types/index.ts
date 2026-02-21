// User & Authentication Types
export type UserRole = 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Vehicle Types
export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';
export type VehicleType = 'Truck' | 'Van' | 'Semi' | 'Trailer';

export interface Vehicle {
  id: string;
  vehicleId: string;
  model: string;
  licensePlate: string;
  maxCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  type: VehicleType;
  region: string;
  lastServiceDate?: string;
  nextServiceDue?: number;
  licenseExpiry?: string;
}

// Driver Types
export type DriverStatus = 'On Duty' | 'On Trip' | 'Off Duty' | 'Suspended';
export type LicenseCategory = 'Class A' | 'Class B' | 'Class C';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiry: string;
  status: DriverStatus;
  safetyScore: number;
  tripCompletionRate: number;
  phone: string;
  email: string;
}

// Trip Types
export type TripStatus = 'Draft' | 'Dispatched' | 'On Route' | 'Completed' | 'Cancelled';

export interface Trip {
  id: string;
  tripNumber: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  origin: string;
  destination: string;
  status: TripStatus;
  estimatedRevenue: number;
  createdAt: string;
  dispatchedAt?: string;
  completedAt?: string;
  startOdometer?: number;
  endOdometer?: number;
  notes?: string;
}

// Maintenance Types
export type ServiceType = 'Oil Change' | 'Tire Replacement' | 'Brake Service' | 'Engine Repair' | 'Inspection' | 'Other';

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  serviceType: ServiceType;
  cost: number;
  date: string;
  odometer: number;
  description: string;
  performedBy: string;
  nextServiceDue?: number;
}

// Fuel Types
export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  date: string;
  odometer: number;
  location: string;
  pricePerLiter: number;
}

// Alert Types
export type AlertType = 'license_expiry' | 'maintenance_due' | 'cost_spike' | 'driver_compliance';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  entityId: string;
  createdAt: string;
  acknowledged: boolean;
}

// Financial Types
export interface FinancialMetrics {
  totalRevenue: number;
  totalOperationalCost: number;
  netProfit: number;
  costPerKm: number;
  fuelCosts: number;
  maintenanceCosts: number;
}

export interface VehicleROI {
  vehicleId: string;
  revenue: number;
  costs: number;
  roi: number;
  efficiency: number;
}
