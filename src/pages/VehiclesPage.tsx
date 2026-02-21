import { useState } from 'react';
import { useVehicleStore } from '@/store/vehicleStore';
import { StatusPill } from '@/components/ui/StatusPill';
import { Plus, Search, Filter, ArrowUpDown, Edit, Trash2, Truck, X, Circle, Wrench, Loader2, CheckCircle2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import type { Vehicle, VehicleType, VehicleStatus } from '@/types';
import { useTranslation } from '@/lib/i18n';

export function VehiclesPage() {
  const { t } = useTranslation();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const addVehicle = useVehicleStore((state) => state.addVehicle);
  const deleteVehicle = useVehicleStore((state) => state.deleteVehicle);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'plate' | 'model' | 'type' | 'odometer'>('plate');
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    licensePlate: '',
    model: '',
    type: 'Truck' as VehicleType,
    maxCapacity: '',
    odometer: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter and sort vehicles
  const filteredVehicles = vehicles
    .filter((v) => {
      const matchesSearch =
        v.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || v.type === filterType;
      const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'plate':
          return a.licensePlate.localeCompare(b.licensePlate);
        case 'model':
          return a.model.localeCompare(b.model);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'odometer':
          return b.odometer - a.odometer;
        default:
          return 0;
      }
    });

  const handleOpenForm = () => {
    setShowForm(true);
    setFormData({
      licensePlate: '',
      model: '',
      type: 'Truck',
      maxCapacity: '',
      odometer: '',
    });
    setFormErrors({});
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      licensePlate: '',
      model: '',
      type: 'Truck',
      maxCapacity: '',
      odometer: '',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.licensePlate.trim()) {
      errors.licensePlate = t.vehicles.licensePlateRequired;
    } else if (vehicles.some(v => v.licensePlate === formData.licensePlate)) {
      errors.licensePlate = t.vehicles.licensePlateExists;
    }

    if (!formData.model.trim()) {
      errors.model = t.vehicles.modelRequired;
    }

    if (!formData.maxCapacity || Number(formData.maxCapacity) <= 0) {
      errors.maxCapacity = t.vehicles.validCapacityRequired;
    }

    if (!formData.odometer || Number(formData.odometer) < 0) {
      errors.odometer = t.vehicles.validOdometerRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const newVehicle: Omit<Vehicle, 'id'> = {
      vehicleId: `VEH-${Date.now()}`,
      licensePlate: formData.licensePlate.toUpperCase(),
      model: formData.model,
      type: formData.type,
      maxCapacity: Number(formData.maxCapacity),
      odometer: Number(formData.odometer),
      acquisitionCost: 50000,
      status: 'Available',
      region: 'North',
    };

    addVehicle(newVehicle);
    
    setIsSaving(false);
    setShowSuccess(true);

    // Highlight the new row
    setTimeout(() => {
      setHighlightedRow(newVehicle.vehicleId);
    }, 100);

    // Close form after success animation
    setTimeout(() => {
      setShowSuccess(false);
      handleCloseForm();
      setTimeout(() => setHighlightedRow(null), 2000);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (confirm(`${t.common.delete} ${t.dashboard.vehicleSingular}?`)) {
      deleteVehicle(id);
    }
  };

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case 'Available':
        return <Circle size={8} className="text-emerald-500 fill-emerald-500 animate-pulse" />;
      case 'On Trip':
        return <Circle size={8} className="text-blue-500 fill-blue-500 animate-ping" />;
      case 'In Shop':
        return <Wrench size={12} className="text-amber-500 animate-pulse" />;
      case 'Retired':
        return <Circle size={8} className="text-gray-500 fill-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{t.vehicles.title}</h1>
          <p className="text-sm text-gray-400">{vehicles.length} {t.vehicles.title.toLowerCase()}</p>
        </div>
        <button
          onClick={handleOpenForm}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          {t.vehicles.addNewVehicle}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-dark-card rounded-2xl p-4 shadow-lg border border-dark-border space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={t.vehicles.searchVehicles}
              className={`w-full pl-12 pr-4 py-3 bg-dark-bg border-2 border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 ${
                isSearchFocused ? 'shadow-lg' : ''
              }`}
            />
          </div>

          {/* Group By */}
          <button className="px-4 py-3 bg-dark-bg border-2 border-dark-border text-gray-300 rounded-xl hover:border-blue-500 transition-all duration-200 flex items-center gap-2">
            <Filter size={18} />
            {t.common.filter}
          </button>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-dark-bg border-2 border-dark-border text-gray-300 rounded-xl hover:border-blue-500 transition-all duration-200 outline-none cursor-pointer"
          >
            <option value="plate">{t.vehicles.sortBy} {t.vehicles.licensePlate}</option>
            <option value="model">{t.vehicles.sortBy} {t.vehicles.model}</option>
            <option value="type">{t.vehicles.sortBy} {t.vehicles.type}</option>
            <option value="odometer">{t.vehicles.sortBy} {t.vehicles.odometer}</option>
          </select>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-400 font-medium">{t.dashboard.filterBy}</span>
          
          {/* Type Filters */}
          <div className="flex gap-2">
            {['all', 'Truck', 'Van', 'Semi', 'Trailer'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterType === type
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-dark-hover text-gray-400 hover:text-gray-300'
                }`}
              >
                {type === 'all' ? t.vehicles.allTypes : type}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-dark-border"></div>

          {/* Status Filters */}
          <div className="flex gap-2">
            {['all', 'Available', 'On Trip', 'In Shop'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterStatus === status
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-dark-hover text-gray-400 hover:text-gray-300'
                }`}
              >
                {status === 'all' ? t.vehicles.allStatus : status}
              </button>
            ))}
          </div>

          {(filterType !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="ml-auto px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <X size={16} />
              {t.common.clear}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-card rounded-2xl shadow-lg border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors">
                  <div className="flex items-center gap-2">
                    {t.vehicles.licensePlate}
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.vehicles.model}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.vehicles.type}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.vehicles.capacity}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.vehicles.odometer}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.vehicles.status}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t.dashboard.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredVehicles.map((vehicle, index) => (
                <tr
                  key={vehicle.id}
                  className={`group hover:bg-dark-hover transition-all duration-200 cursor-pointer ${
                    highlightedRow === vehicle.vehicleId
                      ? 'bg-emerald-500/10 ring-2 ring-emerald-500/30'
                      : ''
                  }`}
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 50}ms both`,
                  }}
                >
                  <td className="px-6 py-4 text-sm text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {vehicle.licensePlate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Truck size={16} className="text-blue-500" />
                      </div>
                      <span className="text-sm text-gray-300">{vehicle.model}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{vehicle.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{formatNumber(vehicle.maxCapacity)} kg</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{formatNumber(vehicle.odometer)} km</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(vehicle.status)}
                      <StatusPill status={vehicle.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                        title={t.common.edit}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title={t.common.delete}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-16">
              <Truck size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 font-medium">{t.vehicles.noVehiclesFound}</p>
              <p className="text-sm text-gray-500 mt-1">{t.common.search}</p>
            </div>
          )}
        </div>
      </div>

      {/* New Vehicle Form - Slide-in Panel */}
      {showForm && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={handleCloseForm}
          ></div>

          {/* Form Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-card shadow-2xl z-50 animate-slide-in-right overflow-y-auto border-l border-dark-border">
            {/* Success Overlay */}
            {showSuccess && (
              <div className="absolute inset-0 bg-dark-bg/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                <div className="text-center">
                  <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4 animate-scale-in" />
                  <p className="text-xl font-bold text-white">{t.vehicles.vehicleAdded}</p>
                  <p className="text-sm text-gray-400 mt-2">{t.vehicles.saving}</p>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{t.vehicles.addNewVehicle}</h2>
                  <p className="text-sm text-gray-400 mt-1">{t.vehicles.vehicleDetails}</p>
                </div>
                <button
                  onClick={handleCloseForm}
                  className="w-10 h-10 bg-dark-hover hover:bg-dark-border rounded-lg flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* License Plate */}
              <div className="relative">
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  onFocus={() => setFocusedField('licensePlate')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                    formErrors.licensePlate
                      ? 'border-red-500 shake'
                      : focusedField === 'licensePlate'
                      ? 'border-blue-500 ring-4 ring-blue-500/20'
                      : 'border-dark-border'
                  } rounded-xl text-white placeholder-transparent outline-none transition-all duration-200`}
                  placeholder={t.vehicles.licensePlate}
                  required
                />
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focusedField === 'licensePlate' || formData.licensePlate
                      ? '-top-2.5 text-xs bg-dark-card px-2 text-blue-400'
                      : 'top-3 text-gray-500'
                  }`}
                >
                  {t.vehicles.licensePlate} *
                </label>
                {formErrors.licensePlate && (
                  <p className="text-xs text-red-400 mt-1 animate-shake">{formErrors.licensePlate}</p>
                )}
              </div>

              {/* Model */}
              <div className="relative">
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  onFocus={() => setFocusedField('model')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                    formErrors.model
                      ? 'border-red-500'
                      : focusedField === 'model'
                      ? 'border-blue-500 ring-4 ring-blue-500/20'
                      : 'border-dark-border'
                  } rounded-xl text-white placeholder-transparent outline-none transition-all duration-200`}
                  placeholder={t.vehicles.model}
                  required
                />
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focusedField === 'model' || formData.model
                      ? '-top-2.5 text-xs bg-dark-card px-2 text-blue-400'
                      : 'top-3 text-gray-500'
                  }`}
                >
                  {t.vehicles.model} *
                </label>
                {formErrors.model && (
                  <p className="text-xs text-red-400 mt-1 animate-shake">{formErrors.model}</p>
                )}
              </div>

              {/* Type */}
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
                  onFocus={() => setFocusedField('type')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                    focusedField === 'type' ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-dark-border'
                  } rounded-xl text-white outline-none transition-all duration-200 appearance-none cursor-pointer`}
                  required
                >
                  <option value="Truck">{t.vehicles.truck}</option>
                  <option value="Van">{t.vehicles.van}</option>
                  <option value="Semi">Semi</option>
                  <option value="Trailer">Trailer</option>
                </select>
                <label className="absolute -top-2.5 left-4 text-xs bg-dark-card px-2 text-blue-400">
                  {t.vehicles.type} *
                </label>
              </div>

              {/* Max Capacity */}
              <div className="relative">
                <input
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  onFocus={() => setFocusedField('maxCapacity')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                    formErrors.maxCapacity
                      ? 'border-red-500'
                      : focusedField === 'maxCapacity'
                      ? 'border-blue-500 ring-4 ring-blue-500/20'
                      : 'border-dark-border'
                  } rounded-xl text-white placeholder-transparent outline-none transition-all duration-200`}
                  placeholder={t.vehicles.maxCapacity}
                  min="0"
                  required
                />
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focusedField === 'maxCapacity' || formData.maxCapacity
                      ? '-top-2.5 text-xs bg-dark-card px-2 text-blue-400'
                      : 'top-3 text-gray-500'
                  }`}
                >
                  {t.vehicles.maxCapacity} (kg) *
                </label>
                {formErrors.maxCapacity && (
                  <p className="text-xs text-red-400 mt-1 animate-shake">{formErrors.maxCapacity}</p>
                )}
              </div>

              {/* Initial Odometer */}
              <div className="relative">
                <input
                  type="number"
                  value={formData.odometer}
                  onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                  onFocus={() => setFocusedField('odometer')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                    formErrors.odometer
                      ? 'border-red-500'
                      : focusedField === 'odometer'
                      ? 'border-blue-500 ring-4 ring-blue-500/20'
                      : 'border-dark-border'
                  } rounded-xl text-white placeholder-transparent outline-none transition-all duration-200`}
                  placeholder={t.vehicles.odometerReading}
                  min="0"
                  required
                />
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focusedField === 'odometer' || formData.odometer
                      ? '-top-2.5 text-xs bg-dark-card px-2 text-blue-400'
                      : 'top-3 text-gray-500'
                  }`}
                >
                  {t.vehicles.odometerReading} (km) *
                </label>
                {formErrors.odometer && (
                  <p className="text-xs text-red-400 mt-1 animate-shake">{formErrors.odometer}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-border transition-all duration-200 font-medium"
                  disabled={isSaving}
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t.vehicles.saving}
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      {t.vehicles.addVehicle}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
