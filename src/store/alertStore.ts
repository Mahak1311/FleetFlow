import { create } from 'zustand';
import { Alert } from '@/types';

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'acknowledged'>) => void;
  acknowledgeAlert: (id: string) => void;
  getUnacknowledgedAlerts: () => Alert[];
}

const initialAlerts: Alert[] = [
  {
    id: '1',
    type: 'license_expiry',
    severity: 'critical',
    title: 'License Expired',
    message: 'Vehicle VAN-001 license plate expired on 2024-12-10',
    entityId: '3',
    createdAt: '2024-02-15T08:00:00Z',
    acknowledged: false,
  },
  {
    id: '2',
    type: 'maintenance_due',
    severity: 'high',
    title: 'Maintenance Due',
    message: 'Vehicle TRK-001 is approaching service interval (145000/150000 km)',
    entityId: '1',
    createdAt: '2024-02-16T10:00:00Z',
    acknowledged: false,
  },
  {
    id: '3',
    type: 'driver_compliance',
    severity: 'critical',
    title: 'Driver License Expiring Soon',
    message: 'Driver David Wilson license expires in 3 months',
    entityId: '5',
    createdAt: '2024-02-17T09:00:00Z',
    acknowledged: false,
  },
  {
    id: '4',
    type: 'cost_spike',
    severity: 'medium',
    title: 'Fuel Cost Increase',
    message: 'Fuel costs increased by 8% compared to last month',
    entityId: 'fuel',
    createdAt: '2024-02-18T11:00:00Z',
    acknowledged: false,
  },
];

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: initialAlerts,
  
  addAlert: (alert) => {
    const newAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      acknowledged: false,
    };
    set((state) => ({ alerts: [...state.alerts, newAlert] }));
  },
  
  acknowledgeAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, acknowledged: true } : a
      ),
    }));
  },
  
  getUnacknowledgedAlerts: () => {
    return get().alerts.filter((a) => !a.acknowledged);
  },
}));
