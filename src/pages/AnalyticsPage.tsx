import { useState, useMemo, useEffect, useRef } from 'react';
import { useTripStore } from '@/store/tripStore';
import { useFuelStore } from '@/store/fuelStore';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useTranslation } from '@/lib/i18n';
import {
  DollarSign,
  TrendingUp,
  Download,
  Activity,
  AlertTriangle,
  FileText,
  BarChart3,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function AnalyticsPage() {
  const trips = useTripStore((state) => state.trips);
  const fuelLogs = useFuelStore((state) => state.logs);
  const maintenanceLogs = useMaintenanceStore((state) => state.logs);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const { t } = useTranslation();

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [chartCursorX, setChartCursorX] = useState<number | null>(null);
  
  const lineChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);

  // Animated counters
  const [displayFuelCost, setDisplayFuelCost] = useState(0);
  const [displayROI, setDisplayROI] = useState(0);
  const [displayUtilization, setDisplayUtilization] = useState(0);

  // Calculate metrics
  const metrics = useMemo(() => {
    const completedTrips = trips.filter((t) => t.status === 'Completed');
    const totalRevenue = completedTrips.reduce((sum, t) => sum + t.estimatedRevenue, 0);
    const fuelCosts = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
    const maintenanceCosts = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
    const totalOperationalCost = fuelCosts + maintenanceCosts;
    const netProfit = totalRevenue - totalOperationalCost;
    const roi = totalOperationalCost > 0 ? ((netProfit / totalOperationalCost) * 100) : 0;

    // Calculate utilization
    const activeVehicles = vehicles.filter(v => v.status === 'Available' || v.status === 'On Trip').length;
    const utilization = vehicles.length > 0 ? (activeVehicles / vehicles.length) * 100 : 0;

    return {
      totalRevenue,
      fuelCosts,
      maintenanceCosts,
      totalOperationalCost,
      netProfit,
      roi,
      utilization
    };
  }, [trips, fuelLogs, maintenanceLogs, vehicles]);

  // Fuel efficiency trend data
  const fuelEfficiencyData = useMemo(() => {
    const monthlyData: { month: string; efficiency: number; value: number }[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    
    // Simulated data with realistic trend
    const baseEfficiency = [12, 14, 13, 15, 16, 15, 17, 16, 18];
    
    months.forEach((month, index) => {
      monthlyData.push({
        month,
        efficiency: baseEfficiency[index],
        value: baseEfficiency[index]
      });
    });

    return monthlyData;
  }, []);

  // Top 5 costliest vehicles
  const costliestVehicles = useMemo(() => {
    const vehicleCosts = vehicles.map((vehicle) => {
      const fuel = fuelLogs
        .filter((log) => log.vehicleId === vehicle.id)
        .reduce((sum, log) => sum + log.cost, 0);

      const maintenance = maintenanceLogs
        .filter((log) => log.vehicleId === vehicle.id)
        .reduce((sum, log) => sum + log.cost, 0);

      const totalCost = fuel + maintenance;
      // Use vehicle ID hash for consistent change value
      const seed = vehicle.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const change = (seed % 2 === 0) ? ((seed % 15) + 1) : -((seed % 10) + 1);

      return {
        vehicleId: vehicle.vehicleId,
        name: vehicle.vehicleId,
        totalCost,
        fuel,
        maintenance,
        change
      };
    });

    return vehicleCosts
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);
  }, [vehicles, fuelLogs, maintenanceLogs]);

  // Monthly summary data
  const monthlySummary = useMemo(() => {
    const data = [
      { month: 'Jan', revenue: 1700000, fuelCost: 600000, maintenance: 200000, netProfit: 900000 },
      { month: 'Feb', revenue: 1850000, fuelCost: 650000, maintenance: 180000, netProfit: 1020000 },
      { month: 'Mar', revenue: 1950000, fuelCost: 680000, maintenance: 220000, netProfit: 1050000 },
      { month: 'Apr', revenue: 1800000, fuelCost: 620000, maintenance: 190000, netProfit: 990000 },
      { month: 'May', revenue: 2100000, fuelCost: 700000, maintenance: 250000, netProfit: 1150000 },
      { month: 'Jun', revenue: 2050000, fuelCost: 690000, maintenance: 210000, netProfit: 1150000 },
    ];
    return data;
  }, []);

  // Animated counter effect
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setDisplayFuelCost(metrics.fuelCosts * progress);
      setDisplayROI(metrics.roi * progress);
      setDisplayUtilization(metrics.utilization * progress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayFuelCost(metrics.fuelCosts);
        setDisplayROI(metrics.roi);
        setDisplayUtilization(metrics.utilization);
      }
    }, increment);

    return () => clearInterval(interval);
  }, [metrics]);

  // Format currency in lakhs
  const formatLakhs = (value: number) => {
    const lakhs = value / 100000;
    return `Rs. ${lakhs.toFixed(1)} L`;
  };

  // Line chart interaction
  const handleLineChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lineChartRef.current) return;
    const rect = lineChartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setChartCursorX(x);
  };

  const handleLineChartMouseLeave = () => {
    setChartCursorX(null);
    setHoveredPoint(null);
  };

  // Circular progress component for utilization
  const CircularProgress = ({ value }: { value: number }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width="180" height="180" className="transform -rotate-90">
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1500 ease-out"
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))',
              strokeLinecap: 'round'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-white">{value.toFixed(0)}%</span>
          <span className="text-sm text-gray-400 mt-1">Active</span>
        </div>
      </div>
    );
  };

  // Line Chart Component
  const LineChart = () => {
    const width = 600;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...fuelEfficiencyData.map(d => d.efficiency));
    const minValue = Math.min(...fuelEfficiencyData.map(d => d.efficiency));
    const valueRange = maxValue - minValue;

    const points = fuelEfficiencyData.map((d, i) => {
      const x = padding.left + (i / (fuelEfficiencyData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.efficiency - minValue) / valueRange) * chartHeight;
      return { x, y, data: d, index: i };
    });

    const pathD = points.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');

    // Gradient fill under line
    const areaPathD = `${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    return (
      <div
        ref={lineChartRef}
        className="relative"
        onMouseMove={handleLineChartMouseMove}
        onMouseLeave={handleLineChartMouseLeave}
      >
        <svg width={width} height={height} className="w-full h-auto">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.0)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = padding.top + (i / 4) * chartHeight;
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
            );
          })}

          {/* Area under line */}
          <path
            d={areaPathD}
            fill="url(#lineGradient)"
            className="animate-fade-in"
          />

          {/* Main line with animation */}
          <path
            d={pathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="line-draw"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))',
              willChange: 'stroke-dashoffset'
            }}
          />

          {/* Tracking line */}
          {chartCursorX !== null && (
            <line
              x1={chartCursorX}
              y1={padding.top}
              x2={chartCursorX}
              y2={height - padding.bottom}
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="animate-fade-in"
            />
          )}

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === i ? 8 : 5}
                fill="#3b82f6"
                stroke="#0a0e1a"
                strokeWidth="2"
                onMouseEnter={() => setHoveredPoint(i)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: hoveredPoint === i ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' : 'none'
                }}
              />
              {hoveredPoint === i && (
                <g className="animate-fade-in">
                  <rect
                    x={point.x - 60}
                    y={point.y - 60}
                    width="120"
                    height="50"
                    rx="8"
                    fill="#1a1f2e"
                    stroke="#3b82f6"
                    strokeWidth="1"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))' }}
                  />
                  <text x={point.x} y={point.y - 35} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
                    {point.data.month}
                  </text>
                  <text x={point.x} y={point.y - 20} textAnchor="middle" fill="#3b82f6" fontSize="16" fontWeight="700">
                    {point.data.efficiency} km/L
                  </text>
                  {i > 0 && (
                    <text x={point.x} y={point.y - 5} textAnchor="middle" fontSize="10">
                      <tspan fill={point.data.efficiency > fuelEfficiencyData[i-1].efficiency ? '#10b981' : '#ef4444'}>
                        {point.data.efficiency > fuelEfficiencyData[i-1].efficiency ? '↑' : '↓'} 
                        {Math.abs(point.data.efficiency - fuelEfficiencyData[i-1].efficiency).toFixed(1)}
                      </tspan>
                    </text>
                  )}
                </g>
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((point, i) => (
            <text
              key={i}
              x={point.x}
              y={height - padding.bottom + 25}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
            >
              {point.data.month}
            </text>
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map(i => {
            const value = minValue + (valueRange * (4 - i) / 4);
            const y = padding.top + (i / 4) * chartHeight;
            return (
              <text
                key={i}
                x={padding.left - 10}
                y={y + 5}
                textAnchor="end"
                fill="#6b7280"
                fontSize="12"
              >
                {value.toFixed(0)}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  // Bar Chart Component
  const BarChart = () => {
    const width = 500;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxCost = Math.max(...costliestVehicles.map(v => v.totalCost));
    const barWidth = chartWidth / costliestVehicles.length - 20;

    return (
      <div ref={barChartRef} className="relative">
        <svg width={width} height={height} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = padding.top + (i / 4) * chartHeight;
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
            );
          })}

          {/* Bars */}
          {costliestVehicles.map((vehicle, i) => {
            const barHeight = (vehicle.totalCost / maxCost) * chartHeight;
            const x = padding.left + i * (chartWidth / costliestVehicles.length) + 10;
            const y = padding.top + chartHeight - barHeight;
            const isHovered = hoveredBar === i;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={isHovered ? '#3b82f6' : 'rgba(59, 130, 246, 0.7)'}
                  rx="4"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="cursor-pointer bar-chart-rect"
                  data-index={i}
                  style={{
                    filter: isHovered ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))' : 'none',
                    opacity: hoveredBar !== null && hoveredBar !== i ? 0.3 : 1,
                    transformOrigin: 'center bottom',
                    transformBox: 'fill-box',
                    animationDelay: `${i * 100}ms`,
                    willChange: 'transform, opacity'
                  }}
                />

                {/* Tooltip */}
                {isHovered && (
                  <g className="animate-fade-in">
                    <rect
                      x={x + barWidth / 2 - 80}
                      y={y - 80}
                      width="160"
                      height="70"
                      rx="8"
                      fill="#1a1f2e"
                      stroke="#3b82f6"
                      strokeWidth="1"
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))' }}
                    />
                    <text x={x + barWidth / 2} y={y - 55} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
                      {vehicle.name}
                    </text>
                    <text x={x + barWidth / 2} y={y - 38} textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="700">
                      {formatLakhs(vehicle.totalCost)}
                    </text>
                    <text x={x + barWidth / 2} y={y - 20} textAnchor="middle" fontSize="10">
                      <tspan fill={vehicle.change > 0 ? '#ef4444' : '#10b981'}>
                        {vehicle.change > 0 ? '↑' : '↓'} {Math.abs(vehicle.change).toFixed(1)}%
                      </tspan>
                    </text>
                  </g>
                )}

                {/* X-axis labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="11"
                >
                  {vehicle.name}
                </text>
              </g>
            );
          })}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map(i => {
            const value = (maxCost * (4 - i) / 4) / 100000;
            const y = padding.top + (i / 4) * chartHeight;
            return (
              <text
                key={i}
                x={padding.left - 10}
                y={y + 5}
                textAnchor="end"
                fill="#6b7280"
                fontSize="12"
              >
                {value.toFixed(0)}L
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="text-blue-500" size={32} />
            Operational Analytics & Financial Reports
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Activity size={16} className="text-emerald-400 animate-pulse" />
            <span>{t.analytics.title}</span>
          </p>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Fuel Cost */}
        <div className="bg-gradient-to-br from-dark-card to-dark-card/50 border border-dark-border rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 animate-fade-in group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <DollarSign size={28} className="text-blue-400" />
            </div>
            {displayFuelCost > 600000 && (
              <AlertTriangle size={18} className="text-amber-400 animate-pulse" />
            )}
          </div>
          <h3 className="text-4xl font-bold text-white mb-2">
            {formatLakhs(displayFuelCost)}
          </h3>
          <p className="text-sm text-gray-400 mb-4">{t.fuel.totalCost}</p>
          
          {/* Sparkline preview on hover */}
          <div className="h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg width="100%" height="100%" className="overflow-visible">
              <path
                d="M 0 20 L 20 15 L 40 18 L 60 12 L 80 16 L 100 10"
                fill="none"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="2"
                className="animate-fade-in"
              />
            </svg>
          </div>
        </div>

        {/* Fleet ROI */}
        <div className="bg-gradient-to-br from-dark-card to-dark-card/50 border border-dark-border rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 animate-fade-in group" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={28} className="text-emerald-400" />
            </div>
            {displayROI > 0 && (
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)' }} />
            )}
          </div>
          <h3 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            {displayROI > 0 && <span className="text-emerald-400">+</span>}
            <span className={displayROI > 0 ? 'text-emerald-400' : 'text-red-400'} style={{
              filter: displayROI > 0 ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' : 'none'
            }}>
              {displayROI.toFixed(1)}%
            </span>
          </h3>
          <p className="text-sm text-gray-400 mb-4">Fleet ROI</p>
          
          {/* Sparkline preview on hover */}
          <div className="h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg width="100%" height="100%" className="overflow-visible">
              <path
                d="M 0 25 L 20 22 L 40 18 L 60 15 L 80 12 L 100 8"
                fill="none"
                stroke="rgba(16, 185, 129, 0.5)"
                strokeWidth="2"
                className="animate-fade-in"
              />
            </svg>
          </div>
        </div>

        {/* Utilization Rate */}
        <div className="bg-gradient-to-br from-dark-card to-dark-card/50 border border-dark-border rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 animate-fade-in flex items-center justify-center" style={{ animationDelay: '200ms' }}>
          <div className="text-center">
            <CircularProgress value={displayUtilization} />
            <p className="text-sm text-gray-400 mt-2">Utilization Rate</p>
            {displayUtilization < 70 && (
              <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1 justify-center animate-pulse">
                <AlertTriangle size={12} />
                Dead Stock Alert
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Efficiency Trend */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-blue-500/20 transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Fuel Efficiency Trend (km/L)</h3>
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <TrendingUp size={16} />
              <span>+8.2% vs last quarter</span>
            </div>
          </div>
          <LineChart />
        </div>

        {/* Top 5 Costliest Vehicles */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-blue-500/20 transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top 5 Costliest Vehicles</h3>
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle size={16} />
              <span>High Cost Alert</span>
            </div>
          </div>
          <BarChart />
        </div>
      </div>

      {/* Financial Summary Button */}
      <div className="flex justify-center animate-fade-in" style={{ animationDelay: '300ms' }}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 flex items-center gap-3"
        >
          <FileText size={20} />
          <span>Financial Summary of Month</span>
          <Download size={18} className="group-hover:animate-bounce" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer rounded-xl" />
        </button>
      </div>

      {/* Monthly Summary Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="p-6 border-b border-dark-border">
          <h3 className="text-xl font-semibold text-white">Monthly Financial Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-bg/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Month</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Revenue</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Fuel Cost</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Maintenance</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">{t.analytics.profit}</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((row, index) => {
                const isExpanded = expandedRow === index;
                const profitMargin = (row.netProfit / row.revenue) * 100;

                return (
                  <>
                    <tr
                      key={index}
                      className="border-b border-dark-border hover:bg-dark-hover cursor-pointer group transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 80}ms` }}
                      onClick={() => setExpandedRow(isExpanded ? null : index)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">{row.month}</span>
                          {profitMargin > 55 && (
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-emerald-400 font-semibold">{formatLakhs(row.revenue)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-gray-300">{formatLakhs(row.fuelCost)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-gray-300">{formatLakhs(row.maintenance)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-blue-400 font-semibold flex items-center justify-end gap-2">
                          {formatLakhs(row.netProfit)}
                          {row.netProfit > 1000000 && <TrendingUp size={16} className="text-emerald-400" />}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button className="text-gray-400 hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr className="bg-dark-bg/50 border-b border-dark-border animate-slide-down">
                        <td colSpan={6} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cost Breakdown */}
                            <div>
                              <h4 className="text-white font-semibold mb-4">Cost Breakdown</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-400">Fuel</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-32 bg-dark-border rounded-full h-2">
                                      <div
                                        className="h-2 bg-blue-500 rounded-full"
                                        style={{ width: `${(row.fuelCost / row.revenue) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-white font-medium w-16 text-right">
                                      {((row.fuelCost / row.revenue) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-400">Maintenance</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-32 bg-dark-border rounded-full h-2">
                                      <div
                                        className="h-2 bg-amber-500 rounded-full"
                                        style={{ width: `${(row.maintenance / row.revenue) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-white font-medium w-16 text-right">
                                      {((row.maintenance / row.revenue) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-400">Profit Margin</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-32 bg-dark-border rounded-full h-2">
                                      <div
                                        className="h-2 bg-emerald-500 rounded-full"
                                        style={{ width: `${profitMargin}%` }}
                                      />
                                    </div>
                                    <span className="text-emerald-400 font-medium w-16 text-right">
                                      {profitMargin.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Performance Indicators */}
                            <div>
                              <h4 className="text-white font-semibold mb-4">Performance Indicators</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-dark-card rounded-lg">
                                  <span className="text-gray-400">Efficiency Score</span>
                                  <span className="text-emerald-400 font-semibold">A+</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-dark-card rounded-lg">
                                  <span className="text-gray-400">Cost vs Budget</span>
                                  <span className="text-blue-400 font-semibold">-8.2%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-dark-card rounded-lg">
                                  <span className="text-gray-400">YoY Growth</span>
                                  <span className="text-emerald-400 font-semibold">+12.4%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-dark-card border border-blue-500/30 rounded-2xl z-50 overflow-hidden shadow-2xl shadow-blue-500/20 animate-scale-in">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FileText className="text-blue-500" size={28} />
                    Financial Summary Report
                  </h2>
                  <p className="text-gray-400 mt-1">Comprehensive monthly analytics</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-lg bg-dark-bg hover:bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                  <div className="text-gray-400 text-sm mb-2">{t.analytics.revenue}</div>
                  <div className="text-2xl font-bold text-emerald-400">{formatLakhs(metrics.totalRevenue)}</div>
                </div>
                <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                  <div className="text-gray-400 text-sm mb-2">Total Expenses</div>
                  <div className="text-2xl font-bold text-red-400">{formatLakhs(metrics.totalOperationalCost)}</div>
                </div>
                <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                  <div className="text-gray-400 text-sm mb-2">{t.analytics.profit}</div>
                  <div className="text-2xl font-bold text-blue-400">{formatLakhs(metrics.netProfit)}</div>
                </div>
              </div>

              {/* Export Options */}
              <div className="flex gap-4">
                <button className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl border border-blue-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3 group">
                  <Download size={20} className="group-hover:animate-bounce" />
                  Export as PDF
                </button>
                <button className="flex-1 px-6 py-4 bg-dark-bg hover:bg-dark-hover text-white font-semibold rounded-xl border border-dark-border hover:border-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 group">
                  <Download size={20} className="group-hover:animate-bounce" />
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom Animations */}
      <style>
        {`
          .line-draw {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawLine 2s ease-out forwards;
          }

          @keyframes drawLine {
            to {
              stroke-dashoffset: 0;
            }
          }

          .bar-chart-rect {
            transform: scaleY(0);
            animation: barGrowth 0.8s ease-out forwards;
            transition: opacity 0.3s ease, filter 0.3s ease;
          }

          @keyframes barGrowth {
            from {
              transform: scaleY(0);
            }
            to {
              transform: scaleY(1);
            }
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-shimmer {
            animation: shimmer 2s infinite;
          }

          @keyframes slide-down {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}
