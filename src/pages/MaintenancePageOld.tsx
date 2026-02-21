import React, { useState } from 'react';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Plus, Wrench } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ServiceType } from '@/types';

export function MaintenancePage() {
  const logs = useMaintenanceStore((state) => state.logs);
  const addLog = useMaintenanceStore((state) => state.addLog);
  
  const vehicles = useVehicleStore((state) => state.vehicles);
  const updateVehicleStatus = useVehicleStore((state) => state.updateVehicleStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: 'Oil Change' as ServiceType,
    cost: '',
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    description: '',
    performedBy: '',
    nextServiceDue: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addLog({
      vehicleId: formData.vehicleId,
      serviceType: formData.serviceType,
      cost: Number(formData.cost),
      date: formData.date,
      odometer: Number(formData.odometer),
      description: formData.description,
      performedBy: formData.performedBy,
      nextServiceDue: formData.nextServiceDue ? Number(formData.nextServiceDue) : undefined,
    });

    // Auto-update vehicle status to "In Shop"
    updateVehicleStatus(formData.vehicleId, 'In Shop');

    setIsModalOpen(false);
    setFormData({
      vehicleId: '',
      serviceType: 'Oil Change',
      cost: '',
      date: new Date().toISOString().split('T')[0],
      odometer: '',
      description: '',
      performedBy: '',
      nextServiceDue: '',
    });
  };

  const totalMaintenanceCost = logs.reduce((sum, log) => sum + log.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Maintenance & Service</h1>
          <p className="text-gray-400">Track vehicle service history and schedule maintenance</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Service Log</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card dark glass>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-brand-amber/20">
                <Wrench size={24} className="text-brand-amber" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Service Logs</p>
                <p className="text-2xl font-bold text-white">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card dark glass>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-brand-red/20">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Maintenance Cost</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalMaintenanceCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card dark glass>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-brand-blue/20">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg Cost per Service</p>
                <p className="text-2xl font-bold text-white">
                  {logs.length > 0 ? formatCurrency(totalMaintenanceCost / logs.length) : '$0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card dark glass>
        <CardHeader>
          <CardTitle dark>Service History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Service Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Odometer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Performed By</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Next Service</th>
                </tr>
              </thead>
              <tbody>
                {logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => {
                  const vehicle = vehicles.find((v) => v.id === log.vehicleId);
                  return (
                    <tr key={log.id} className="border-b border-dark-border hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{formatDate(log.date)}</td>
                      <td className="py-3 px-4 text-white font-medium">{vehicle?.vehicleId}</td>
                      <td className="py-3 px-4 text-gray-300">{log.serviceType}</td>
                      <td className="py-3 px-4 text-gray-300">{log.odometer.toLocaleString()} km</td>
                      <td className="py-3 px-4 text-brand-emerald font-medium">{formatCurrency(log.cost)}</td>
                      <td className="py-3 px-4 text-gray-300">{log.performedBy}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {log.nextServiceDue ? `${log.nextServiceDue.toLocaleString()} km` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Service Log" maxWidth="lg" dark>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Vehicle"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              options={[
                { value: '', label: 'Select Vehicle' },
                ...vehicles.filter((v) => v.status !== 'Retired').map((v) => ({
                  value: v.id,
                  label: `${v.vehicleId} - ${v.model}`,
                })),
              ]}
              required
              dark
            />
            <Select
              label="Service Type"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as ServiceType })}
              options={[
                { value: 'Oil Change', label: 'Oil Change' },
                { value: 'Tire Replacement', label: 'Tire Replacement' },
                { value: 'Brake Service', label: 'Brake Service' },
                { value: 'Engine Repair', label: 'Engine Repair' },
                { value: 'Inspection', label: 'Inspection' },
                { value: 'Other', label: 'Other' },
              ]}
              dark
            />
            <Input
              type="date"
              label="Service Date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              label="Cost ($)"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="350"
              required
              dark
            />
            <Input
              label="Performed By"
              value={formData.performedBy}
              onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
              placeholder="Service Center Name"
              required
              dark
            />
            <div className="col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Service details..."
                required
                dark
              />
            </div>
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
            <Button type="submit">Add Service Log</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
