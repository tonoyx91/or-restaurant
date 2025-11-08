import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const validateForm = () => {
    if (mode === 'register' && !name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const showSuccessNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-500 animate-slide-up';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('opacity-0', 'translate-y-[-1rem]');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };

  const submit = async () => {
    try {
      setError('');
      if (!validateForm()) return;
      
      setLoading(true);
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email, password } : { name, email, password };
      
      const res = await API.post(endpoint, payload);
      login(res.data.token, res.data.user);
      
      showSuccessNotification(mode === 'login' ? 
        'Welcome back! 👋' : 
        'Congratulations! Your account has been created successfully! 🎉'
      );
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-soft">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orangebrand to-orangelight rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-12 hover:rotate-0 transition-all duration-300">
            <span className="text-2xl text-white font-bold">OR</span>
          </div>
          <h2 className="text-3xl font-bold gradient-text">
            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {mode === 'login' ? 
              'Sign in to order your favorite food' : 
              'Join us to start ordering delicious food'}
          </p>
        </div>

        <div className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <input 
                className="input-primary pl-10" 
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          <div className="relative">
            <input 
              type="email"
              className="input-primary pl-10"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div className="relative">
            <input 
              type="password"
              className="input-primary pl-10"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <button 
            className={`btn-orange w-full flex items-center justify-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            onClick={submit}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          <div className="text-center">
            <button 
              className="text-gray-600 hover:text-orangebrand transition-colors"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 
                "Don't have an account? Sign up" : 
                "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

