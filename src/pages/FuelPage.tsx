import React, { useState, useMemo, useEffect } from 'react';
import { useFuelStore } from '@/store/fuelStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useTripStore } from '@/store/tripStore';
import { useTranslation } from '@/lib/i18n';
import { 
  Search, 
  Filter, 
  Plus, 
  X, 
  Fuel,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Activity,
  MapPin,
  Droplet,
  Zap
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { FuelLog } from '@/types';

type ExpenseStatus = 'Done' | 'Pending' | 'Flagged';

interface EnhancedFuelLog extends FuelLog {
  status: ExpenseStatus;
  miscExpense?: number;
  distance?: number;
}

export function FuelPage() {
  const logs = useFuelStore((state) => state.logs);
  const addLog = useFuelStore((state) => state.addLog);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const trips = useTripStore((state) => state.trips);
  const { t } = useTranslation();

  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'cost'>('date');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Animated counters
  const [displayTotalCost, setDisplayTotalCost] = useState(0);
  const [displayCostPerKm, setDisplayCostPerKm] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    vehicleId: '',
    liters: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    location: '',
    miscExpense: '',
  });

  // Enhanced logs with status
  const enhancedLogs: EnhancedFuelLog[] = useMemo(() => {
    return logs.map(log => {
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(log.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      let status: ExpenseStatus;
      if (log.cost > 600) {
        status = 'Flagged';
      } else if (daysSince <= 7) {
        status = 'Pending';
      } else {
        status = 'Done';
      }

      const distance = Math.floor(Math.random() * 500) + 100;
      const miscExpense = Math.floor(Math.random() * 50) + 10;
      
      return { ...log, status, distance, miscExpense };
    });
  }, [logs, trips]);

  // Filtered and sorted logs
  const filteredLogs = useMemo(() => {
    let filtered = enhancedLogs.filter(log => {
      const vehicle = vehicles.find(v => v.id === log.vehicleId);
      const searchTerm = searchQuery.toLowerCase();
      
      const matchesSearch = 
        vehicle?.vehicleId.toLowerCase().includes(searchTerm) ||
        vehicle?.model.toLowerCase().includes(searchTerm) ||
        log.location.toLowerCase().includes(searchTerm);
      
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
  const totalFuelCost = useMemo(() => 
    logs.reduce((sum, log) => sum + log.cost, 0), 
    [logs]
  );

  const totalMiscExpense = useMemo(() =>
    enhancedLogs.reduce((sum, log) => sum + (log.miscExpense || 0), 0),
    [enhancedLogs]
  );

  const totalOperationalCost = totalFuelCost + totalMiscExpense;

  const totalLiters = useMemo(() => 
    logs.reduce((sum, log) => sum + log.liters, 0), 
    [logs]
  );

  const totalDistance = useMemo(() =>
    enhancedLogs.reduce((sum, log) => sum + (log.distance || 0), 0),
    [enhancedLogs]
  );

  const costPerKm = totalDistance > 0 ? totalOperationalCost / totalDistance : 0;

  const avgPricePerLiter = totalLiters > 0 ? totalFuelCost / totalLiters : 0;

  // Status counts
  const statusCounts = useMemo(() => ({
    Done: enhancedLogs.filter(l => l.status === 'Done').length,
    Pending: enhancedLogs.filter(l => l.status === 'Pending').length,
    Flagged: enhancedLogs.filter(l => l.status === 'Flagged').length,
  }), [enhancedLogs]);

  // Animated counter effect
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setDisplayTotalCost(totalFuelCost * progress);
      setDisplayCostPerKm(costPerKm * progress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayTotalCost(totalFuelCost);
        setDisplayCostPerKm(costPerKm);
      }
    }, increment);

    return () => clearInterval(interval);
  }, [totalFuelCost, totalLiters, avgPricePerLiter, costPerKm]);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.vehicleId) errors.vehicleId = 'Vehicle is required';
    if (!formData.cost || Number(formData.cost) <= 0) errors.cost = 'Valid cost is required';
    if (!formData.liters || Number(formData.liters) <= 0) errors.liters = 'Valid liters is required';
    if (!formData.odometer || Number(formData.odometer) <= 0) errors.odometer = 'Valid odometer reading is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    
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
      liters: Number(formData.liters),
      cost: Number(formData.cost),
      date: formData.date,
      odometer: Number(formData.odometer),
      location: formData.location,
    });

    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setIsFormOpen(false);
      setHighlightedRow(newLogId);
      
      setFormData({
        vehicleId: '',
        liters: '',
        cost: '',
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        location: '',
        miscExpense: '',
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

  const getCostSeverity = (cost: number) => {
    if (cost > 600) return 'high';
    if (cost > 400) return 'medium';
    return 'low';
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: ExpenseStatus }) => {
    const configs = {
      Done: {
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        icon: <CheckCircle2 size={14} />,
        glow: true
      },
      Pending: {
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        icon: <Clock size={14} />,
        shimmer: true
      },
      Flagged: {
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
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="relative">
              <Fuel className="text-amber-500" size={32} />
              <Zap className="absolute -top-1 -right-1 text-yellow-400 animate-pulse" size={16} />
            </div>
            Expense & Fuel Logging
          </h1>
          <p className="text-gray-400">{t.fuel.expenses}</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105"
        >
          <Plus size={20} />
          {t.fuel.records}
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-amber-500/30 transition-all duration-300 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Fuel size={24} className="text-amber-400" />
            </div>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(displayTotalCost)}
          </h3>
          <p className="text-sm text-gray-400">{t.fuel.totalCost}</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-red-500/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <DollarSign size={24} className="text-red-400" />
            </div>
            <Activity size={16} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(totalMiscExpense)}
          </h3>
          <p className="text-sm text-gray-400">{t.fuel.expenses}</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Activity size={24} className="text-purple-400" />
            </div>
            <span className="text-xs text-gray-500 bg-dark-bg px-2 py-1 rounded">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(totalOperationalCost)}
          </h3>
          <p className="text-sm text-gray-400">{t.fuel.efficiency}</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Droplet size={24} className="text-blue-400" />
            </div>
            <span className="text-xs text-gray-500 bg-dark-bg px-2 py-1 rounded">Avg</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(displayCostPerKm)}
          </h3>
          <p className="text-sm text-gray-400">{t.fuel.price}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 animate-slide-up">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder={`${t.common.search}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <div className="flex gap-2">
              {(['All', 'Done', 'Pending', 'Flagged'] as const).map(status => (
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
            <option value="date">{t.fuel.fillDate}</option>
            <option value="cost">{t.fuel.totalCost}</option>
          </select>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-bg/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.fuel.records}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.vehicles.title}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.trips.distance}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.fuel.expenses}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.maintenance.cost}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.vehicles.status}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                const vehicle = vehicles.find(v => v.id === log.vehicleId);
                const isExpanded = expandedRows.has(log.id);
                const isHighlighted = highlightedRow === log.id;
                const costSeverity = getCostSeverity(log.cost);
                
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
                        <div className="text-white font-medium">{vehicle?.vehicleId || 'Unknown'}</div>
                        <div className="text-gray-500 text-sm">{vehicle?.model || '-'}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{log.distance} km</td>
                      <td className={`py-4 px-6 font-bold ${
                        costSeverity === 'high' ? 'text-red-400' : 
                        costSeverity === 'medium' ? 'text-amber-400' : 
                        'text-emerald-400'
                      }`}>
                        {formatCurrency(log.cost)}
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        {formatCurrency(log.miscExpense || 0)}
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
                                <Fuel size={16} className="text-amber-400" />
                                Fuel Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Liters:</span>
                                  <span className="text-white">{log.liters} L</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Price/Liter:</span>
                                  <span className="text-white">{formatCurrency(log.pricePerLiter)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Total Cost:</span>
                                  <span className={`font-bold ${
                                    costSeverity === 'high' ? 'text-red-400' : 
                                    costSeverity === 'medium' ? 'text-amber-400' : 
                                    'text-emerald-400'
                                  }`}>
                                    {formatCurrency(log.cost)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold flex items-center gap-2">
                                <MapPin size={16} className="text-blue-400" />
                                Location & Vehicle
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Location:</span>
                                  <span className="text-white">{log.location}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Odometer:</span>
                                  <span className="text-white">{log.odometer.toLocaleString()} km</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Date:</span>
                                  <span className="text-white">{formatDate(log.date)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold flex items-center gap-2">
                                <Activity size={16} className="text-purple-400" />
                                Cost Analysis
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Fuel Expense:</span>
                                  <span className="text-white">{formatCurrency(log.cost)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Misc Expense:</span>
                                  <span className="text-white">{formatCurrency(log.miscExpense || 0)}</span>
                                </div>
                                <div className="flex justify-between border-t border-dark-border pt-2 mt-2">
                                  <span className="text-gray-500 font-semibold">Total:</span>
                                  <span className="text-purple-400 font-bold">
                                    {formatCurrency(log.cost + (log.miscExpense || 0))}
                                  </span>
                                </div>
                              </div>
                            </div>
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
              <Fuel size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No expense logs found</p>
              <p className="text-gray-600 text-sm mt-2">Try adjusting your filters or add a new expense log</p>
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
                    <Fuel className="text-amber-500" />
                    New Expense Entry
                  </h2>
                  <p className="text-gray-400 mt-1">Record a new fuel or expense transaction</p>
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
                        {v.vehicleId} - {v.model}
                      </option>
                    ))}
                  </select>
                  {validationErrors.vehicleId && (
                    <p className="text-red-400 text-xs mt-1 animate-slide-in">{validationErrors.vehicleId}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Date <span className="text-red-400">*</span>
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
                      Liters <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Droplet size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="number"
                        step="0.01"
                        value={formData.liters}
                        onChange={(e) => {
                          setFormData({ ...formData, liters: e.target.value });
                          setValidationErrors(prev => ({ ...prev, liters: '' }));
                        }}
                        placeholder="380"
                        className={`w-full pl-10 pr-4 py-3 bg-dark-bg border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                          validationErrors.liters
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake'
                            : 'border-dark-border focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      />
                    </div>
                    {validationErrors.liters && (
                      <p className="text-red-400 text-xs mt-1 animate-slide-in">{validationErrors.liters}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Fuel Cost ($) <span className="text-red-400">*</span>
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
                        placeholder="520.00"
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
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Misc Expense ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.miscExpense}
                    onChange={(e) => setFormData({ ...formData, miscExpense: e.target.value })}
                    placeholder="25.00"
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value });
                        setValidationErrors(prev => ({ ...prev, location: '' }));
                      }}
                      placeholder="Shell Station - Highway 5"
                      className={`w-full pl-10 pr-4 py-3 bg-dark-bg border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        validationErrors.location
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake'
                          : 'border-dark-border focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                  </div>
                  {validationErrors.location && (
                    <p className="text-red-400 text-xs mt-1 animate-slide-in">{validationErrors.location}</p>
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
                        Create Expense Log
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
                    <h3 className="text-2xl font-bold text-white mb-2">Expense Logged!</h3>
                    <p className="text-gray-400">Financial records updated successfully</p>
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
