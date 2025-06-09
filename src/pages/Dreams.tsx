import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Star, Plus, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useCouple } from '@/hooks/useCouple';
import CoupleBanner from '@/components/CoupleBanner';

const Dreams = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { couple } = useCouple();

  const pendingDreams = [
    {
      id: 1,
      title: 'Viagem para Paris',
      description: 'Conhecer a Torre Eiffel e caminhar pelas ruas românticas',
      progress: 65,
      targetDate: 'Dezembro 2024',
      location: 'Paris, França',
    },
    {
      id: 2,
      title: 'Casa na Praia',
      description: 'Comprar nossa casinha dos sonhos pertinho do mar',
      progress: 30,
      targetDate: 'Junho 2025',
      location: 'Litoral Sul',
    },
    {
      id: 3,
      title: 'Curso de Culinária',
      description: 'Aprender a cozinhar pratos especiais juntos',
      progress: 80,
      targetDate: 'Março 2024',
      location: 'Escola Local',
    },
  ];

  const completedDreams = [
    {
      id: 4,
      title: 'Primeira Viagem Juntos',
      description: 'Nossa lua de mel na praia',
      completedDate: 'Janeiro 2024',
      location: 'Bahia, Brasil',
    },
    {
      id: 5,
      title: 'Adotar um Pet',
      description: 'Nosso gatinho Luna chegou na família',
      completedDate: 'Novembro 2023',
      location: 'Casa',
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <CoupleBanner coupleId={couple?.id || null} />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Nossos Sonhos</h1>
          <p className="text-gray-600">Planos e conquistas que construímos juntos</p>
        </div>

        {/* Add new dream button */}
        <div className="mb-6">
          <button className="amorarium-button w-full flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Adicionar Novo Sonho</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl dark:bg-slate-700">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-amorarium-rose shadow-sm dark:bg-slate-600'
                : 'text-gray-600 hover:text-amorarium-rose dark:text-gray-300'
            }`}
          >
            Em Andamento
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-amorarium-rose shadow-sm dark:bg-slate-600'
                : 'text-gray-600 hover:text-amorarium-rose dark:text-gray-300'
            }`}
          >
            Realizados
          </button>
        </div>

        {/* Dreams content */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingDreams.map((dream) => (
              <div key={dream.id} className="amorarium-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{dream.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{dream.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{dream.targetDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{dream.location}</span>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-medium text-amorarium-rose">{dream.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-slate-600">
                        <div 
                          className="bg-gradient-to-r from-amorarium-rose to-amorarium-peach h-2 rounded-full transition-all duration-300"
                          style={{ width: `${dream.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Star className="w-6 h-6 text-amorarium-gold ml-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedDreams.map((dream) => (
              <div key={dream.id} className="amorarium-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{dream.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{dream.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Realizado em {dream.completedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{dream.location}</span>
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="w-6 h-6 text-amorarium-gold ml-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Dreams;
