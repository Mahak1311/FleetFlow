import { useState, useMemo, useEffect } from 'react';
import { useTripStore } from '@/store/tripStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useDriverStore } from '@/store/driverStore';
import { useTranslation } from '@/lib/i18n';
import { StatusPill } from '@/components/ui/StatusPill';
import { 
  Search, TrendingUp, AlertTriangle, Truck, 
  MapPin, Circle, ArrowRight, Loader2, CheckCircle2, X 
} from 'lucide-react';
import { formatDate, isLicenseExpired } from '@/lib/utils';
import type { TripStatus } from '@/types';

export function TripsPage() {
  const trips = useTripStore((state) => state.trips);
  const addTrip = useTripStore((state) => state.addTrip);
  const { t } = useTranslation();
  
  const vehicles = useVehicleStore((state) => state.vehicles);
  const getVehicleById = useVehicleStore((state) => state.getVehicleById);
  const updateVehicleStatus = useVehicleStore((state) => state.updateVehicleStatus);
  
  const drivers = useDriverStore((state) => state.drivers);
  const getDriverById = useDriverStore((state) => state.getDriverById);
  const updateDriverStatus = useDriverStore((state) => state.updateDriverStatus);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [utilizationImpact, setUtilizationImpact] = useState(0);

  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
    origin: '',
    destination: '',
    estimatedRevenue: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Get available vehicles and drivers
  const availableVehicles = useMemo(() => 
    vehicles.filter(v => v.status === 'Available'), 
    [vehicles]
  );

  const availableDrivers = useMemo(() => 
    drivers.filter(d => d.status === 'On Duty'), 
    [drivers]
  );

  // Calculate estimated fuel cost based on distance (mock calculation)
  const estimatedFuelCost = useMemo(() => {
    if (formData.origin && formData.destination) {
      // Mock: ~$50-200 based on random distance
      return Math.floor(Math.random() * 150) + 50;
    }
    return 0;
  }, [formData.origin, formData.destination]);

  // Calculate utilization impact
  useEffect(() => {
    if (formData.vehicleId) {
      const totalVehicles = vehicles.length;
      const currentActive = vehicles.filter(v => v.status === 'On Trip').length;
      const newUtilization = Math.round(((currentActive + 1) / totalVehicles) * 100);
      setUtilizationImpact(newUtilization);
    } else {
      setUtilizationImpact(0);
    }
  }, [formData.vehicleId, vehicles]);

  // Filter trips
  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = 
        trip.tripNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchTerm, filterStatus]);

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    const vehicle = getVehicleById(formData.vehicleId);
    const driver = getDriverById(formData.driverId);

    if (!formData.vehicleId) {
      errors.vehicleId = 'Please select a vehicle';
    } else if (vehicle && Number(formData.cargoWeight) > vehicle.maxCapacity) {
      errors.cargoWeight = `Cargo exceeds capacity (${vehicle.maxCapacity} kg max)`;
    }

    if (!formData.driverId) {
      errors.driverId = 'Please select a driver';
    } else if (driver && driver.licenseExpiry && isLicenseExpired(driver.licenseExpiry)) {
      errors.driverId = 'Driver license has expired';
    }

    if (!formData.cargoWeight || Number(formData.cargoWeight) <= 0) {
      errors.cargoWeight = 'Valid cargo weight required';
    }

    if (!formData.origin.trim()) {
      errors.origin = 'Origin address required';
    }

    if (!formData.destination.trim()) {
      errors.destination = 'Destination address required';
    }

    if (!formData.estimatedRevenue || Number(formData.estimatedRevenue) <= 0) {
      errors.estimatedRevenue = 'Valid revenue estimate required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle dispatch
  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsDispatching(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newTrip = {
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      cargoWeight: Number(formData.cargoWeight),
      origin: formData.origin,
      destination: formData.destination,
      estimatedRevenue: Number(formData.estimatedRevenue),
      status: 'Dispatched' as TripStatus,
    };

    addTrip(newTrip);
    updateVehicleStatus(formData.vehicleId, 'On Trip');
    updateDriverStatus(formData.driverId, 'On Trip');

    setIsDispatching(false);
    setShowSuccess(true);

    // Get the newly created trip ID and highlight it
    const newTripId = trips[trips.length - 1]?.id || '';
    setTimeout(() => {
      setHighlightedRow(newTripId);
    }, 100);

    // Reset form
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        vehicleId: '',
        driverId: '',
        cargoWeight: '',
        origin: '',
        destination: '',
        estimatedRevenue: '',
      });
      setValidationErrors({});
      setTimeout(() => setHighlightedRow(null), 2000);
    }, 1500);
  };

  // Get selected vehicle capacity percentage
  const getVehicleCapacity = () => {
    if (!formData.vehicleId || !formData.cargoWeight) return 0;
    const vehicle = getVehicleById(formData.vehicleId);
    if (!vehicle) return 0;
    return Math.round((Number(formData.cargoWeight) / vehicle.maxCapacity) * 100);
  };

  // Get status icon
  const getStatusIcon = (status: TripStatus) => {
    switch (status) {
      case 'Draft':
        return <Circle size={8} className="text-gray-500 fill-gray-500 animate-pulse" />;
      case 'Dispatched':
        return <Circle size={8} className="text-blue-500 fill-blue-500 animate-pulse" />;
      case 'On Route':
        return <Circle size={8} className="text-blue-500 fill-blue-500 animate-ping" />;
      case 'Completed':
        return <Circle size={8} className="text-emerald-500 fill-emerald-500" />;
      case 'Cancelled':
        return <Circle size={8} className="text-red-500 fill-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Trip Dispatcher</h1>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Circle size={8} className="text-emerald-500 fill-emerald-500 animate-pulse" />
            Logistics command center • {trips.length} total trips
          </p>
        </div>
      </div>

      {/* Lifecycle Tracker */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-lg border border-dark-border">
        <div className="flex items-center justify-between">
          {[
            { status: 'Draft', count: trips.filter(t => t.status === 'Draft').length, color: 'gray' },
            { status: 'Dispatched', count: trips.filter(t => t.status === 'Dispatched').length, color: 'blue' },
            { status: 'On Route', count: trips.filter(t => t.status === 'On Route').length, color: 'blue' },
            { status: 'Completed', count: trips.filter(t => t.status === 'Completed').length, color: 'emerald' },
          ].map((stage, index) => (
            <div key={stage.status} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full border-2 ${
                  stage.count > 0 
                    ? `border-${stage.color}-500 bg-${stage.color}-500/20 ring-4 ring-${stage.color}-500/20` 
                    : 'border-dark-border bg-dark-bg'
                } flex items-center justify-center transition-all duration-300`}>
                  <span className={`text-lg font-bold ${
                    stage.count > 0 ? `text-${stage.color}-500` : 'text-gray-600'
                  }`}>
                    {stage.count}
                  </span>
                </div>
                <span className={`text-xs font-medium mt-2 ${
                  stage.count > 0 ? 'text-white' : 'text-gray-500'
                }`}>
                  {stage.status}
                </span>
              </div>
              {index < 3 && (
                <ArrowRight size={20} className="text-gray-600 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-dark-card rounded-2xl p-4 shadow-lg border border-dark-border">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.trips.title + '...'}
              className="w-full pl-12 pr-4 py-3 bg-dark-bg border-2 border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-2">
            {['all', 'Draft', 'Dispatched', 'On Route', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-dark-hover text-gray-400 hover:text-gray-300'
                }`}
              >
                {status === 'all' ? t.trips.allTrips : status}
              </button>
            ))}
          </div>

          {filterStatus !== 'all' && (
            <button
              onClick={() => setFilterStatus('all')}
              className="ml-auto px-3 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <X size={16} />
              {t.common.clear}
            </button>
          )}
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-dark-card rounded-2xl shadow-lg border border-dark-border overflow-hidden">
        <div className="p-6 border-b border-dark-border">
          <h2 className="text-xl font-bold text-white">{t.trips.title}</h2>
          <p className="text-sm text-gray-400 mt-1">Active logistics operations • {filteredTrips.length} trips shown</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.trips.title}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.vehicles.title}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.trips.origin}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.trips.status}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredTrips.map((trip, index) => {
                const vehicle = getVehicleById(trip.vehicleId);

                return (
                  <tr
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className={`group hover:bg-dark-hover transition-all duration-200 cursor-pointer ${
                      highlightedRow === trip.id
                        ? 'bg-emerald-500/10 ring-2 ring-emerald-500/30'
                        : ''
                    }`}
                    style={{
                      animation: `fadeIn 0.3s ease-out ${index * 50}ms both`,
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {trip.tripNumber}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatDate(trip.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Truck size={16} className="text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-300">{vehicle?.licensePlate || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-300">{trip.origin}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-300">{trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(trip.status)}
                        <StatusPill status={trip.status} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTrips.length === 0 && (
            <div className="text-center py-16">
              <Truck size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 font-medium">{t.trips.title}</p>
              <p className="text-sm text-gray-500 mt-1">{t.trips.addTrip}</p>
            </div>
          )}
        </div>
      </div>

      {/* New Trip Form */}
      <div className="bg-dark-card rounded-2xl shadow-lg border border-dark-border overflow-hidden">
        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-dark-bg/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="text-center">
              <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4 animate-scale-in" />
              <p className="text-xl font-bold text-white">Trip Dispatched!</p>
              <p className="text-sm text-gray-400 mt-2">Updating fleet status...</p>
            </div>
          </div>
        )}

        <div className="p-6 border-b border-dark-border">
          <h2 className="text-xl font-bold text-white">{t.trips.addTrip}</h2>
          <p className="text-sm text-gray-400 mt-1">{t.trips.title}</p>
        </div>

        <form onSubmit={handleDispatch} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Vehicle */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Vehicle *
              </label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                onFocus={() => setFocusedField('vehicleId')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                  validationErrors.vehicleId
                    ? 'border-red-500'
                    : focusedField === 'vehicleId'
                    ? 'border-blue-500 ring-4 ring-blue-500/20'
                    : 'border-dark-border'
                } rounded-xl text-white outline-none transition-all duration-200 appearance-none cursor-pointer`}
                required
              >
                <option value="">Choose a vehicle...</option>
                {availableVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.licensePlate} - {vehicle.type} ({vehicle.maxCapacity} kg)
                  </option>
                ))}
              </select>
              {validationErrors.vehicleId && (
                <p className="text-xs text-red-400 mt-1 animate-shake flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {validationErrors.vehicleId}
                </p>
              )}
              {formData.vehicleId && !validationErrors.vehicleId && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>{t.vehicles.capacity}</span>
                    <span>{getVehicleCapacity()}%</span>
                  </div>
                  <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        getVehicleCapacity() > 100
                          ? 'bg-red-500'
                          : getVehicleCapacity() > 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(getVehicleCapacity(), 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Cargo Weight */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cargo Weight (kg) *
              </label>
              <input
                type="number"
                value={formData.cargoWeight}
                onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                onFocus={() => setFocusedField('cargoWeight')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                  validationErrors.cargoWeight
                    ? 'border-red-500 shake'
                    : focusedField === 'cargoWeight'
                    ? 'border-blue-500 ring-4 ring-blue-500/20'
                    : 'border-dark-border'
                } rounded-xl text-white outline-none transition-all duration-200`}
                placeholder="Enter cargo weight"
                min="0"
                required
              />
              {validationErrors.cargoWeight && (
                <p className="text-xs text-red-400 mt-1 animate-shake flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {validationErrors.cargoWeight}
                </p>
              )}
            </div>

            {/* Select Driver */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.trips.driver} *
              </label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                onFocus={() => setFocusedField('driverId')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                  validationErrors.driverId
                    ? 'border-amber-500'
                    : focusedField === 'driverId'
                    ? 'border-blue-500 ring-4 ring-blue-500/20'
                    : 'border-dark-border'
                } rounded-xl text-white outline-none transition-all duration-200 appearance-none cursor-pointer`}
                required
              >
                <option value="">Choose a driver...</option>
                {availableDrivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} - {driver.status}
                  </option>
                ))}
              </select>
              {validationErrors.driverId && (
                <p className="text-xs text-amber-400 mt-1 animate-shake flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {validationErrors.driverId}
                </p>
              )}
            </div>

            {/* Origin Address */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.trips.origin} *
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                onFocus={() => setFocusedField('origin')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                  validationErrors.origin
                    ? 'border-red-500'
                    : focusedField === 'origin'
                    ? 'border-blue-500 ring-4 ring-blue-500/20'
                    : 'border-dark-border'
                } rounded-xl text-white outline-none transition-all duration-200`}
                placeholder="Enter origin address"
                required
              />
              {validationErrors.origin && (
                <p className="text-xs text-red-400 mt-1 animate-shake">{validationErrors.origin}</p>
              )}
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.trips.destination} *
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                onFocus={() => setFocusedField('destination')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                  validationErrors.destination
                    ? 'border-red-500'
                    : focusedField === 'destination'
                    ? 'border-blue-500 ring-4 ring-blue-500/20'
                    : 'border-dark-border'
                } rounded-xl text-white outline-none transition-all duration-200`}
                placeholder="Enter destination address"
                required
              />
              {validationErrors.destination && (
                <p className="text-xs text-red-400 mt-1 animate-shake">{validationErrors.destination}</p>
              )}
            </div>

            {/* Estimated Revenue */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Revenue ($) *
              </label>
              <input
                type="number"
                value={formData.estimatedRevenue}
                onChange={(e) => setFormData({ ...formData, estimatedRevenue: e.target.value })}
                onFocus={() => setFocusedField('estimatedRevenue')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                  validationErrors.estimatedRevenue
                    ? 'border-red-500'
                    : focusedField === 'estimatedRevenue'
                    ? 'border-blue-500 ring-4 ring-blue-500/20'
                    : 'border-dark-border'
                } rounded-xl text-white outline-none transition-all duration-200`}
                placeholder="Enter estimated revenue"
                min="0"
                required
              />
              {validationErrors.estimatedRevenue && (
                <p className="text-xs text-red-400 mt-1 animate-shake">{validationErrors.estimatedRevenue}</p>
              )}
            </div>
          </div>

          {/* Fleet Impact Preview */}
          {formData.vehicleId && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-blue-400" />
                <span className="text-sm font-semibold text-blue-400">Fleet Impact Preview</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Utilization after dispatch:</span>
                  <span className="text-white font-semibold ml-2">{utilizationImpact}%</span>
                </div>
                {estimatedFuelCost > 0 && (
                  <div>
                    <span className="text-gray-400">Estimated fuel cost:</span>
                    <span className="text-white font-semibold ml-2">${estimatedFuelCost}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  vehicleId: '',
                  driverId: '',
                  cargoWeight: '',
                  origin: '',
                  destination: '',
                  estimatedRevenue: '',
                });
                setValidationErrors({});
              }}
              className="px-6 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-border transition-all duration-200 font-medium"
              disabled={isDispatching}
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isDispatching}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isDispatching ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Dispatching Trip...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Confirm & Dispatch
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Trip Detail Panel (Slide-in) */}
      {selectedTrip && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setSelectedTrip(null)}
          ></div>
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-dark-card shadow-2xl z-50 animate-slide-in-right overflow-y-auto border-l border-dark-border">
            <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedTrip.tripNumber}</h2>
                  <p className="text-sm text-gray-400 mt-1">Trip details and timeline</p>
                </div>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="w-10 h-10 bg-dark-hover hover:bg-dark-border rounded-lg flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {getStatusIcon(selectedTrip.status)}
                  <StatusPill status={selectedTrip.status} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Route</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-emerald-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-white">Origin</p>
                          <p className="text-sm text-gray-400">{selectedTrip.origin}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-red-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-white">Destination</p>
                          <p className="text-sm text-gray-400">{selectedTrip.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Cargo</label>
                    <p className="text-sm text-white mt-1">{selectedTrip.cargoWeight} kg</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Revenue</label>
                    <p className="text-sm text-white mt-1">${selectedTrip.estimatedRevenue}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Created</label>
                    <p className="text-sm text-white mt-1">{formatDate(selectedTrip.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
