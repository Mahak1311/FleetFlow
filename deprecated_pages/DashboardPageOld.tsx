import React, { useState, useMemo } from 'react';
import { useVehicleStore } from '@/store/vehicleStore';
import { useDriverStore } from '@/store/driverStore';
import { useTripStore } from '@/store/tripStore';
import { useAlertStore } from '@/store/alertStore';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Select } from '@/components/ui/Select';
import { Truck, Users, Package, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { formatNumber, formatCurrency, calculateDaysUntil } from '@/lib/utils';

export function DashboardPage() {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const drivers = useDriverStore((state) => state.drivers);
  const trips = useTripStore((state) => state.trips);
  const alerts = useAlertStore((state) => state.getUnacknowledgedAlerts());
  const acknowledgeAlert = useAlertStore((state) => state.acknowledgeAlert);

  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');

  // Calculate KPIs
  const kpis = useMemo(() => {
    const activeFleet = vehicles.filter((v) => v.status === 'On Trip').length;
    const inShop = vehicles.filter((v) => v.status === 'In Shop').length;
    const available = vehicles.filter((v) => v.status === 'Available').length;
    const totalActive = vehicles.filter((v) => v.status !== 'Retired').length;
    const utilization = totalActive > 0 ? Math.round((activeFleet / totalActive) * 100) : 0;
    const pendingCargo = trips.filter((t) => t.status === 'Draft' || t.status === 'Dispatched').length;

    return {
      activeFleet,
      inShop,
      available,
      utilization,
      pendingCargo,
    };
  }, [vehicles, trips]);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (vehicleTypeFilter !== 'All' && v.type !== vehicleTypeFilter) return false;
      if (statusFilter !== 'All' && v.status !== statusFilter) return false;
      if (regionFilter !== 'All' && v.region !== regionFilter) return false;
      return true;
    });
  }, [vehicles, vehicleTypeFilter, statusFilter, regionFilter]);

  const vehicleTypes = ['All', ...Array.from(new Set(vehicles.map((v) => v.type)))];
  const statuses = ['All', 'Available', 'On Trip', 'In Shop', 'Retired'];
  const regions = ['All', ...Array.from(new Set(vehicles.map((v) => v.region)))];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
        <p className="text-gray-400">Real-time fleet operations overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Fleet"
          value={kpis.activeFleet}
          subtitle="Vehicles On Trip"
          icon={<Truck size={24} className="text-brand-blue" />}
          dark
        />
        <KPICard
          title="Vehicles In Shop"
          value={kpis.inShop}
          subtitle="Under Maintenance"
          icon={<Activity size={24} className="text-brand-amber" />}
          dark
        />
        <KPICard
          title="Utilization Rate"
          value={`${kpis.utilization}%`}
          subtitle="Fleet Efficiency"
          icon={<TrendingUp size={24} className="text-brand-emerald" />}
          dark
        />
        <KPICard
          title="Pending Cargo"
          value={kpis.pendingCargo}
          subtitle="Awaiting Dispatch"
          icon={<Package size={24} className="text-brand-blue" />}
          dark
        />
      </div>

      {/* Utilization Gauge & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Utilization Gauge */}
        <Card dark glass className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle dark>Fleet Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <CircularProgress
              value={kpis.utilization}
              size={150}
              strokeWidth={12}
              label="Active"
              dark
            />
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-400">
                {kpis.activeFleet} of {kpis.activeFleet + kpis.available} vehicles in use
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card dark glass className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle dark>Critical Alerts</CardTitle>
            <div className="flex items-center space-x-2">
              <AlertTriangle size={20} className="text-brand-red" />
              <span className="text-brand-red font-semibold">{alerts.length}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No active alerts
                </p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            alert.severity === 'critical'
                              ? 'bg-brand-red'
                              : alert.severity === 'high'
                              ? 'bg-brand-amber'
                              : 'bg-brand-blue'
                          }`}
                        />
                        <span className="text-white font-medium text-sm">
                          {alert.title}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">{alert.message}</p>
                    </div>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="ml-3 px-2 py-1 text-xs text-brand-blue hover:text-blue-400 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card dark glass>
        <CardHeader>
          <CardTitle dark>Fleet Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select
              label="Vehicle Type"
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              options={vehicleTypes.map((type) => ({ value: type, label: type }))}
              dark
            />
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statuses.map((status) => ({ value: status, label: status }))}
              dark
            />
            <Select
              label="Region"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              options={regions.map((region) => ({ value: region, label: region }))}
              dark
            />
          </div>

          {/* Fleet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle) => {
              const hasAlert =
                vehicle.licenseExpiry && calculateDaysUntil(vehicle.licenseExpiry) < 90;

              return (
                <div
                  key={vehicle.id}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-brand-blue/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-semibold">{vehicle.vehicleId}</h4>
                      <p className="text-sm text-gray-400">{vehicle.model}</p>
                    </div>
                    {hasAlert && (
                      <AlertTriangle size={16} className="text-brand-amber" />
                    )}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Plate</span>
                      <span className="text-white">{vehicle.licensePlate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Odometer</span>
                      <span className="text-white">{formatNumber(vehicle.odometer)} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Capacity</span>
                      <span className="text-white">{formatNumber(vehicle.maxCapacity)} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Region</span>
                      <span className="text-white">{vehicle.region}</span>
                    </div>
                  </div>

                  <StatusPill status={vehicle.status} variant="vehicle" />
                </div>
              );
            })}
          </div>

          {filteredVehicles.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              No vehicles match the selected filters
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
