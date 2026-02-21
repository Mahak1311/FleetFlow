import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'manager@fleetflow.com',
    password: 'password123',
    name: 'Sarah Johnson',
    role: 'Fleet Manager',
  },
  {
    id: '2',
    email: 'dispatcher@fleetflow.com',
    password: 'password123',
    name: 'Mike Rodriguez',
    role: 'Dispatcher',
  },
  {
    id: '3',
    email: 'safety@fleetflow.com',
    password: 'password123',
    name: 'James Chen',
    role: 'Safety Officer',
  },
  {
    id: '4',
    email: 'analyst@fleetflow.com',
    password: 'password123',
    name: 'Emily Thompson',
    role: 'Financial Analyst',
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: (email: string, password: string) => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      set({ user: userWithoutPassword, isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  hasRole: (roles: string[]) => {
    const { user } = get();
    return user ? roles.includes(user.role) : false;
  },
}));
