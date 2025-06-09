
import React from 'react';
import { Calendar, Star } from 'lucide-react';

const DreamCard = () => {
  // Calcular dias restantes para um sonho
  const dreamDate = new Date('2024-12-25');
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((dreamDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="amorarium-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Nossos Sonhos</h3>
        <Star className="w-5 h-5 text-amorarium-gold fill-current animate-gentle-pulse" />
      </div>

      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amorarium-gold-light to-amorarium-gold mb-4">
          <Calendar className="w-10 h-10 text-white" />
        </div>
        
        <h4 className="text-xl font-bold text-gray-800 mb-2">Viagem dos Sonhos</h4>
        <p className="text-gray-600 text-sm mb-4">Japão - Terra do Sol Nascente</p>
        
        <div className="bg-gradient-to-r from-amorarium-peach to-amorarium-rose rounded-lg p-4 mb-4">
          <div className="text-3xl font-bold text-white mb-1">{daysLeft}</div>
          <div className="text-white/90 text-sm">dias restantes</div>
        </div>

        <div className="w-full bg-amorarium-cream rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-amorarium-rose to-amorarium-gold h-2 rounded-full transition-all duration-500"
            style={{ width: '65%' }}
          ></div>
        </div>
        
        <p className="text-xs text-gray-500">65% economizado</p>
      </div>
    </div>
  );
};

export default DreamCard;
