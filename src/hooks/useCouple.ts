import { useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export interface CoupleProfile {
  id?: string;
  name?: string;
  description?: string;
  anniversary?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  createdAt?: string;
  users?: Array<{
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
  }>;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  bannerUrl?: string;
  description?: string;
  anniversary?: string;
}

export function useCouple() {
  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('amorarium-token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${BACKEND_URL}/api/couples/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Não está em casal');
        const data = await res.json();
        setCouple(data.couple || null);
        setUser(data.user || null);
      })
      .catch(() => {
        setCouple(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateCoupleName = async (name: string) => {
    try {
      const token = localStorage.getItem('amorarium-token');
      if (!token) throw new Error('Não autorizado');

      const res = await fetch(`${BACKEND_URL}/api/couples/name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao atualizar nome');
      }

      const updatedCouple = await res.json();
      setCouple(updatedCouple.couple);
      return updatedCouple.couple;
    } catch (error) {
      console.error('Erro ao atualizar nome do casal:', error);
      throw error;
    }
  };

  return {
    couple,
    user,
    loading,
    error,
    updateCoupleName,
    refreshCouple: () => useCouple(),
  };
}
