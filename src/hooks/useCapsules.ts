import { useState, useEffect } from 'react';

export interface Capsule {
  id: number;
  title: string;
  content?: string;
  imageUrl?: string;
  musicUrl?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export function useCapsules() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCapsules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('amorarium-token');
      if (!token) throw new Error('Não autenticado');
      const res = await fetch(`${BACKEND_URL}/api/capsules`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao buscar cápsulas');
      const data = await res.json();
      setCapsules(data);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createCapsule = async (capsule: Partial<Capsule> & { imageFile?: File }) => {
    try {
      const token = localStorage.getItem('amorarium-token');
      if (!token) throw new Error('Não autenticado');
      let data;
      if (capsule.imageFile) {
        // Upload da imagem
        const formData = new FormData();
        formData.append('file', capsule.imageFile);
        const uploadRes = await fetch(`${BACKEND_URL}/api/capsules/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Erro ao fazer upload da imagem');
        const uploadData = await uploadRes.json();
        capsule.imageUrl = uploadData.url;
      }
      // Criação da cápsula
      const res = await fetch(`${BACKEND_URL}/api/capsules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: capsule.title,
          content: capsule.content,
          imageUrl: capsule.imageUrl,
          musicUrl: capsule.musicUrl,
          location: capsule.location,
        }),
      });
      if (!res.ok) throw new Error('Erro ao criar cápsula');
      data = await res.json();
      setCapsules((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      throw err;
    }
  };

  const updateCapsule = async (id: number, capsule: Partial<Capsule>) => {
    try {
      const token = localStorage.getItem('amorarium-token');
      if (!token) throw new Error('Não autenticado');
      const res = await fetch(`${BACKEND_URL}/api/capsules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(capsule),
      });
      if (!res.ok) throw new Error('Erro ao atualizar cápsula');
      const data = await res.json();
      setCapsules((prev) => prev.map((c) => (c.id === id ? data : c)));
      return data;
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      throw err;
    }
  };

  const deleteCapsule = async (id: number) => {
    try {
      const token = localStorage.getItem('amorarium-token');
      if (!token) throw new Error('Não autenticado');
      const res = await fetch(`${BACKEND_URL}/api/capsules/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Erro ao deletar cápsula');
      setCapsules((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      throw err;
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  return {
    capsules,
    loading,
    error,
    fetchCapsules,
    createCapsule,
    updateCapsule,
    deleteCapsule,
  };
}
