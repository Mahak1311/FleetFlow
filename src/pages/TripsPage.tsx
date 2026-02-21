import React, { useState, useMemo } from 'react';
import { useTripStore } from '@/store/tripStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useDriverStore } from '@/store/driverStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { StatusPill } from '@/components/ui/StatusPill';
import { Plus, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDateTime, isLicenseExpired } from '@/lib/utils';
import type { TripStatus } from '@/types';

export function TripsPage() {
  const trips = useTripStore((state) => state.trips);
  const addTrip = useTripStore((state) => state.addTrip);
  const updateTripStatus = useTripStore((state) => state.updateTripStatus);
  const completeTrip = useTripStore((state) => state.completeTrip);
  
  const vehicles = useVehicleStore((state) => state.vehicles);
  const getAvailableVehicles = useVehicleStore((state) => state.getAvailableVehicles);
  const getVehicleById = useVehicleStore((state) => state.getVehicleById);
  const updateVehicleStatus = useVehicleStore((state) => state.updateVehicleStatus);
  
  const drivers = useDriverStore((state) => state.drivers);
  const getAvailableDrivers = useDriverStore((state) => state.getAvailableDrivers);
  const getDriverById = useDriverStore((state) => state.getDriverById);
  const updateDriverStatus = useDriverStore((state) => state.updateDriverStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completingTrip, setCompletingTrip] = useState<string | null>(null);
  const [endOdometer, setEndOdometer] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
    origin: '',
    destination: '',
    estimatedRevenue: '',
  });

  const tripsByStatus = useMemo(() => {
    return {
      draft: trips.filter((t) => t.status === 'Draft'),
      dispatched: trips.filter((t) => t.status === 'Dispatched'),
      onRoute: trips.filter((t) => t.status === 'On Route'),
      completed: trips.filter((t) => t.status === 'Completed'),
      cancelled: trips.filter((t) => t.status === 'Cancelled'),
    };
  }, [trips]);

  const validateTripCreation = () => {
    const errors: string[] = [];
    
    const vehicle = getVehicleById(formData.vehicleId);
    const driver = getDriverById(formData.driverId);
    const cargoWeight = Number(formData.cargoWeight);

    if (!vehicle) {
      errors.push('Please select a vehicle');
      return errors;
    }

    if (!driver) {
      errors.push('Please select a driver');
      return errors;
    }

    // Validate vehicle status
    if (vehicle.status !== 'Available') {
      errors.push(`Vehicle ${vehicle.vehicleId} is not available (Status: ${vehicle.status})`);
    }

    // Validate vehicle capacity
    if (cargoWeight > vehicle.maxCapacity) {
      errors.push(
        `Cargo weight (${cargoWeight} kg) exceeds vehicle capacity (${vehicle.maxCapacity} kg)`
      );
    }

    // Validate vehicle license
    if (vehicle.licenseExpiry && isLicenseExpired(vehicle.licenseExpiry)) {
      errors.push(`Vehicle ${vehicle.vehicleId} license has expired`);
    }

    // Validate driver status
    if (driver.status !== 'On Duty') {
      errors.push(`Driver ${driver.name} is not available (Status: ${driver.status})`);
    }

    // Validate driver license
    if (isLicenseExpired(driver.licenseExpiry)) {
      errors.push(`Driver ${driver.name} license has expired`);
    }

    return errors;
  };

  const handleOpenModal = () => {
    setFormData({
      vehicleId: '',
      driverId: '',
      cargoWeight: '',
      origin: '',
      destination: '',
      estimatedRevenue: '',
    });
    setValidationErrors([]);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateTripCreation();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    addTrip({
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      cargoWeight: Number(formData.cargoWeight),
      origin: formData.origin,
      destination: formData.destination,
      estimatedRevenue: Number(formData.estimatedRevenue),
      status: 'Draft',
    });

    setIsModalOpen(false);
  };

  const handleDispatch = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    updateTripStatus(tripId, 'Dispatched');
    updateVehicleStatus(trip.vehicleId, 'On Trip');
    updateDriverStatus(trip.driverId, 'On Trip');
  };

  const handleStartRoute = (tripId: string) => {
    updateTripStatus(tripId, 'On Route');
  };

  const handleOpenCompleteModal = (tripId: string) => {
    setCompletingTrip(tripId);
    setEndOdometer('');
    setIsCompleteModalOpen(true);
  };

  const handleCompleteTrip = () => {
    if (!completingTrip || !endOdometer) return;

    const trip = trips.find((t) => t.id === completingTrip);
    if (!trip) return;

    completeTrip(completingTrip, Number(endOdometer));
    updateVehicleStatus(trip.vehicleId, 'Available');
    updateDriverStatus(trip.driverId, 'On Duty');

    // Update vehicle odometer
    const vehicle = getVehicleById(trip.vehicleId);
    if (vehicle) {
      useVehicleStore.getState().updateVehicle(trip.vehicleId, {
        odometer: Number(endOdometer),
      });
    }

    setIsCompleteModalOpen(false);
    setCompletingTrip(null);
  };

  const handleCancelTrip = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    if (trip.status === 'Dispatched' || trip.status === 'On Route') {
      updateVehicleStatus(trip.vehicleId, 'Available');
      updateDriverStatus(trip.driverId, 'On Duty');
    }

    updateTripStatus(tripId, 'Cancelled');
  };

  const KanbanColumn = ({ title, trips, status }: { title: string; trips: typeof tripsByStatus.draft; status: TripStatus }) => {
    return (
      <div className="flex-1 min-w-[300px]">
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">{trips.length} trips</p>
        </div>
        <div className="space-y-3">
          {trips.map((trip) => {
            const vehicle = getVehicleById(trip.vehicleId);
            const driver = getDriverById(trip.driverId);

            return (
              <Card key={trip.id} dark className="hover:border-brand-blue/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">{trip.tripNumber}</p>
                      <StatusPill status={trip.status} variant="trip" className="mt-1" />
                    </div>
                    <p className="text-brand-emerald font-semibold">
                      {formatCurrency(trip.estimatedRevenue)}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-400">Vehicle</p>
                      <p className="text-white">{vehicle?.vehicleId} - {vehicle?.model}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Driver</p>
                      <p className="text-white">{driver?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Route</p>
                      <p className="text-white">{trip.origin} → {trip.destination}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Cargo</p>
                      <p className="text-white">{trip.cargoWeight} kg</p>
                    </div>
                  </div>

                  {status === 'Draft' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleDispatch(trip.id)}
                        className="flex-1"
                      >
                        Dispatch
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancelTrip(trip.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {status === 'Dispatched' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleStartRoute(trip.id)}
                        className="flex-1"
                      >
                        Start Route
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancelTrip(trip.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {status === 'On Route' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleOpenCompleteModal(trip.id)}
                      className="w-full"
                    >
                      Complete Trip
                    </Button>
                  )}

                  {(status === 'Completed' || status === 'Cancelled') && (
                    <p className="text-xs text-gray-400">
                      {trip.completedAt && formatDateTime(trip.completedAt)}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trip Dispatcher</h1>
          <p className="text-gray-400">Manage shipment lifecycle and dispatch workflow</p>
        </div>
        <Button onClick={handleOpenModal} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Create Trip</span>
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        <KanbanColumn title="Draft" trips={tripsByStatus.draft} status="Draft" />
        <KanbanColumn title="Dispatched" trips={tripsByStatus.dispatched} status="Dispatched" />
        <KanbanColumn title="On Route" trips={tripsByStatus.onRoute} status="On Route" />
        <KanbanColumn title="Completed" trips={tripsByStatus.completed} status="Completed" />
        <KanbanColumn title="Cancelled" trips={tripsByStatus.cancelled} status="Cancelled" />
      </div>

      {/* Create Trip Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Trip"
        maxWidth="lg"
        dark
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationErrors.length > 0 && (
            <div className="bg-brand-red/20 border border-brand-red/30 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle size={20} className="text-brand-red flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-brand-red font-semibold mb-2">Validation Errors:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-brand-red">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Vehicle"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              options={[
                { value: '', label: 'Select Vehicle' },
                ...getAvailableVehicles().map((v) => ({
                  value: v.id,
                  label: `${v.vehicleId} - ${v.model} (${v.maxCapacity} kg)`,
                })),
              ]}
              required
              dark
            />
            <Select
              label="Driver"
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              options={[
                { value: '', label: 'Select Driver' },
                ...getAvailableDrivers().map((d) => ({
                  value: d.id,
                  label: `${d.name} - ${d.licenseCategory}`,
                })),
              ]}
              required
              dark
            />
            <Input
              label="Origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="Los Angeles, CA"
              required
              dark
            />
            <Input
              label="Destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="Phoenix, AZ"
              required
              dark
            />
            <Input
              type="number"
              label="Cargo Weight (kg)"
              value={formData.cargoWeight}
              onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
              placeholder="18000"
              required
              dark
            />
            <Input
              type="number"
              label="Estimated Revenue ($)"
              value={formData.estimatedRevenue}
              onChange={(e) => setFormData({ ...formData, estimatedRevenue: e.target.value })}
              placeholder="4500"
              required
              dark
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Trip</Button>
          </div>
        </form>
      </Modal>

      {/* Complete Trip Modal */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Complete Trip"
        dark
      >
        <div className="space-y-4">
          <Input
            type="number"
            label="End Odometer (km)"
            value={endOdometer}
            onChange={(e) => setEndOdometer(e.target.value)}
            placeholder="Enter final odometer reading"
            required
            dark
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setIsCompleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleCompleteTrip} disabled={!endOdometer}>
              Complete Trip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
