import React, { useState } from 'react';
import { useDriverStore } from '@/store/driverStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { StatusPill } from '@/components/ui/StatusPill';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Plus, Search, Edit, AlertTriangle, Award } from 'lucide-react';
import { formatDate, calculateDaysUntil, isLicenseExpired, isLicenseExpiringSoon } from '@/lib/utils';
import type { Driver, DriverStatus, LicenseCategory } from '@/types';

export function DriversPage() {
  const drivers = useDriverStore((state) => state.drivers);
  const addDriver = useDriverStore((state) => state.addDriver);
  const updateDriver = useDriverStore((state) => state.updateDriver);
  const deleteDriver = useDriverStore((state) => state.deleteDriver);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: 'Class A' as LicenseCategory,
    licenseExpiry: '',
    status: 'On Duty' as DriverStatus,
    safetyScore: '100',
    tripCompletionRate: '100',
    phone: '',
    email: '',
  });

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (driver?: Driver) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory,
        licenseExpiry: driver.licenseExpiry,
        status: driver.status,
        safetyScore: driver.safetyScore.toString(),
        tripCompletionRate: driver.tripCompletionRate.toString(),
        phone: driver.phone,
        email: driver.email,
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: '',
        licenseNumber: '',
        licenseCategory: 'Class A',
        licenseExpiry: '',
        status: 'On Duty',
        safetyScore: '100',
        tripCompletionRate: '100',
        phone: '',
        email: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const driverData = {
      name: formData.name,
      licenseNumber: formData.licenseNumber,
      licenseCategory: formData.licenseCategory,
      licenseExpiry: formData.licenseExpiry,
      status: formData.status,
      safetyScore: Number(formData.safetyScore),
      tripCompletionRate: Number(formData.tripCompletionRate),
      phone: formData.phone,
      email: formData.email,
    };

    if (editingDriver) {
      updateDriver(editingDriver.id, driverData);
    } else {
      addDriver(driverData);
    }

    setIsModalOpen(false);
  };

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailOpen(true);
  };

  const avgSafetyScore = drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length || 0;
  const complianceRate = (drivers.filter((d) => !isLicenseExpired(d.licenseExpiry)).length / drivers.length) * 100 || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Driver Profiles & Safety</h1>
          <p className="text-gray-400">Manage drivers and track compliance</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Driver</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card dark glass>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-brand-blue/20">
                <Award size={24} className="text-brand-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Drivers</p>
                <p className="text-2xl font-bold text-white">{drivers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card dark glass>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">On Duty</p>
              <p className="text-2xl font-bold text-white">
                {drivers.filter((d) => d.status === 'On Duty').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card dark glass>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg Safety Score</p>
              <p className="text-2xl font-bold text-white">{avgSafetyScore.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>

        <Card dark glass>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">License Compliance</p>
              <p className="text-2xl font-bold text-white">{complianceRate.toFixed(0)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card dark glass>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search drivers by name, license, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              dark
            />
          </div>
        </CardContent>
      </Card>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => {
          const hasLicenseAlert = isLicenseExpired(driver.licenseExpiry) || isLicenseExpiringSoon(driver.licenseExpiry);
          
          return (
            <Card
              key={driver.id}
              dark
              className="hover:border-brand-blue/50 transition-all cursor-pointer"
              onClick={() => handleViewDetails(driver)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{driver.name}</h3>
                      {hasLicenseAlert && (
                        <AlertTriangle size={16} className="text-brand-amber" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{driver.licenseCategory}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(driver);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-brand-blue transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <StatusPill status={driver.status} variant="driver" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Safety Score</span>
                      <span className="text-white font-semibold">{driver.safetyScore}</span>
                    </div>
                    <div className="w-full bg-dark-border rounded-full h-2">
                      <div
                        className="bg-brand-emerald rounded-full h-2 transition-all"
                        style={{ width: `${driver.safetyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Trip Completion</span>
                      <span className="text-white font-semibold">{driver.tripCompletionRate}%</span>
                    </div>
                    <div className="w-full bg-dark-border rounded-full h-2">
                      <div
                        className="bg-brand-blue rounded-full h-2 transition-all"
                        style={{ width: `${driver.tripCompletionRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dark-border">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">License Expiry</span>
                      <span className={
                        isLicenseExpired(driver.licenseExpiry) ? 'text-brand-red' :
                        isLicenseExpiringSoon(driver.licenseExpiry) ? 'text-brand-amber' :
                        'text-gray-300'
                      }>
                        {formatDate(driver.licenseExpiry)}
                      </span>
                    </div>
                    {isLicenseExpiringSoon(driver.licenseExpiry) && !isLicenseExpired(driver.licenseExpiry) && (
                      <p className="text-xs text-brand-amber">
                        Expires in {calculateDaysUntil(driver.licenseExpiry)} days
                      </p>
                    )}
                    {isLicenseExpired(driver.licenseExpiry) && (
                      <p className="text-xs text-brand-red">License Expired</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? 'Edit Driver' : 'Add New Driver'}
        maxWidth="lg"
        dark
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
              dark
            />
            <Input
              label="License Number"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              placeholder="CDL-12345"
              required
              dark
            />
            <Select
              label="License Category"
              value={formData.licenseCategory}
              onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value as LicenseCategory })}
              options={[
                { value: 'Class A', label: 'Class A' },
                { value: 'Class B', label: 'Class B' },
                { value: 'Class C', label: 'Class C' },
              ]}
              dark
            />
            <Input
              type="date"
              label="License Expiry"
              value={formData.licenseExpiry}
              onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              required
              dark
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as DriverStatus })}
              options={[
                { value: 'On Duty', label: 'On Duty' },
                { value: 'On Trip', label: 'On Trip' },
                { value: 'Off Duty', label: 'Off Duty' },
                { value: 'Suspended', label: 'Suspended' },
              ]}
              dark
            />
            <Input
              type="number"
              label="Safety Score (0-100)"
              value={formData.safetyScore}
              onChange={(e) => setFormData({ ...formData, safetyScore: e.target.value })}
              min="0"
              max="100"
              required
              dark
            />
            <Input
              type="number"
              step="0.1"
              label="Trip Completion Rate (%)"
              value={formData.tripCompletionRate}
              onChange={(e) => setFormData({ ...formData, tripCompletionRate: e.target.value })}
              min="0"
              max="100"
              required
              dark
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="555-0123"
              required
              dark
            />
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="driver@example.com"
              required
              dark
              className="col-span-2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingDriver ? 'Update' : 'Add'} Driver</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedDriver && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Driver Profile - ${selectedDriver.name}`}
          maxWidth="lg"
          dark
        >
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <CircularProgress
                value={selectedDriver.safetyScore}
                size={150}
                label="Safety Score"
                dark
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">License Number</p>
                <p className="text-white font-medium">{selectedDriver.licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">License Category</p>
                <p className="text-white font-medium">{selectedDriver.licenseCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <StatusPill status={selectedDriver.status} variant="driver" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Trip Completion Rate</p>
                <p className="text-white font-medium">{selectedDriver.tripCompletionRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white font-medium">{selectedDriver.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">{selectedDriver.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-400">License Expiry</p>
                <p className="text-white font-medium">{formatDate(selectedDriver.licenseExpiry)}</p>
                {isLicenseExpiringSoon(selectedDriver.licenseExpiry) && (
                  <p className="text-brand-amber text-sm mt-1">
                    {isLicenseExpired(selectedDriver.licenseExpiry)
                      ? 'License Expired'
                      : `Expires in ${calculateDaysUntil(selectedDriver.licenseExpiry)} days`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
