import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './Button';
import { Shield, User, Lock, ArrowRight, RefreshCw } from 'lucide-react';

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const user = await res.json();
        login(user);
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection error. Please check if the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoMode = () => {
    const demoUser = `user_${Math.floor(Math.random() * 1000)}`;
    const demoPass = 'demo1234';
    setUsername(demoUser);
    setPassword(demoPass);
    setIsLogin(false);
    setError('Demo credentials ready. Click "Create Account" to start.');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px] bg-white rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden border border-black/5">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <Shield className="text-white w-6 h-6" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">
              {isLogin ? 'Sign in to Wardrobe' : 'Create an account'}
            </h1>
            <p className="text-sm text-[#9e9e9e] mt-2">
              {isLogin ? 'Enter your details to manage your assets' : 'Join us to start tracking your investments'}
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-3 ${
              error.includes('ready') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              <div className="mt-0.5">
                {error.includes('ready') ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              </div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9e9e9e]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full pl-11 pr-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9e9e9e]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              isLoading={isSubmitting}
              className="w-full py-4 rounded-xl bg-black hover:bg-black/90 text-white font-medium flex items-center justify-center gap-2 mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#f0f0f0] flex flex-col gap-3">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-[#4a4a4a] hover:text-black font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
            
            <button
              onClick={handleDemoMode}
              className="text-xs text-[#9e9e9e] hover:text-[#4a4a4a] transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Forgot credentials? Try Demo Mode
            </button>

            <button
              onClick={() => login({ id: 999, username: 'Guest' })}
              className="text-[10px] text-[#d1d1d1] hover:text-[#9e9e9e] transition-colors mt-4"
            >
              Bypass Login (Debug Mode)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
