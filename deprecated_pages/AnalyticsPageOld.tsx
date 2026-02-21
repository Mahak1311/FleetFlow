import React, { useMemo } from 'react';
import { useTripStore } from '@/store/tripStore';
import { useFuelStore } from '@/store/fuelStore';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { VehicleROI } from '@/types';

export function AnalyticsPage() {
  const trips = useTripStore((state) => state.trips);
  const fuelLogs = useFuelStore((state) => state.logs);
  const maintenanceLogs = useMaintenanceStore((state) => state.logs);
  const vehicles = useVehicleStore((state) => state.vehicles);

  // Calculate Financial Metrics
  const metrics = useMemo(() => {
    const completedTrips = trips.filter((t) => t.status === 'Completed');
    const totalRevenue = completedTrips.reduce((sum, t) => sum + t.estimatedRevenue, 0);
    const fuelCosts = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
    const maintenanceCosts = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
    const totalOperationalCost = fuelCosts + maintenanceCosts;
    const netProfit = totalRevenue - totalOperationalCost;

    // Calculate total distance
    const totalDistance = completedTrips.reduce((sum, trip) => {
      if (trip.endOdometer && trip.startOdometer) {
        return sum + (trip.endOdometer - trip.startOdometer);
      }
      return sum;
    }, 0);

    const costPerKm = totalDistance > 0 ? totalOperationalCost / totalDistance : 0;

    return {
      totalRevenue,
      fuelCosts,
      maintenanceCosts,
      totalOperationalCost,
      netProfit,
      costPerKm,
    };
  }, [trips, fuelLogs, maintenanceLogs]);

  // Vehicle ROI Data
  const vehicleROI = useMemo(() => {
    const roiData: VehicleROI[] = [];

    vehicles.forEach((vehicle) => {
      const vehicleTrips = trips.filter(
        (t) => t.vehicleId === vehicle.id && t.status === 'Completed'
      );
      const revenue = vehicleTrips.reduce((sum, t) => sum + t.estimatedRevenue, 0);

      const fuel = fuelLogs
        .filter((log) => log.vehicleId === vehicle.id)
        .reduce((sum, log) => sum + log.cost, 0);

      const maintenance = maintenanceLogs
        .filter((log) => log.vehicleId === vehicle.id)
        .reduce((sum, log) => sum + log.cost, 0);

      const costs = fuel + maintenance;
      const roi = vehicle.acquisitionCost > 0 
        ? ((revenue - costs) / vehicle.acquisitionCost) * 100 
        : 0;

      const totalDistance = vehicleTrips.reduce((sum, trip) => {
        if (trip.endOdometer && trip.startOdometer) {
          return sum + (trip.endOdometer - trip.startOdometer);
        }
        return sum;
      }, 0);

      const efficiency = totalDistance > 0 ? totalDistance / (fuel / 1.4) : 0; // Assuming avg $1.4 per liter

      roiData.push({
        vehicleId: vehicle.vehicleId,
        revenue,
        costs,
        roi,
        efficiency,
      });
    });

    return roiData.sort((a, b) => b.roi - a.roi);
  }, [vehicles, trips, fuelLogs, maintenanceLogs]);

  // Revenue vs Expense Timeline
  const timelineData = useMemo(() => {
    const monthlyData: { [key: string]: { revenue: number; expenses: number } } = {};

    trips
      .filter((t) => t.status === 'Completed' && t.completedAt)
      .forEach((trip) => {
        const month = new Date(trip.completedAt!).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
        if (!monthlyData[month]) {
          monthlyData[month] = { revenue: 0, expenses: 0 };
        }
        monthlyData[month].revenue += trip.estimatedRevenue;
      });

    fuelLogs.forEach((log) => {
      const month = new Date(log.date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, expenses: 0 };
      }
      monthlyData[month].expenses += log.cost;
    });

    maintenanceLogs.forEach((log) => {
      const month = new Date(log.date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, expenses: 0 };
      }
      monthlyData[month].expenses += log.cost;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      expenses: data.expenses,
      profit: data.revenue - data.expenses,
    }));
  }, [trips, fuelLogs, maintenanceLogs]);

  // Cost Breakdown
  const costBreakdown = [
    { name: 'Fuel', value: metrics.fuelCosts, color: '#f59e0b' },
    { name: 'Maintenance', value: metrics.maintenanceCosts, color: '#ef4444' },
  ];

  const handleExportCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Revenue', metrics.totalRevenue],
      ['Fuel Costs', metrics.fuelCosts],
      ['Maintenance Costs', metrics.maintenanceCosts],
      ['Total Operational Cost', metrics.totalOperationalCost],
      ['Net Profit', metrics.netProfit],
      ['Cost per KM', metrics.costPerKm.toFixed(2)],
    ];

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleetflow-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 bg-light-bg min-h-screen -m-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Analytics</h1>
          <p className="text-gray-600">Revenue, costs, and ROI insights</p>
        </div>
        <Button onClick={handleExportCSV} variant="secondary" className="flex items-center space-x-2">
          <Download size={20} />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* KPI Cards - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-brand-blue">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-brand-blue/10">
                <DollarSign size={24} className="text-brand-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-red">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operational Cost</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.totalOperationalCost)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-brand-red/10">
                <TrendingDown size={24} className="text-brand-red" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-emerald">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.netProfit)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((metrics.netProfit / metrics.totalRevenue) * 100 || 0).toFixed(1)}% margin
                </p>
              </div>
              <div className="p-3 rounded-lg bg-brand-emerald/10">
                <TrendingUp size={24} className="text-brand-emerald" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-amber">
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost per KM</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(metrics.costPerKm)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fuel</span>
                <span className="font-semibold text-gray-900">{formatCurrency(metrics.fuelCosts)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Maintenance</span>
                <span className="font-semibold text-gray-900">{formatCurrency(metrics.maintenanceCosts)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle ROI Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle ROI Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vehicle ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Costs</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ROI</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {vehicleROI.map((vehicle, index) => (
                  <tr key={vehicle.vehicleId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-700 font-medium">#{index + 1}</td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">{vehicle.vehicleId}</td>
                    <td className="py-3 px-4 text-brand-blue font-medium">
                      {formatCurrency(vehicle.revenue)}
                    </td>
                    <td className="py-3 px-4 text-brand-red font-medium">
                      {formatCurrency(vehicle.costs)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vehicle.roi > 0
                            ? 'bg-brand-emerald/20 text-brand-emerald'
                            : 'bg-brand-red/20 text-brand-red'
                        }`}
                      >
                        {vehicle.roi.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {vehicle.efficiency.toFixed(1)} km/L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
