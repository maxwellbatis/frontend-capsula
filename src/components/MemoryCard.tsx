import React from 'react';
import { useCapsules } from '@/hooks/useCapsules';
import { Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemoryCard = () => {
  const { capsules, loading } = useCapsules();
  const navigate = useNavigate();
  // Pega a cápsula mais antiga (primeira criada)
  const memory = capsules.length > 0 ? capsules[capsules.length - 1] : null;

  if (loading) {
    return <div className="amorarium-card p-6 mb-6 animate-float">Carregando lembrança...</div>;
  }

  if (!memory) {
    return null;
  }

  // Calcula tempo desde a criação
  const createdAt = memory.createdAt ? new Date(memory.createdAt) : null;
  const now = new Date();
  let diffText = '';
  if (createdAt) {
    const diffMs = now.getTime() - createdAt.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) diffText = 'Hoje';
    else if (diffDays === 1) diffText = 'Ontem';
    else if (diffDays < 30) diffText = `Há ${diffDays} dias`;
    else if (diffDays < 365) diffText = `Há ${Math.floor(diffDays / 30)} meses`;
    else diffText = `Há ${Math.floor(diffDays / 365)} anos`;
  }

  return (
    <div className="amorarium-card p-6 mb-6 animate-float">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Lembram-se disto?</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>{diffText}</span>
        </div>
      </div>
      <div className="aspect-video bg-gradient-to-br from-amorarium-peach to-amorarium-rose rounded-lg mb-4 overflow-hidden flex items-center justify-center">
        {memory.imageUrl ? (
          <img src={memory.imageUrl} alt={memory.title} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-2 fill-current" />
              <p className="text-sm opacity-90">{memory.title}</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{memory.content || 'Sem descrição.'}</p>
      <div className="flex items-center justify-between mt-4">
        <button
          className="text-amorarium-rose hover:text-amorarium-rose-dark transition-colors text-sm font-medium"
          onClick={() => memory && navigate(`/timeline?capsule=${memory.id}`)}
        >
          Ver cápsula completa
        </button>
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4 text-amorarium-rose fill-current" />
          <span className="text-sm text-gray-500">1</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
