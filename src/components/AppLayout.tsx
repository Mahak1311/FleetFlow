import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Command Center', path: '/dashboard', roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
    { icon: Truck, label: 'Vehicles', path: '/vehicles', roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'] },
    { icon: Package, label: 'Trips', path: '/trips', roles: ['Fleet Manager', 'Dispatcher'] },
    { icon: Wrench, label: 'Maintenance', path: '/maintenance', roles: ['Fleet Manager', 'Safety Officer'] },
    { icon: Fuel, label: 'Fuel & Expenses', path: '/fuel', roles: ['Fleet Manager', 'Financial Analyst'] },
    { icon: Users, label: 'Drivers', path: '/drivers', roles: ['Fleet Manager', 'Safety Officer', 'Dispatcher'] },
    { icon: DollarSign, label: 'Financial Analytics', path: '/analytics', roles: ['Fleet Manager', 'Financial Analyst'] },
  ];

  const accessibleNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-dark-border transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-dark-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                <Truck size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">FleetFlow</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-white/10 text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-dark-border">
            <div className="text-sm text-gray-400">Signed in as</div>
            <div className="text-white font-medium">{user?.name}</div>
            <div className="text-xs text-brand-blue mt-1">{user?.role}</div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {accessibleNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-dark-border">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors w-full"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-gray-400"
          >
            <Menu size={24} />
          </button>
          <div className="text-gray-400 text-sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
