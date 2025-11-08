import React, { useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const submit = async () => {
    try {
      if (mode === 'login') {
        const res = await API.post('/auth/login', { email, password });
        login(res.data.token, res.data.user);
      } else {
        const res = await API.post('/auth/register', { name, email, password });
        login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
      {mode === 'register' && <input className="w-full p-2 border mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />}
      <input className="w-full p-2 border mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="w-full p-2 border mb-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn-orange w-full" onClick={submit}>{mode==='login' ? 'Login' : 'Register'}</button>
      <div className="mt-3 text-sm text-gray-600">
        <button className="underline" onClick={()=>setMode(mode==='login' ? 'register' : 'login')}>Switch to {mode==='login' ? 'Register' : 'Login'}</button>
      </div>
    </div>
  );
}
