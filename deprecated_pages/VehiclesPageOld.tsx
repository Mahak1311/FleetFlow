import React, { useState } from 'react';
import { useVehicleStore } from '@/store/vehicleStore';
import { useFuelStore } from '@/store/fuelStore';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { StatusPill } from '@/components/ui/StatusPill';
import { Plus, Search, Edit, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatNumber, formatCurrency, formatDate, calculateDaysUntil, isLicenseExpired } from '@/lib/utils';
import type { Vehicle, VehicleType, VehicleStatus } from '@/types';

export function VehiclesPage() {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const addVehicle = useVehicleStore((state) => state.addVehicle);
  const updateVehicle = useVehicleStore((state) => state.updateVehicle);
  const deleteVehicle = useVehicleStore((state) => state.deleteVehicle);
  
  const fuelLogs = useFuelStore((state) => state.logs);
  const maintenanceLogs = useMaintenanceStore((state) => state.logs);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    vehicleId: '',
    model: '',
    licensePlate: '',
    maxCapacity: '',
    odometer: '',
    acquisitionCost: '',
    status: 'Available' as VehicleStatus,
    type: 'Truck' as VehicleType,
    region: '',
    licenseExpiry: '',
    nextServiceDue: '',
  });

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        vehicleId: vehicle.vehicleId,
        model: vehicle.model,
        licensePlate: vehicle.licensePlate,
        maxCapacity: vehicle.maxCapacity.toString(),
        odometer: vehicle.odometer.toString(),
        acquisitionCost: vehicle.acquisitionCost.toString(),
        status: vehicle.status,
        type: vehicle.type,
        region: vehicle.region,
        licenseExpiry: vehicle.licenseExpiry || '',
        nextServiceDue: vehicle.nextServiceDue?.toString() || '',
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        vehicleId: '',
        model: '',
        licensePlate: '',
        maxCapacity: '',
        odometer: '',
        acquisitionCost: '',
        status: 'Available',
        type: 'Truck',
        region: '',
        licenseExpiry: '',
        nextServiceDue: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleData = {
      vehicleId: formData.vehicleId,
      model: formData.model,
      licensePlate: formData.licensePlate,
      maxCapacity: Number(formData.maxCapacity),
      odometer: Number(formData.odometer),
      acquisitionCost: Number(formData.acquisitionCost),
      status: formData.status,
      type: formData.type,
      region: formData.region,
      licenseExpiry: formData.licenseExpiry || undefined,
      nextServiceDue: formData.nextServiceDue ? Number(formData.nextServiceDue) : undefined,
    };

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, vehicleData);
    } else {
      addVehicle(vehicleData);
    }

    setIsModalOpen(false);
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailOpen(true);
  };

  const getVehicleFuelCost = (vehicleId: string) => {
    return fuelLogs
      .filter((log) => log.vehicleId === vehicleId)
      .reduce((sum, log) => sum + log.cost, 0);
  };

  const getVehicleMaintenanceCost = (vehicleId: string) => {
    return maintenanceLogs
      .filter((log) => log.vehicleId === vehicleId)
      .reduce((sum, log) => sum + log.cost, 0);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Vehicle Registry</h1>
          <p className="text-gray-400">Manage your fleet assets and lifecycle</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Vehicle</span>
        </Button>
      </div>

      {/* Search & Stats */}
      <Card dark glass>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search vehicles by ID, model, or plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                dark
              />
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="text-gray-400">Total:</span>
                <span className="ml-2 text-white font-semibold">{vehicles.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Active:</span>
                <span className="ml-2 text-white font-semibold">
                  {vehicles.filter((v) => v.status !== 'Retired').length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card dark glass>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Vehicle ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">License Plate</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Odometer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Capacity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Region</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => {
                  const hasLicenseAlert = vehicle.licenseExpiry && 
                    (isLicenseExpired(vehicle.licenseExpiry) || calculateDaysUntil(vehicle.licenseExpiry) < 90);
                  
                  return (
                    <tr
                      key={vehicle.id}
                      className="border-b border-dark-border hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(vehicle)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{vehicle.vehicleId}</span>
                          {hasLicenseAlert && (
                            <AlertTriangle size={14} className="text-brand-amber" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{vehicle.model}</td>
                      <td className="py-3 px-4 text-gray-300">{vehicle.type}</td>
                      <td className="py-3 px-4 text-gray-300">{vehicle.licensePlate}</td>
                      <td className="py-3 px-4 text-gray-300">{formatNumber(vehicle.odometer)} km</td>
                      <td className="py-3 px-4 text-gray-300">{formatNumber(vehicle.maxCapacity)} kg</td>
                      <td className="py-3 px-4">
                        <StatusPill status={vehicle.status} variant="vehicle" />
                      </td>
                      <td className="py-3 px-4 text-gray-300">{vehicle.region}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenModal(vehicle)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-brand-blue transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete vehicle ${vehicle.vehicleId}?`)) {
                                deleteVehicle(vehicle.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-brand-red transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredVehicles.length === 0 && (
              <p className="text-gray-400 text-center py-8">No vehicles found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        maxWidth="2xl"
        dark
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Vehicle ID"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              placeholder="TRK-001"
              required
              dark
            />
            <Input
              label="Model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="Freightliner Cascadia"
              required
              dark
            />
            <Input
              label="License Plate"
              value={formData.licensePlate}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
              placeholder="ABC-1234"
              required
              dark
            />
            <Select
              label="Vehicle Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
              options={[
                { value: 'Truck', label: 'Truck' },
                { value: 'Van', label: 'Van' },
                { value: 'Semi', label: 'Semi' },
                { value: 'Trailer', label: 'Trailer' },
              ]}
              dark
            />
            <Input
              type="number"
              label="Max Capacity (kg)"
              value={formData.maxCapacity}
              onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
              placeholder="26000"
              required
              dark
            />
            <Input
              type="number"
              label="Odometer (km)"
              value={formData.odometer}
              onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
              placeholder="145000"
              required
              dark
            />
            <Input
              type="number"
              label="Acquisition Cost ($)"
              value={formData.acquisitionCost}
              onChange={(e) => setFormData({ ...formData, acquisitionCost: e.target.value })}
              placeholder="125000"
              required
              dark
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
              options={[
                { value: 'Available', label: 'Available' },
                { value: 'On Trip', label: 'On Trip' },
                { value: 'In Shop', label: 'In Shop' },
                { value: 'Retired', label: 'Retired' },
              ]}
              dark
            />
            <Input
              label="Region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="North"
              required
              dark
            />
            <Input
              type="date"
              label="License Expiry"
              value={formData.licenseExpiry}
              onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              dark
            />
            <Input
              type="number"
              label="Next Service Due (km)"
              value={formData.nextServiceDue}
              onChange={(e) => setFormData({ ...formData, nextServiceDue: e.target.value })}
              placeholder="150000"
              dark
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingVehicle ? 'Update' : 'Add'} Vehicle</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedVehicle && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Vehicle Details - ${selectedVehicle.vehicleId}`}
          maxWidth="2xl"
          dark
        >
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Model</p>
                <p className="text-white font-medium">{selectedVehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Type</p>
                <p className="text-white font-medium">{selectedVehicle.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">License Plate</p>
                <p className="text-white font-medium">{selectedVehicle.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <StatusPill status={selectedVehicle.status} variant="vehicle" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Region</p>
                <p className="text-white font-medium">{selectedVehicle.region}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Odometer</p>
                <p className="text-white font-medium">{formatNumber(selectedVehicle.odometer)} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Max Capacity</p>
                <p className="text-white font-medium">{formatNumber(selectedVehicle.maxCapacity)} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Acquisition Cost</p>
                <p className="text-white font-medium">{formatCurrency(selectedVehicle.acquisitionCost)}</p>
              </div>
              {selectedVehicle.licenseExpiry && (
                <div>
                  <p className="text-sm text-gray-400">License Expiry</p>
                  <p className="text-white font-medium">{formatDate(selectedVehicle.licenseExpiry)}</p>
                  {calculateDaysUntil(selectedVehicle.licenseExpiry) < 90 && (
                    <p className="text-brand-amber text-xs mt-1">
                      {calculateDaysUntil(selectedVehicle.licenseExpiry) > 0 
                        ? `Expires in ${calculateDaysUntil(selectedVehicle.licenseExpiry)} days`
                        : 'Expired'}
                    </p>
                  )}
                </div>
              )}
              {selectedVehicle.nextServiceDue && (
                <div>
                  <p className="text-sm text-gray-400">Next Service Due</p>
                  <p className="text-white font-medium">{formatNumber(selectedVehicle.nextServiceDue)} km</p>
                  {selectedVehicle.odometer >= selectedVehicle.nextServiceDue * 0.95 && (
                    <p className="text-brand-amber text-xs mt-1">Service due soon</p>
                  )}
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="border-t border-dark-border pt-4">
              <h4 className="text-white font-semibold mb-3">Financial Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400">Total Fuel Cost</p>
                  <p className="text-white font-semibold text-lg">
                    {formatCurrency(getVehicleFuelCost(selectedVehicle.id))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400">Total Maintenance</p>
                  <p className="text-white font-semibold text-lg">
                    {formatCurrency(getVehicleMaintenanceCost(selectedVehicle.id))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400">Total Operational</p>
                  <p className="text-white font-semibold text-lg">
                    {formatCurrency(
                      getVehicleFuelCost(selectedVehicle.id) + getVehicleMaintenanceCost(selectedVehicle.id)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
