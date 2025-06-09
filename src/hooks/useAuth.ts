import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  coupleId?: string;
  coupleName?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('amorarium-token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (res.status === 401 || res.status === 403) {
          // Se o token for inválido ou expirado, remove do localStorage
          localStorage.removeItem('amorarium-token');
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Só faz a requisição se houver um token
    const token = localStorage.getItem('amorarium-token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao fazer login');
      }

      const { token } = await res.json();
      localStorage.setItem('amorarium-token', token);
      
      // Busca os dados do usuário após o login
      const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        return userData;
      }

      throw new Error('Erro ao buscar dados do usuário');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('amorarium-token');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};