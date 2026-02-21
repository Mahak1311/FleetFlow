import React, { useState, useMemo } from 'react';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { 
  Search, 
  Filter, 
  Plus, 
  X, 
  Wrench,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ServiceType, MaintenanceLog } from '@/types';

type ServiceStatus = 'New' | 'In Progress' | 'Completed' | 'Critical';

interface EnhancedMaintenanceLog extends MaintenanceLog {
  status: ServiceStatus;
}

export function MaintenancePage() {
  const logs = useMaintenanceStore((state) => state.logs);
  const addLog = useMaintenanceStore((state) => state.addLog);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const updateVehicleStatus = useVehicleStore((state) => state.updateVehicleStatus);

  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ServiceStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'cost'>('date');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationVehicle, setNotificationVehicle] = useState('');
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form State
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

  // Enhanced logs with status
  const enhancedLogs: EnhancedMaintenanceLog[] = useMemo(() => {
    return logs.map(log => {
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(log.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      let status: ServiceStatus;
      if (log.cost > 3000) {
        status = 'Critical';
      } else if (daysSince <= 7) {
        status = 'New';
      } else if (daysSince <= 30) {
        status = 'In Progress';
      } else {
        status = 'Completed';
      }
      
      return { ...log, status };
    });
  }, [logs]);

  // Filtered and sorted logs
  const filteredLogs = useMemo(() => {
    let filtered = enhancedLogs.filter(log => {
      const vehicle = vehicles.find(v => v.id === log.vehicleId);
      const searchTerm = searchQuery.toLowerCase();
      
      const matchesSearch = 
        vehicle?.vehicleId.toLowerCase().includes(searchTerm) ||
        vehicle?.model.toLowerCase().includes(searchTerm) ||
        log.serviceType.toLowerCase().includes(searchTerm) ||
        log.description.toLowerCase().includes(searchTerm);
      
      const matchesStatus = selectedStatus === 'All' || log.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.cost - a.cost;
      }
    });

    return filtered;
  }, [enhancedLogs, searchQuery, selectedStatus, sortBy, vehicles]);

  // Calculate metrics
  const totalCost = useMemo(() => 
    logs.reduce((sum, log) => sum + log.cost, 0), 
    [logs]
  );

  const vehiclesInShop = useMemo(() => 
    vehicles.filter(v => v.status === 'In Shop').length,
    [vehicles]
  );

  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const lastMonth = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    });
    return lastMonth.reduce((sum, log) => sum + log.cost, 0);
  }, [logs]);

  const avgCostPerService = logs.length > 0 ? totalCost / logs.length : 0;

  // Status counts
  const statusCounts = useMemo(() => ({
    New: enhancedLogs.filter(l => l.status === 'New').length,
    'In Progress': enhancedLogs.filter(l => l.status === 'In Progress').length,
    Completed: enhancedLogs.filter(l => l.status === 'Completed').length,
    Critical: enhancedLogs.filter(l => l.status === 'Critical').length,
  }), [enhancedLogs]);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.vehicleId) errors.vehicleId = 'Vehicle is required';
    if (!formData.cost || Number(formData.cost) <= 0) errors.cost = 'Valid cost is required';
    if (!formData.odometer || Number(formData.odometer) <= 0) errors.odometer = 'Valid odometer reading is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.performedBy.trim()) errors.performedBy = 'Service provider is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newLogId = Date.now().toString();
    
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

    const vehicle = vehicles.find(v => v.id === formData.vehicleId);
    if (vehicle && vehicle.status !== 'In Shop') {
      updateVehicleStatus(formData.vehicleId, 'In Shop');
      setNotificationVehicle(vehicle.vehicleId);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }

    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setIsFormOpen(false);
      setHighlightedRow(newLogId);
      
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
      setValidationErrors({});
      
      setTimeout(() => setHighlightedRow(null), 3000);
    }, 1500);
  };

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getSeverityColor = (cost: number) => {
    if (cost > 3000) return 'text-red-400';
    if (cost > 1500) return 'text-amber-400';
    return 'text-emerald-400';
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: ServiceStatus }) => {
    const configs = {
      New: {
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: <Activity size={14} className="animate-pulse" />,
      },
      'In Progress': {
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        icon: <Clock size={14} />,
        shimmer: true
      },
      Completed: {
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        icon: <CheckCircle2 size={14} />,
        glow: true
      },
      Critical: {
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: <AlertCircle size={14} className="animate-pulse" />,
      }
    };

    const config = configs[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6 space-y-6">
      {/* Notification Badge */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div className="bg-dark-card border border-amber-500/30 rounded-lg p-4 shadow-lg shadow-amber-500/10 flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-amber-500 rounded-full absolute left-4" />
            <Wrench size={20} className="text-amber-500" />
            <div>
              <p className="text-white font-medium text-sm">Vehicle Status Updated</p>
              <p className="text-gray-400 text-xs">{notificationVehicle} marked as <span className="text-amber-400">In Shop</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Wrench className="text-blue-500" size={32} />
            Maintenance & Service Logs
            {vehiclesInShop > 0 && (
              <span className="flex items-center gap-2 text-base font-normal text-gray-400">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                {vehiclesInShop} in shop
              </span>
            )}
          </h1>
          <p className="text-gray-400">Live service operations control board</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105"
        >
          <Plus size={20} />
          Create New Service
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <DollarSign size={24} className="text-blue-400" />
            </div>
            <span className="text-xs text-gray-500 bg-dark-bg px-2 py-1 rounded">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(totalCost)}</h3>
          <p className="text-sm text-gray-400">Maintenance Costs</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-amber-500/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Wrench size={24} className="text-amber-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-xs text-amber-400">Active</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{vehiclesInShop}</h3>
          <p className="text-sm text-gray-400">Vehicles In Shop</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-emerald-400" />
            </div>
            <span className="text-xs text-gray-500 bg-dark-bg px-2 py-1 rounded">Monthly</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(monthlyTrend)}</h3>
          <p className="text-sm text-gray-400">This Month</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Activity size={24} className="text-purple-400" />
            </div>
            <span className="text-xs text-gray-500 bg-dark-bg px-2 py-1 rounded">Avg</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(avgCostPerService)}</h3>
          <p className="text-sm text-gray-400">Per Service</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 animate-slide-up">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search by vehicle, service type, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <div className="flex gap-2">
              {(['All', 'New', 'In Progress', 'Completed', 'Critical'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-dark-bg text-gray-400 hover:text-white hover:bg-dark-hover border border-dark-border'
                  }`}
                >
                  {status}
                  {status !== 'All' && statusCounts[status as keyof typeof statusCounts] > 0 && (
                    <span className="ml-2 text-xs opacity-70">({statusCounts[status as keyof typeof statusCounts]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'cost')}
            className="px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="cost">Sort by Cost</option>
          </select>
        </div>
      </div>

      {/* Service Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-bg/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Log ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Vehicle</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Issue/Service</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Cost</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                const vehicle = vehicles.find(v => v.id === log.vehicleId);
                const isExpanded = expandedRows.has(log.id);
                const isHighlighted = highlightedRow === log.id;
                
                return (
                  <React.Fragment key={log.id}>
                    <tr
                      className={`border-b border-dark-border hover:bg-dark-hover transition-all duration-200 cursor-pointer group animate-fade-in ${
                        isHighlighted ? 'bg-emerald-500/10 border-emerald-500/30' : ''
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => toggleRowExpand(log.id)}
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-sm">#{log.id.slice(-6)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{vehicle?.vehicleId || 'Unknown'}</span>
                          {vehicle?.status === 'In Shop' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
                              <Wrench size={10} />
                              In Shop
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500 text-sm">{vehicle?.model || '-'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white font-medium">{log.serviceType}</div>
                        <div className="text-gray-500 text-sm truncate max-w-xs">{log.description}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-400">{formatDate(log.date)}</td>
                      <td className={`py-4 px-6 font-bold ${getSeverityColor(log.cost)}`}>
                        {formatCurrency(log.cost)}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={log.status} />
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {isExpanded ? (
                          <ChevronDown size={20} className="transition-transform duration-200" />
                        ) : (
                          <ChevronRight size={20} className="transition-transform duration-200 group-hover:translate-x-1" />
                        )}
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="border-b border-dark-border bg-dark-bg/30 animate-slide-in">
                        <td colSpan={7} className="py-6 px-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-white font-semibold flex items-center gap-2">
                                <Activity size={16} className="text-blue-400" />
                                Service Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Performed By:</span>
                                  <span className="text-white">{log.performedBy}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Odometer:</span>
                                  <span className="text-white">{log.odometer.toLocaleString()} km</span>
                                </div>
                                {log.nextServiceDue && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Next Service Due:</span>
                                    <span className="text-amber-400">{log.nextServiceDue.toLocaleString()} km</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold flex items-center gap-2">
                                <Activity size={16} className="text-emerald-400" />
                                Vehicle Info
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Type:</span>
                                  <span className="text-white">{vehicle?.type || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">License Plate:</span>
                                  <span className="text-white font-mono">{vehicle?.licensePlate || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Current Status:</span>
                                  <span className={`font-medium ${
                                    vehicle?.status === 'Available' ? 'text-emerald-400' :
                                    vehicle?.status === 'In Shop' ? 'text-amber-400' :
                                    'text-gray-400'
                                  }`}>
                                    {vehicle?.status || '-'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold flex items-center gap-2">
                                <DollarSign size={16} className="text-purple-400" />
                                Cost Analysis
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Service Cost:</span>
                                  <span className={`font-bold ${getSeverityColor(log.cost)}`}>
                                    {formatCurrency(log.cost)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Severity:</span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    log.cost > 3000 ? 'bg-red-500/20 text-red-400' :
                                    log.cost > 1500 ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-emerald-500/20 text-emerald-400'
                                  }`}>
                                    {log.cost > 3000 ? 'High' : log.cost > 1500 ? 'Medium' : 'Low'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-6 border-t border-dark-border">
                            <h4 className="text-white font-semibold mb-3">Full Description</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{log.description}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="py-16 text-center">
              <Wrench size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No service logs found</p>
              <p className="text-gray-600 text-sm mt-2">Try adjusting your filters or create a new service log</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-in Form Overlay */}
      {isFormOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => !isSubmitting && setIsFormOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-dark-card border-l border-dark-border z-50 overflow-y-auto animate-slide-in-right shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Wrench className="text-blue-500" />
                    New Service Log
                  </h2>
                  <p className="text-gray-400 mt-1">Record a new maintenance or service event</p>
                </div>
                <button
                  onClick={() => !isSubmitting && setIsFormOpen(false)}
                  className="w-10 h-10 rounded-lg bg-dark-bg hover:bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Vehicle <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => {
                      setFormData({ ...formData, vehicleId: e.target.value });
                      setValidationErrors(prev => ({ ...prev, vehicleId: '' }));
                    }}
                    className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.vehicleId
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake'
                        : 'border-dark-border focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  >
                    <option value="">Select a vehicle...</option>
                    {vehicles.filter(v => v.status !== 'Retired').map(v => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleId} - {v.model} ({v.status})
                      </option>
                    ))}
                  </select>
                  {validationErrors.vehicleId && (
                    <p className="text-red-400 text-xs mt-1 animate-slide-in">{validationErrors.vehicleId}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Service Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as ServiceType })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  >
                    <option value="Oil Change">Oil Change</option>
                    <option value="Tire Replacement">Tire Replacement</option>
                    <option value="Brake Service">Brake Service</option>
                    <option value="Engine Repair">Engine Repair</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Service Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Odometer (km) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.odometer}
                      onChange={(e) => {
                        setFormData({ ...formData, odometer: e.target.value });
                        setValidationErrors(prev => ({ ...prev, odometer: '' }));
                      }}
                      placeholder="145000"
                      className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        validationErrors.odometer
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake'
                          : 'border-dark-border focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                    {validationErrors.odometer && (
                      <p className="text-red-400 text-xs mt-1 animate-slide-in">{validationErrors.odometer}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Cost ($) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => {
                          setFormData({ ...formData, cost: e.target.value });
                          setValidationErrors(prev => ({ ...prev, cost: '' }));
                        }}
                        placeholder="350.00"
                        className={`w-full pl-10 pr-4 py-3 bg-dark-bg border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                          validationErrors.cost
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake'
                            : 'border-dark-border focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      />
                    </div>
                    {validationErrors.cost && (
                      <p className="text-red-400 text-xs mt-1 animate-slide-in">{validationErrors.cost}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Next Service Due (km)
                    </label>
                    <input
                      type="number"
                      value={formData.nextServiceDue}
                      onChange={(e) => setFormData({ ...formData, nextServiceDue: e.target.value })}
                      placeholder="150000"
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Performed By <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.performedBy}
                    onChange={(e) => {
                      setFormData({ ...formData, performedBy: e.target.value });
                      setValidationErrors(prev => ({ ...prev, performedBy: '' }));
                    }}
                    placeholder="Service Center Name"
                    className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      validationErrors.performedBy
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake'
                        : 'border-dark-border focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                  {validationErrors.performedBy && (
                    <p className="text-red-400 text-xs mt-1 animate-slide-in">{validationErrors.performedBy}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setValidationErrors(prev => ({ ...prev, description: '' }));
                    }}
                    placeholder="Detailed description of the service performed..."
                    rows={4}
                    className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                      validationErrors.description
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake'
                        : 'border-dark-border focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                  {validationErrors.description && (
                    <p className="text-red-400 text-xs mt-1 animate-slide-in">{validationErrors.description}</p>
                  )}
                </div>

                <div className="flex gap-4 pt-6 border-t border-dark-border">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-dark-bg hover:bg-dark-hover border border-dark-border text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Create Service Log
                      </>
                    )}
                  </button>
                </div>
              </form>

              {showSuccess && (
                <div className="absolute inset-0 bg-dark-card/95 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                  <div className="text-center animate-scale-in">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={48} className="text-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Service Log Created!</h3>
                    <p className="text-gray-400">Vehicle status updated successfully</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
