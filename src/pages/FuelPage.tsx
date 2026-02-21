import React, { useState } from 'react';
import { useFuelStore } from '@/store/fuelStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Plus, Fuel, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export function FuelPage() {
  const logs = useFuelStore((state) => state.logs);
  const addLog = useFuelStore((state) => state.addLog);
  const vehicles = useVehicleStore((state) => state.vehicles);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    liters: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addLog({
      vehicleId: formData.vehicleId,
      liters: Number(formData.liters),
      cost: Number(formData.cost),
      date: formData.date,
      odometer: Number(formData.odometer),
      location: formData.location,
    });

    setIsModalOpen(false);
    setFormData({
      vehicleId: '',
      liters: '',
      cost: '',
      date: new Date().toISOString().split('T')[0],
      odometer: '',
      location: '',
    });
  };

  const totalFuelCost = logs.reduce((sum, log) => sum + log.cost, 0);
  const totalLiters = logs.reduce((sum, log) => sum + log.liters, 0);
  const avgPricePerLiter = totalLiters > 0 ? totalFuelCost / totalLiters : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Fuel & Expenses</h1>
          <p className="text-gray-400">Track fuel consumption and operational costs</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Fuel Log</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card dark glass>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-brand-amber/20">
                <Fuel size={24} className="text-brand-amber" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Fuel Cost</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalFuelCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card dark glass>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Liters</p>
              <p className="text-2xl font-bold text-white">{totalLiters.toLocaleString()} L</p>
            </div>
          </CardContent>
        </Card>

        <Card dark glass>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg Price/Liter</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(avgPricePerLiter)}</p>
            </div>
          </CardContent>
        </Card>

        <Card dark glass>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Entries</p>
              <p className="text-2xl font-bold text-white">{logs.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card dark glass>
        <CardHeader>
          <CardTitle dark>Fuel Log History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Liters</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Price/L</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Total Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Odometer</th>
                </tr>
              </thead>
              <tbody>
                {logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => {
                  const vehicle = vehicles.find((v) => v.id === log.vehicleId);
                  return (
                    <tr key={log.id} className="border-b border-dark-border hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{formatDate(log.date)}</td>
                      <td className="py-3 px-4 text-white font-medium">{vehicle?.vehicleId}</td>
                      <td className="py-3 px-4 text-gray-300">{log.location}</td>
                      <td className="py-3 px-4 text-gray-300">{log.liters} L</td>
                      <td className="py-3 px-4 text-gray-300">{formatCurrency(log.pricePerLiter)}</td>
                      <td className="py-3 px-4 text-brand-emerald font-medium">{formatCurrency(log.cost)}</td>
                      <td className="py-3 px-4 text-gray-300">{log.odometer.toLocaleString()} km</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Fuel Log" maxWidth="lg" dark>
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
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              dark
            />
            <Input
              type="number"
              step="0.01"
              label="Liters"
              value={formData.liters}
              onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
              placeholder="380"
              required
              dark
            />
            <Input
              type="number"
              step="0.01"
              label="Total Cost ($)"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="520"
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
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Shell Station - Highway 5"
              required
              dark
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Fuel Log</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
