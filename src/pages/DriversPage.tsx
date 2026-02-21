import { useState, useMemo, useEffect } from 'react';
import { useDriverStore } from '@/store/driverStore';
import { useTranslation } from '@/lib/i18n';
import {
  Search,
  Filter,
  X,
  AlertTriangle,
  Shield,
  Award,
  Users,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { formatDate, calculateDaysUntil, isLicenseExpired, isLicenseExpiringSoon } from '@/lib/utils';
import type { Driver, DriverStatus } from '@/types';

export function DriversPage() {
  const drivers = useDriverStore((state) => state.drivers);
  const updateDriver = useDriverStore((state) => state.updateDriver);
  const { t } = useTranslation();

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DriverStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'safety' | 'completion'>('name');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  // Animated counters
  const [displayActiveDrivers, setDisplayActiveDrivers] = useState(0);
  const [displaySuspended, setDisplaySuspended] = useState(0);
  const [displayExpiring, setDisplayExpiring] = useState(0);
  const [displayAvgSafety, setDisplayAvgSafety] = useState(0);

  // Calculate complaints based on trips (simulated)
  const getComplaintCount = () => {
    return Math.floor(Math.random() * 3);
  };

  // Filtered and sorted drivers
  const filteredDrivers = useMemo(() => {
    let filtered = drivers.filter(driver => {
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch = 
        driver.name.toLowerCase().includes(searchTerm) ||
        driver.licenseNumber.toLowerCase().includes(searchTerm) ||
        driver.email.toLowerCase().includes(searchTerm);
      
      const matchesStatus = selectedStatus === 'All' || driver.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'safety') return b.safetyScore - a.safetyScore;
      if (sortBy === 'completion') return b.tripCompletionRate - a.tripCompletionRate;
      return 0;
    });

    return filtered;
  }, [drivers, searchQuery, selectedStatus, sortBy]);

  // Calculate metrics
  const activeDrivers = useMemo(() => 
    drivers.filter(d => d.status === 'On Duty' || d.status === 'On Trip').length,
    [drivers]
  );

  const suspendedDrivers = useMemo(() =>
    drivers.filter(d => d.status === 'Suspended').length,
    [drivers]
  );

  const expiringLicenses = useMemo(() =>
    drivers.filter(d => isLicenseExpiringSoon(d.licenseExpiry) || isLicenseExpired(d.licenseExpiry)).length,
    [drivers]
  );

  const avgSafetyScore = useMemo(() =>
    drivers.length > 0 ? drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length : 0,
    [drivers]
  );

  // Animated counter effect
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setDisplayActiveDrivers(Math.floor(activeDrivers * progress));
      setDisplaySuspended(Math.floor(suspendedDrivers * progress));
      setDisplayExpiring(Math.floor(expiringLicenses * progress));
      setDisplayAvgSafety(avgSafetyScore * progress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayActiveDrivers(activeDrivers);
        setDisplaySuspended(suspendedDrivers);
        setDisplayExpiring(expiringLicenses);
        setDisplayAvgSafety(avgSafetyScore);
      }
    }, increment);

    return () => clearInterval(interval);
  }, [activeDrivers, suspendedDrivers, expiringLicenses, avgSafetyScore]);

  // Handle driver selection
  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailPanelOpen(true);
  };

  // Toggle driver status
  const handleStatusToggle = (driver: Driver, newStatus: DriverStatus) => {
    updateDriver(driver.id, { status: newStatus });
  };

  // Get risk level
  const getRiskLevel = (driver: Driver) => {
    const complaints = getComplaintCount();
    const hasLicenseIssue = isLicenseExpired(driver.licenseExpiry) || isLicenseExpiringSoon(driver.licenseExpiry);
    
    if (driver.safetyScore < 70 || complaints > 2 || isLicenseExpired(driver.licenseExpiry)) {
      return 'high';
    }
    if (driver.safetyScore < 85 || complaints > 0 || hasLicenseIssue) {
      return 'medium';
    }
    return 'low';
  };

  // Circular progress component
  const CircularProgress = ({ value, size = 60 }: { value: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    
    const color = value >= 90 ? '#10b981' : value >= 70 ? '#f59e0b' : '#ef4444';
    
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: value >= 90 ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))' : 'none' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{value}%</span>
        </div>
      </div>
    );
  };

  // Status toggle component
  const StatusToggle = ({ driver }: { driver: Driver }) => {
    const statusColors = {
      'On Duty': 'bg-emerald-500',
      'On Trip': 'bg-blue-500',
      'Off Duty': 'bg-amber-500',
      'Suspended': 'bg-red-500'
    };

    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${statusColors[driver.status]} animate-pulse`} />
        <span className="text-sm text-white">{driver.status}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="text-blue-500" size={32} />
            Driver Performance & Safety Profiles
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Activity size={16} className="text-emerald-400 animate-pulse" />
            {t.drivers.title} {drivers.length}
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Users size={24} className="text-emerald-400" />
            </div>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{displayActiveDrivers}</h3>
          <p className="text-sm text-gray-400">{t.drivers.active}</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-red-500/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            {suspendedDrivers > 0 && <AlertTriangle size={16} className="text-red-400 animate-pulse" />}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{displaySuspended}</h3>
          <p className="text-sm text-gray-400">{t.drivers.inactive}</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-amber-500/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock size={24} className="text-amber-400" />
            </div>
            {expiringLicenses > 0 && <AlertTriangle size={16} className="text-amber-400 animate-pulse" />}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{displayExpiring}</h3>
          <p className="text-sm text-gray-400">{t.drivers.licenseNumber}</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Award size={24} className="text-blue-400" />
            </div>
            <span className="text-xs text-gray-500 bg-dark-bg px-2 py-1 rounded">Avg</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{displayAvgSafety.toFixed(1)}</h3>
          <p className="text-sm text-gray-400">{t.drivers.safetyScore}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 animate-slide-up">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder={`${t.common.search}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:scale-[1.02] transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <div className="flex gap-2">
              {(['All', 'On Duty', 'On Trip', 'Off Duty', 'Suspended'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-dark-bg text-gray-400 hover:text-white hover:bg-dark-hover border border-dark-border'
                  }`}
                >
                  {status === 'All' ? t.drivers.allDrivers : status}
                </button>
              ))}
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'safety' | 'completion')}
            className="px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer"
          >
            <option value="name">{t.drivers.name}</option>
            <option value="safety">{t.drivers.safetyScore}</option>
            <option value="completion">{t.trips.completed}</option>
          </select>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-bg/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.drivers.name}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.drivers.licenseNumber}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.maintenance.date}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.trips.completed}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.drivers.safetyScore}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.drivers.status}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.vehicles.status}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver, index) => {
                const riskLevel = getRiskLevel(driver);
                const complaints = getComplaintCount();
                const isExpired = isLicenseExpired(driver.licenseExpiry);
                const isExpiringSoon = isLicenseExpiringSoon(driver.licenseExpiry);
                const daysUntilExpiry = calculateDaysUntil(driver.licenseExpiry);

                return (
                  <tr
                    key={driver.id}
                    onClick={() => handleDriverClick(driver)}
                    className={`border-b border-dark-border hover:bg-dark-hover cursor-pointer group transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-blue-500/10 ${
                      driver.status === 'Suspended' ? 'opacity-60' : ''
                    } ${riskLevel === 'high' ? 'border-l-4 border-l-red-500/50' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="text-white font-medium">{driver.name}</div>
                        {riskLevel !== 'low' && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium animate-pulse ${
                            riskLevel === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            At Risk
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-sm">{driver.licenseCategory}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-300 font-mono text-sm">{driver.licenseNumber}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`flex items-center gap-2 ${
                        isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400 animate-pulse' : 'text-gray-300'
                      }`}>
                        {(isExpired || isExpiringSoon) && (
                          <AlertTriangle size={16} className={isExpired ? 'text-red-400 animate-pulse' : 'text-amber-400'} />
                        )}
                        <div>
                          <div className="text-sm">{formatDate(driver.licenseExpiry)}</div>
                          {isExpired && (
                            <div className="text-xs text-red-400">Expired</div>
                          )}
                          {!isExpired && isExpiringSoon && (
                            <div className="text-xs">{daysUntilExpiry} days</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <CircularProgress value={driver.tripCompletionRate} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-24 bg-dark-border rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                                driver.safetyScore >= 90 ? 'bg-emerald-500' :
                                driver.safetyScore >= 70 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ 
                                width: `${driver.safetyScore}%`,
                                boxShadow: driver.safetyScore >= 90 ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none'
                              }}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${
                          driver.safetyScore >= 90 ? 'text-emerald-400' :
                          driver.safetyScore >= 70 ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {driver.safetyScore}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {complaints > 0 ? (
                        <div className="flex items-center gap-2">
                          <AlertCircle size={16} className={`${complaints > 2 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                          <span className={`text-sm font-medium ${complaints > 2 ? 'text-red-400' : 'text-amber-400'}`}>
                            {complaints}
                          </span>
                        </div>
                      ) : (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <StatusToggle driver={driver} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredDrivers.length === 0 && (
            <div className="py-16 text-center">
              <Users size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No drivers found</p>
              <p className="text-gray-600 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {isDetailPanelOpen && selectedDriver && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsDetailPanelOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-dark-card border-l border-dark-border z-50 overflow-y-auto animate-slide-in-right shadow-2xl">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Shield className="text-blue-500" />
                    {selectedDriver.name}
                  </h2>
                  <p className="text-gray-400 mt-1">{selectedDriver.licenseCategory} • {selectedDriver.licenseNumber}</p>
                </div>
                <button
                  onClick={() => setIsDetailPanelOpen(false)}
                  className="w-10 h-10 rounded-lg bg-dark-bg hover:bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-dark-bg rounded-xl p-6 text-center">
                  <CircularProgress value={selectedDriver.safetyScore} size={120} />
                  <p className="text-sm text-gray-400 mt-4">Safety Score</p>
                  {selectedDriver.safetyScore >= 90 && (
                    <p className="text-xs text-emerald-400 mt-1">Excellent Performance</p>
                  )}
                </div>
                <div className="bg-dark-bg rounded-xl p-6 text-center">
                  <CircularProgress value={selectedDriver.tripCompletionRate} size={120} />
                  <p className="text-sm text-gray-400 mt-4">Completion Rate</p>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4">Duty Status</h3>
                <div className="flex gap-2">
                  {(['On Duty', 'Off Duty', 'Suspended'] as DriverStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusToggle(selectedDriver, status)}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        selectedDriver.status === status
                          ? status === 'On Duty' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' :
                            status === 'Suspended' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' :
                            'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                          : 'bg-dark-bg text-gray-400 hover:text-white border border-dark-border'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact & License Info */}
              <div className="space-y-4 mb-8">
                <h3 className="text-white font-semibold mb-4">Contact & License Details</h3>
                
                <div className="bg-dark-bg rounded-lg p-4 flex items-center gap-3">
                  <Phone size={20} className="text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-white">{selectedDriver.phone}</p>
                  </div>
                </div>

                <div className="bg-dark-bg rounded-lg p-4 flex items-center gap-3">
                  <Mail size={20} className="text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-white">{selectedDriver.email}</p>
                  </div>
                </div>

                <div className={`rounded-lg p-4 flex items-center gap-3 ${
                  isLicenseExpired(selectedDriver.licenseExpiry) ? 'bg-red-500/20 border border-red-500/30' :
                  isLicenseExpiringSoon(selectedDriver.licenseExpiry) ? 'bg-amber-500/20 border border-amber-500/30' :
                  'bg-dark-bg'
                }`}>
                  <Calendar size={20} className={
                    isLicenseExpired(selectedDriver.licenseExpiry) ? 'text-red-400' :
                    isLicenseExpiringSoon(selectedDriver.licenseExpiry) ? 'text-amber-400' :
                    'text-blue-400'
                  } />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">License Expiry</p>
                    <p className="text-white">{formatDate(selectedDriver.licenseExpiry)}</p>
                    {isLicenseExpired(selectedDriver.licenseExpiry) && (
                      <p className="text-xs text-red-400 mt-1 font-medium">⚠️ License Expired</p>
                    )}
                    {!isLicenseExpired(selectedDriver.licenseExpiry) && isLicenseExpiringSoon(selectedDriver.licenseExpiry) && (
                      <p className="text-xs text-amber-400 mt-1 font-medium">
                        Expires in {calculateDaysUntil(selectedDriver.licenseExpiry)} days
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Performance History */}
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4">Performance Trend</h3>
                <div className="bg-dark-bg rounded-lg p-6">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[88, 92, 90, selectedDriver.safetyScore, 91, 93].map((score, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500"
                          style={{ 
                            height: `${score}%`,
                            animationDelay: `${i * 100}ms`
                          }}
                        />
                        <span className="text-xs text-gray-500">{score}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <TrendingUp size={16} className="text-emerald-400" />
                    <span className="text-sm text-gray-400">Performance trending upward</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { type: 'trip', text: 'Completed trip #1523', time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-400' },
                    { type: 'safety', text: 'Safety inspection passed', time: '1 day ago', icon: Shield, color: 'text-blue-400' },
                    { type: 'training', text: 'Defensive driving course', time: '3 days ago', icon: Award, color: 'text-purple-400' },
                  ].map((activity, i) => (
                    <div key={i} className="bg-dark-bg rounded-lg p-4 flex items-center gap-3 animate-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                      <activity.icon size={20} className={activity.color} />
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
