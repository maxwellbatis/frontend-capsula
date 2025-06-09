import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('amorarium-token', data.token);
        navigate('/');
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    }
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="amorarium-card p-8 w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Entrar</h2>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 mb-2"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 mb-2 text-gray-800 placeholder-gray-400"
            required
          />
          <button type="submit" className="amorarium-button w-full">Entrar</button>
          <p className="text-sm text-gray-600 text-center mt-2">
            Não tem conta?{' '}
            <a href="/register" className="text-amorarium-rose underline">Cadastre-se</a>
          </p>
        </form>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Login;
