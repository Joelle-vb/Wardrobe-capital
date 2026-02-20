import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './Button';

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
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
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-theme-bg p-4">
      <div className="w-full max-w-md bg-theme-card rounded-xl shadow-lg p-8 border border-theme-border">
        <h2 className="text-2xl font-heading font-bold text-theme-text mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-muted mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-theme-border bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-theme-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-theme-border bg-theme-bg text-theme-text focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary outline-none transition-all"
              required
            />
          </div>

          <Button type="submit" className="w-full py-3 mt-2">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-theme-muted hover:text-theme-text underline transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};
