import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Truck,
  Package,
  Wrench,
  Fuel,
  Users,
  DollarSign,
  LogOut,
  Menu,
  X,
  Activity,
  PanelLeft,
  PanelLeftClose,
  UserCircle,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingChat } from '@/components/FloatingChat';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n';

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (sidebarOpen && !isPinned) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSidebarOpen(false);
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [sidebarOpen, isPinned]);

  // Auto-pin on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsPinned(true);
        setSidebarOpen(true);
      } else {
        setIsPinned(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: t.nav.commandCenter, path: '/dashboard', roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
    { icon: Truck, label: t.nav.vehicles, path: '/vehicles', roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'] },
    { icon: Package, label: t.nav.trips, path: '/trips', roles: ['Fleet Manager', 'Dispatcher'] },
    { icon: Wrench, label: t.nav.maintenance, path: '/maintenance', roles: ['Fleet Manager', 'Safety Officer'] },
    { icon: Fuel, label: t.nav.fuelExpenses, path: '/fuel', roles: ['Fleet Manager', 'Financial Analyst'] },
    { icon: Users, label: t.nav.drivers, path: '/drivers', roles: ['Fleet Manager', 'Safety Officer', 'Dispatcher'] },
    { icon: DollarSign, label: t.nav.financialAnalytics, path: '/analytics', roles: ['Fleet Manager', 'Financial Analyst'] },
    { icon: MessageCircle, label: t.nav.aiAssistant, path: '/chat', roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
  ];

  const accessibleNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Backdrop Overlay */}
      {sidebarOpen && !isPinned && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          style={{ animationDuration: '0.25s' }}
        />
      )}

      {/* Animated Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-dark-card to-dark-card/95 border-r border-dark-border/50 shadow-2xl transition-all duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          !isPinned && 'rounded-tr-2xl rounded-br-2xl'
        )}
        style={{
          boxShadow: sidebarOpen ? '0 0 40px rgba(0, 0, 0, 0.5)' : 'none'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section with Live Indicator */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-dark-border/50 bg-dark-bg/30">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Truck size={22} className="text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" 
                     style={{ boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }} 
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white">FleetFlow</span>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <Activity size={10} />
                  <span>System Active</span>
                </div>
              </div>
            </div>
            {!isPinned && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* User Profile Card */}
          <div className="px-6 py-5 border-b border-dark-border/50 bg-dark-bg/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">{user?.name}</div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    {user?.role}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu with Staggered Animation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {accessibleNavItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => !isPinned && setSidebarOpen(false)}
                  className={cn(
                    'group relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 animate-fade-in',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationDuration: '0.3s'
                  }}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-scale-in" />
                  )}
                  
                  {/* Icon with Hover Animation */}
                  <div className={cn(
                    'transition-transform duration-200',
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  )}>
                    <item.icon size={20} className={isActive ? 'drop-shadow-lg' : ''} />
                  </div>
                  
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Subtle Glow Effect on Hover */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Profile & Logout Section */}
          <div className="p-4 border-t border-dark-border/50 bg-dark-bg/20 space-y-2">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  'group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 w-full',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <UserCircle size={20} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">{t.nav.profile}</span>
            </NavLink>
            
            <button
              onClick={handleLogout}
              className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all duration-200 w-full"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">{t.nav.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        'transition-all duration-300',
        isPinned ? 'lg:pl-72' : 'lg:pl-0'
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-dark-card/95 backdrop-blur-sm border-b border-dark-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={cn(
                  'p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105',
                  isPinned && 'lg:hidden'
                )}
              >
                <Menu size={24} />
              </button>
              
              {/* Desktop Pin/Unpin Toggle */}
              <button
                onClick={() => {
                  setIsPinned(!isPinned);
                  if (!isPinned) setSidebarOpen(true);
                }}
                className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
                title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
              >
                {isPinned ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-gray-400 text-sm hidden md:block">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              
              {/* Language Switcher */}
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Floating Chat Widget */}
      <FloatingChat />
    </div>
  );
}
