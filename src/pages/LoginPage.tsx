import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Truck } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const demoAccounts = [
    { email: 'manager@fleetflow.com', role: 'Fleet Manager' },
    { email: 'dispatcher@fleetflow.com', role: 'Dispatcher' },
    { email: 'safety@fleetflow.com', role: 'Safety Officer' },
    { email: 'analyst@fleetflow.com', role: 'Financial Analyst' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-2xl mb-4">
            <Truck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FleetFlow</h1>
          <p className="text-gray-400">Fleet & Logistics Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-dark-card border border-dark-border rounded-card p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dark
              required
            />
            
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dark
              required
            />

            {error && (
              <div className="bg-brand-red/20 border border-brand-red/30 text-brand-red px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 bg-dark-card border border-dark-border rounded-card p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Demo Accounts</h3>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword('password123');
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300"
              >
                <div className="font-medium">{account.role}</div>
                <div className="text-xs text-gray-500">{account.email}</div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500 text-center">
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
}
