import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Truck, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, Building2 } from 'lucide-react';
import type { UserRole } from '@/types';

type AuthMode = 'login' | 'register';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  // UI state
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Registration state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('Dispatcher');
  const [registerError, setRegisterError] = useState('');

  // Focus states for floating labels
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = login(loginEmail, loginPassword);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } else {
      setLoginError('Invalid email or password');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validation
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const success = register(registerName, registerEmail, registerPassword, registerRole);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } else {
      setRegisterError('Email already exists');
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setLoginError('');
    setRegisterError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-4 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
            <Truck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">FleetFlow</h1>
          <p className="text-sm text-gray-600">Smart Fleet & Logistics Command Center</p>
        </div>

        {/* Auth card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-8 animate-slide-up">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Success animation */}
          {showSuccess && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50 animate-fade-in">
              <div className="text-center">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4 animate-scale-in" />
                <p className="text-lg font-semibold text-gray-900">Success!</p>
                <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6 animate-slide-in">
              {/* Email field */}
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onFocus={() => setFocusedField('loginEmail')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder="Email address"
                />
                <label className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                  focusedField === 'loginEmail' || loginEmail
                    ? '-top-2.5 left-4 text-xs bg-white px-2 text-blue-600'
                    : 'top-1/2 -translate-y-1/2 text-gray-500'
                }`}>
                  {focusedField === 'loginEmail' || loginEmail ? 'Email' : ''}
                </label>
              </div>

              {/* Password field */}
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onFocus={() => setFocusedField('loginPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error message */}
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake">
                  {loginError}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Demo hint */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Demo: manager@fleetflow.com / password123
              </p>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5 animate-slide-in">
              {/* Name field */}
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  onFocus={() => setFocusedField('registerName')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder="Full name"
                />
              </div>

              {/* Email field */}
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  onFocus={() => setFocusedField('registerEmail')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder="Email address"
                />
              </div>

              {/* Role field */}
              <div className="relative">
                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={registerRole}
                  onChange={(e) => setRegisterRole(e.target.value as UserRole)}
                  onFocus={() => setFocusedField('registerRole')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
              </div>

              {/* Password field */}
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  onFocus={() => setFocusedField('registerPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder="Password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password field */}
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('registerConfirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error message */}
              {registerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake">
                  {registerError}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2026 FleetFlow. Enterprise Logistics Platform.
        </p>
      </div>
    </div>
  );
}
