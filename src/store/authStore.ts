import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: string) => boolean;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  updateUser: (updates: Partial<Omit<User, 'id' | 'role'>>) => void;
}

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'manager@fleetflow.in',
    password: 'password123',
    name: 'Ananya Iyer',
    role: 'Fleet Manager',
  },
  {
    id: '2',
    email: 'dispatcher@fleetflow.in',
    password: 'password123',
    name: 'Arjun Mehta',
    role: 'Dispatcher',
  },
  {
    id: '3',
    email: 'safety@fleetflow.in',
    password: 'password123',
    name: 'Karan Malhotra',
    role: 'Safety Officer',
  },
  {
    id: '4',
    email: 'analyst@fleetflow.in',
    password: 'password123',
    name: 'Neha Gupta',
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
  
  register: (name: string, email: string, password: string, role: string) => {
    // Check if email already exists
    const exists = mockUsers.find((u) => u.email === email);
    if (exists) {
      return false;
    }

    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password,
      name,
      role: role as User['role'],
    };

    // Add to mock users
    mockUsers.push(newUser);

    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    set({ user: userWithoutPassword, isAuthenticated: true });
    return true;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  hasRole: (roles: string[]) => {
    const { user } = get();
    return user ? roles.includes(user.role) : false;
  },
  
  updateUser: (updates: Partial<Omit<User, 'id' | 'role'>>) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...updates } });
    }
  },
}));
