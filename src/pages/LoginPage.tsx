import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/lib/i18n';
import { Truck, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, Building2 } from 'lucide-react';
import type { UserRole } from '@/types';

// Google SVG Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Microsoft SVG Icon Component
const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#f25022" d="M1 1h10v10H1z"/>
    <path fill="#00a4ef" d="M13 1h10v10H13z"/>
    <path fill="#7fba00" d="M1 13h10v10H1z"/>
    <path fill="#ffb900" d="M13 13h10v10H13z"/>
  </svg>
);

// GitHub SVG Icon Component  
const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

type AuthMode = 'login' | 'register';

export function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      setLoginError(t.auth.invalidEmailOrPassword);
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
      setRegisterError(t.auth.passwordsDoNotMatch);
      setIsLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError(t.auth.passwordRequired);
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

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setLoginError('');
    setRegisterError('');
    
    try {
      // Simulate OAuth flow - In production, this would redirect to Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful OAuth response
      const mockGoogleUser = {
        email: 'user@gmail.com',
        name: 'Google User',
        role: 'Fleet Manager' as UserRole,
      };
      
      // Auto-login with Google account
      const success = login(mockGoogleUser.email, 'google-oauth-token');
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        // If user doesn't exist, auto-register
        register(mockGoogleUser.name, mockGoogleUser.email, 'google-oauth-token', mockGoogleUser.role);
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (error) {
      setLoginError('Failed to authenticate with Google');
      setIsLoading(false);
    }
  };

  const handleMicrosoftAuth = async () => {
    setIsLoading(true);
    setLoginError('');
    setRegisterError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMicrosoftUser = {
        email: 'user@outlook.com',
        name: 'Microsoft User',
        role: 'Fleet Manager' as UserRole,
      };
      
      const success = login(mockMicrosoftUser.email, 'microsoft-oauth-token');
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        register(mockMicrosoftUser.name, mockMicrosoftUser.email, 'microsoft-oauth-token', mockMicrosoftUser.role);
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (error) {
      setLoginError('Failed to authenticate with Microsoft');
      setIsLoading(false);
    }
  };

  const handleGitHubAuth = async () => {
    setIsLoading(true);
    setLoginError('');
    setRegisterError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockGitHubUser = {
        email: 'user@github.com',
        name: 'GitHub User',
        role: 'Fleet Manager' as UserRole,
      };
      
      const success = login(mockGitHubUser.email, 'github-oauth-token');
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        register(mockGitHubUser.name, mockGitHubUser.email, 'github-oauth-token', mockGitHubUser.role);
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (error) {
      setLoginError('Failed to authenticate with GitHub');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated gradient blob background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-300 to-violet-400 rounded-full mix-blend-multiply filter blur-3xl animate-gradient-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-violet-300 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-gradient-blob-delayed"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-gradient-blob-slow"></div>
      </div>

      {/* Floating truck and route line SVGs */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        {/* Truck 1 - top left */}
        <svg className="absolute top-32 left-[10%] w-32 h-32 animate-float-slow blur-[0.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
          <path d="M15 6h5l3 3v6h-2" />
        </svg>

        {/* Route line 1 - middle */}
        <svg className="absolute top-1/2 left-[20%] w-64 h-32 animate-float-diagonal blur-[0.5px]" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5">
          <path d="M 10 50 Q 50 20, 100 50 T 190 50" strokeLinecap="round"/>
          <circle cx="10" cy="50" r="3" fill="currentColor"/>
          <circle cx="100" cy="50" r="3" fill="currentColor"/>
          <circle cx="190" cy="50" r="3" fill="currentColor"/>
        </svg>

        {/* Truck 2 - bottom right */}
        <svg className="absolute bottom-40 right-[15%] w-28 h-28 animate-float-delayed blur-[0.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
          <path d="M15 6h5l3 3v6h-2" />
        </svg>

        {/* Route line 2 - diagonal */}
        <svg className="absolute top-[20%] right-[25%] w-48 h-48 animate-float-reverse blur-[0.5px]" viewBox="0 0 150 150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5">
          <path d="M 20 130 Q 75 90, 80 50 Q 85 10, 130 20" strokeLinecap="round"/>
          <circle cx="20" cy="130" r="3" fill="currentColor"/>
          <circle cx="80" cy="50" r="3" fill="currentColor"/>
          <circle cx="130" cy="20" r="3" fill="currentColor"/>
        </svg>

        {/* Route line 3 - horizontal wave */}
        <svg className="absolute bottom-[25%] left-[15%] w-72 h-24 animate-float-horizontal blur-[0.5px]" viewBox="0 0 240 80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5">
          <path d="M 10 40 Q 60 20, 120 40 Q 180 60, 230 40" strokeLinecap="round"/>
          <circle cx="10" cy="40" r="3" fill="currentColor"/>
          <circle cx="120" cy="40" r="3" fill="currentColor"/>
          <circle cx="230" cy="40" r="3" fill="currentColor"/>
        </svg>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-4 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer animate-fade-in" style={{ animationDuration: '0.6s' }}>
            <Truck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>FleetFlow</h1>
          <p className="text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.4s' }}>Smart Fleet & Logistics Command Center</p>
        </div>

        {/* Auth card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-8 animate-scale-in" style={{ animationDelay: '0.5s' }}>
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
              {t.auth.login}
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
              {t.auth.register}
            </button>
          </div>

          {/* Success animation */}
          {showSuccess && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50 animate-fade-in">
              <div className="text-center">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4 animate-scale-in" />
                <p className="text-lg font-semibold text-gray-900">{t.auth.success}</p>
                <p className="text-sm text-gray-600">{t.auth.redirecting}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="relative animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onFocus={() => setFocusedField('loginEmail')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder={t.auth.emailAddress}
                />
                <label className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                  focusedField === 'loginEmail' || loginEmail
                    ? '-top-2.5 left-4 text-xs bg-white px-2 text-blue-600'
                    : 'top-1/2 -translate-y-1/2 text-gray-500'
                }`}>
                  {focusedField === 'loginEmail' || loginEmail ? t.auth.email : ''}
                </label>
              </div>

              {/* Password field */}
              <div className="relative animate-fade-in" style={{ animationDelay: '0.85s' }}>
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onFocus={() => setFocusedField('loginPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder={t.auth.password}
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
                    {t.auth.signingIn}
                  </>
                ) : (
                  t.auth.signIn
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: '1s' }}>
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <GoogleIcon />
                  {t.auth.continueWithGoogle}
                </button>

                {/* Microsoft Sign In */}
                <button
                  type="button"
                  onClick={handleMicrosoftAuth}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <MicrosoftIcon />
                  {t.auth.continueWithMicrosoft}
                </button>

                {/* GitHub Sign In */}
                <button
                  type="button"
                  onClick={handleGitHubAuth}
                  disabled={isLoading}
                  className="w-full bg-gray-900 border-2 border-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 hover:border-gray-800 hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <GitHubIcon />
                  {t.auth.continueWithGitHub}
                </button>
              </div>

              {/* Demo hint */}
              <p className="text-xs text-center text-gray-500 mt-4">
                {t.auth.demoHint}
              </p>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name field */}
              <div className="relative animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  onFocus={() => setFocusedField('registerName')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder={t.auth.fullName}
                />
              </div>

              {/* Email field */}
              <div className="relative anime-fade-in" style={{ animationDelay: '0.8s' }}>
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  onFocus={() => setFocusedField('registerEmail')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder={t.auth.emailAddress}
                />
              </div>

              {/* Role field */}
              <div className="relative animate-fade-in" style={{ animationDelay: '0.9s' }}>
                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={registerRole}
                  onChange={(e) => setRegisterRole(e.target.value as UserRole)}
                  onFocus={() => setFocusedField('registerRole')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="Fleet Manager">{t.auth.fleetManager}</option>
                  <option value="Dispatcher">{t.auth.dispatcher}</option>
                  <option value="Safety Officer">{t.auth.safetyOfficer}</option>
                  <option value="Financial Analyst">{t.auth.financialAnalyst}</option>
                </select>
              </div>

              {/* Password field */}
              <div className="relative animate-fade-in" style={{ animationDelay: '1s' }}>
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  onFocus={() => setFocusedField('registerPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder={t.auth.passwordMinLength}
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
              <div className="relative animate-fade-in" style={{ animationDelay: '1.1s' }}>
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('registerConfirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900"
                  placeholder={t.auth.confirmPasswordLabel}
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 animate-fade-in"
                style={{ animationDelay: '1.2s' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {t.auth.creatingAccount}
                  </>
                ) : (
                  t.auth.createAccount
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">{t.auth.orDivider}</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: '1.3s' }}>
                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <GoogleIcon />
                  {t.auth.continueWithGoogle}
                </button>

                {/* Microsoft Sign Up */}
                <button
                  type="button"
                  onClick={handleMicrosoftAuth}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <MicrosoftIcon />
                  {t.auth.continueWithMicrosoft}
                </button>

                {/* GitHub Sign Up */}
                <button
                  type="button"
                  onClick={handleGitHubAuth}
                  disabled={isLoading}
                  className="w-full bg-gray-900 border-2 border-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 hover:border-gray-800 hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <GitHubIcon />
                  {t.auth.continueWithGitHub}
                </button>
              </div>
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
