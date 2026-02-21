import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/lib/i18n';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  Building2,
  Award,
  Clock,
} from 'lucide-react';

export function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Editable fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [location, setLocation] = useState(user?.location || 'Mumbai, Maharashtra');
  const [department, setDepartment] = useState(user?.department || 'Fleet Operations');
  const [bio, setBio] = useState(user?.bio || 'Experienced fleet management professional dedicated to optimizing logistics operations.');

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateUser({
      name,
      email,
      phone,
      location,
      department,
      bio,
    });
    
    setIsSaving(false);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    // Reset to original values
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '+91 98765 43210');
    setLocation(user?.location || 'Mumbai, Maharashtra');
    setDepartment(user?.department || 'Fleet Operations');
    setBio(user?.bio || '');
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-xl flex items-center gap-3 animate-slide-down">
          <Shield size={20} />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Header with Edit Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.profile.title}</h1>
          <p className="text-gray-400">{t.profile.personalInfo}</p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
          >
            <Edit3 size={18} />
            {t.profile.editProfile}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200"
            >
              <X size={18} />
              {t.common.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSaving ? t.common.loading : t.profile.saveChanges}
            </button>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar Card */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {name.charAt(0).toUpperCase()}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110">
                    <Camera size={18} />
                  </button>
                )}
              </div>

              {/* Name & Role */}
              <h2 className="text-xl font-bold text-white mt-4 text-center">{name}</h2>
              <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                <Shield size={16} className="text-blue-400" />
                <span className="text-blue-400 font-medium text-sm">{user.role}</span>
              </div>

              {/* Quick Stats */}
              <div className="w-full mt-6 pt-6 border-t border-dark-border space-y-4">
                <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{t.profile.accountSettings}</span>
                  <span className="text-white font-medium">Jan 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Last Login</span>
                  <span className="text-white font-medium">Today</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Account Status</span>
                  <span className="text-green-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Permissions */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award size={20} className="text-blue-400" />
              Access Permissions
            </h3>
            <div className="space-y-3">
              {['Command Center', 'Vehicles', 'Trips', 'Drivers', 'Analytics'].map((permission, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">{permission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <UserIcon size={22} className="text-blue-400" />
              {t.profile.personalInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <UserIcon size={16} />
                  {t.auth.fullName}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                ) : (
                  <p className="text-white font-medium px-4 py-3 bg-dark-bg/50 rounded-xl">{name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Mail size={16} />
                  {t.auth.email}
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                ) : (
                  <p className="text-white font-medium px-4 py-3 bg-dark-bg/50 rounded-xl">{email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Phone size={16} />
                  {t.profile.department}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                ) : (
                  <p className="text-white font-medium px-4 py-3 bg-dark-bg/50 rounded-xl">{phone}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <MapPin size={16} />
                  {t.profile.location}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                ) : (
                  <p className="text-white font-medium px-4 py-3 bg-dark-bg/50 rounded-xl">{location}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Building2 size={16} />
                  {t.profile.department}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                ) : (
                  <p className="text-white font-medium px-4 py-3 bg-dark-bg/50 rounded-xl">{department}</p>
                )}
              </div>

              {/* Role (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Briefcase size={16} />
                  {t.auth.role}
                </label>
                <p className="text-white font-medium px-4 py-3 bg-dark-bg/50 rounded-xl opacity-75">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 space-y-2">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <UserIcon size={16} />
                {t.profile.bio}
              </label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-white px-4 py-3 bg-dark-bg/50 rounded-xl">{bio}</p>
              )}
            </div>
          </div>

          {/* Activity Overview */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Clock size={22} className="text-blue-400" />
              {t.dashboard.recentActivity}
            </h3>
            
            <div className="space-y-4">
              {[
                { action: 'Updated vehicle status', time: '2 hours ago', icon: '🚛' },
                { action: 'Reviewed trip report', time: '5 hours ago', icon: '📊' },
                { action: 'Approved maintenance request', time: '1 day ago', icon: '🔧' },
                { action: 'Added new driver', time: '2 days ago', icon: '👤' },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-dark-bg/50 rounded-xl hover:bg-dark-bg transition-all duration-200"
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
