import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicleStore } from '@/store/vehicleStore';
import { useDriverStore } from '@/store/driverStore';
import { useTripStore } from '@/store/tripStore';
import { useAlertStore } from '@/store/alertStore';
import { StatusPill } from '@/components/ui/StatusPill';
import { Truck, Users, MapPin, Wrench, TrendingUp, AlertTriangle, ArrowUp, ArrowDown, Clock, ChevronRight, Plus, Filter, X, Circle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function DashboardPage() {
  const navigate = useNavigate();
  
  // Store hooks - currently using Zustand with mock data
  // TODO: Replace with API calls to backend database (MongoDB/PostgreSQL)
  const vehicles = useVehicleStore((state) => state.vehicles);
  const drivers = useDriverStore((state) => state.drivers);
  const trips = useTripStore((state) => state.trips);
  const alerts = useAlertStore((state) => state.alerts);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Animated counter states
  const [animatedActiveFleet, setAnimatedActiveFleet] = useState(0);
  const [animatedAlerts, setAnimatedAlerts] = useState(0);
  const [animatedCargo, setAnimatedCargo] = useState(0);
  const [animatedUtilization, setAnimatedUtilization] = useState(0);

  // Calculate KPIs
  const activeFleet = useMemo(() => vehicles.filter((v) => v.status === 'On Trip').length, [vehicles]);
  const maintenanceAlerts = useMemo(() => alerts.filter((a) => a.type === 'maintenance_due' && a.severity === 'high').length, [alerts]);
  const pendingCargo = useMemo(() => trips.filter((t) => t.status === 'Draft').length, [trips]);
  const utilizationRate = useMemo(() => {
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === 'On Trip').length;
    return totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;
  }, [vehicles]);

  // Animate counters on mount
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedActiveFleet(Math.floor(activeFleet * progress));
      setAnimatedAlerts(Math.floor(maintenanceAlerts * progress));
      setAnimatedCargo(Math.floor(pendingCargo * progress));
      setAnimatedUtilization(Math.floor(utilizationRate * progress));

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedActiveFleet(activeFleet);
        setAnimatedAlerts(maintenanceAlerts);
        setAnimatedCargo(pendingCargo);
        setAnimatedUtilization(utilizationRate);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [activeFleet, maintenanceAlerts, pendingCargo, utilizationRate]);

  // Update timestamp every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter trips based on vehicle status and type
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const vehicle = vehicles.find(v => v.id === trip.vehicleId);
      if (!vehicle) return false;
      
      const statusMatch = filterStatus === 'all' || vehicle.status === filterStatus;
      const typeMatch = filterType === 'all' || vehicle.type === filterType;
      
      return statusMatch && typeMatch;
    });
  }, [trips, vehicles, filterStatus, filterType]);

  // Recent trips
  const recentTrips = useMemo(() => {
    return [...filteredTrips]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [filteredTrips]);

  const criticalAlerts = useMemo(() => {
    return alerts.filter(a => a.severity === 'high').slice(0, 5);
  }, [alerts]);

  const getTimeSince = () => {
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  };

  const statusFilters = [
    { value: 'all', label: 'All Status' },
    { value: 'On Trip', label: 'On Trip' },
    { value: 'Available', label: 'Available' },
    { value: 'In Shop', label: 'In Shop' },
  ];

  const typeFilters = [
    { value: 'all', label: 'All Types' },
    { value: 'Truck', label: 'Trucks' },
    { value: 'Van', label: 'Vans' },
    { value: 'Container', label: 'Containers' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Fleet Flow</h1>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Clock size={14} />
              Last updated {getTimeSince()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAlertPanel(!showAlertPanel)}
              className="relative px-4 py-2 bg-dark-card border border-dark-border text-gray-300 rounded-xl hover:bg-dark-hover hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <AlertTriangle size={18} />
              Alerts
              {criticalAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {criticalAlerts.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/trips')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={18} />
              New Trip
            </button>
            <button 
              onClick={() => navigate('/vehicles')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={18} />
              New Vehicle
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Fleet */}
          <div className="bg-dark-card rounded-2xl p-6 shadow-lg border border-dark-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '0ms'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Truck size={24} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <ArrowUp size={16} />
                12%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400 font-medium">Active Fleet</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{animatedActiveFleet}</p>
                <span className="text-sm text-gray-500">/ {vehicles.length}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Circle size={8} className="text-emerald-500 fill-emerald-500 animate-pulse" />
                <span className="text-xs text-gray-500">Vehicles on the road</span>
              </div>
            </div>
          </div>

          {/* Maintenance Alerts */}
          <div className={`bg-dark-card rounded-2xl p-6 shadow-lg border border-dark-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up ${maintenanceAlerts > 0 ? 'ring-2 ring-amber-500/30' : ''}`} style={{animationDelay: '100ms'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Wrench size={24} className={`text-amber-600 ${maintenanceAlerts > 0 ? 'animate-pulse' : ''}`} />
              </div>
              {maintenanceAlerts > 0 && (
                <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                  <AlertTriangle size={16} />
                  Critical
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400 font-medium">Maintenance Alerts</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{animatedAlerts}</p>
                <span className="text-sm text-gray-500">pending</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Circle size={8} className="text-amber-500 fill-amber-500" />
                <span className="text-xs text-gray-500">Vehicles in shop</span>
              </div>
            </div>
          </div>

          {/* Pending Cargo */}
          <div className="bg-dark-card rounded-2xl p-6 shadow-lg border border-dark-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '200ms'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <MapPin size={24} className="text-emerald-600" />
              </div>
              <div className="flex items-center gap-1 text-gray-600 text-sm font-medium">
                <ArrowDown size={16} />
                5%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400 font-medium">Pending Cargo</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{animatedCargo}</p>
                <span className="text-sm text-gray-500">trips</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Circle size={8} className="text-gray-400 fill-gray-400" />
                <span className="text-xs text-gray-500">Waiting for driver</span>
              </div>
            </div>
          </div>

          {/* Utilization Rate */}
          <div className="bg-dark-card rounded-2xl p-6 shadow-lg border border-dark-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: '300ms'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <ArrowUp size={16} />
                8%
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-400 font-medium">Utilization Rate</p>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-white">{animatedUtilization}%</p>
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="#3B82F6" 
                      strokeWidth="6" 
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - animatedUtilization / 100)}`}
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Circle size={8} className="text-blue-500 fill-blue-500" />
                <span className="text-xs text-gray-500">Fleet efficiency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-card rounded-2xl p-4 shadow-lg border border-dark-border flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-gray-300 font-medium">
            <Filter size={18} />
            <span className="text-sm">Filter by:</span>
          </div>
          
          {/* Status Pills */}
          <div className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filterStatus === filter.value
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-hover/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-dark-border"></div>

          {/* Type Pills */}
          <div className="flex gap-2">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filterType === filter.value
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-hover/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {(filterStatus !== 'all' || filterType !== 'all') && (
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterType('all');
              }}
              className="ml-auto px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Trips Table */}
        <div className="bg-dark-card rounded-2xl shadow-lg border border-dark-border overflow-hidden">
          <div className="p-6 border-b border-dark-border">
            <h2 className="text-xl font-bold text-white">Recent Trips</h2>
            <p className="text-sm text-gray-400 mt-1">Latest trip activity across your fleet • {recentTrips.length} trips shown</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg border-b border-dark-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {recentTrips.map((trip, index) => {
                  const vehicle = vehicles.find(v => v.id === trip.vehicleId);
                  const driver = drivers.find(d => d.id === trip.driverId);
                  
                  return (
                    <tr 
                      key={trip.id}
                      className="hover:bg-dark-hover transition-colors duration-150 cursor-pointer group"
                      style={{
                        animation: `fadeIn 0.3s ease-out ${index * 50}ms both`
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                            {trip.origin} → {trip.destination}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {formatDate(trip.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Truck size={16} className="text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-300">{vehicle?.licensePlate || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <Users size={16} className="text-emerald-600" />
                          </div>
                          <span className="text-sm text-gray-300">{driver?.name || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={trip.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors group-hover:translate-x-1 duration-200">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alert Panel */}
      {showAlertPanel && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setShowAlertPanel(false)}
          ></div>
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 animate-slide-in-right overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Critical Alerts</h2>
                <button 
                  onClick={() => setShowAlertPanel(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">{criticalAlerts.length} items require attention</p>
            </div>
            
            <div className="p-6 space-y-4">
              {criticalAlerts.map((alert, index) => (
                <div 
                  key={alert.id}
                  className="p-4 bg-red-50 border border-red-100 rounded-xl animate-slide-up"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={20} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{alert.message}</h3>
                      <p className="text-xs text-gray-600 mt-1">{formatDate(alert.createdAt)}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                          {alert.type}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">
                          High Priority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {criticalAlerts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp size={32} className="text-emerald-600" />
                  </div>
                  <p className="text-gray-600 font-medium">All Clear!</p>
                  <p className="text-sm text-gray-500 mt-1">No critical alerts at the moment</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
