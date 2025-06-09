import { useState, useEffect } from 'react';

interface Stats {
  totalCapsules: number;
  totalPhotos: number;
  maxStreak: number;
  currentStreak: number;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    totalCapsules: 0,
    totalPhotos: 0,
    maxStreak: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    const token = localStorage.getItem('amorarium-token');
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/couples/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}
