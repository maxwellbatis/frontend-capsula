import React, { useRef } from 'react';
import Header from '@/components/Header';
import CapsuleCard from '@/components/CapsuleCard';
import MemoryCard from '@/components/MemoryCard';
import DreamCard from '@/components/DreamCard';
import BottomNavigation from '@/components/BottomNavigation';
import CoupleBanner from '@/components/CoupleBanner';
import { useCouple } from '@/hooks/useCouple';
import { useStats } from '@/hooks/useStats';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { couple } = useCouple();
  const { stats, loading, refetch: refetchStats } = useStats();
  const capsuleCardRef = useRef<{ openModal: () => void }>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <CoupleBanner coupleId={couple?.id || null} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal - Cápsula do dia */}
          <div className="lg:col-span-2">
            <CapsuleCard ref={capsuleCardRef} onCapsuleCreated={refetchStats} />
            <MemoryCard />
          </div>

          {/* Sidebar - Sonhos e estatísticas */}
          <div className="lg:col-span-1">
            <DreamCard />
            
            {/* Card de estatísticas rápidas */}
            <div className="amorarium-card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Nossa Jornada</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cápsulas criadas</span>
                  <span className="font-bold text-amorarium-rose">{loading ? '...' : stats.totalCapsules}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fotos guardadas</span>
                  <span className="font-bold text-amorarium-rose">{loading ? '...' : stats.totalPhotos}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sequência de dias</span>
                  <span className="font-bold text-amorarium-gold">{loading ? '...' : stats.maxStreak}</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-amorarium-peach/30 pt-3">
                  <span className="text-sm text-gray-600">Dias seguidos</span>
                  <span className="font-bold text-amorarium-rose text-lg">🔥 {loading ? '...' : stats.currentStreak}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de ações rápidas */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="amorarium-card p-4 text-center hover:scale-105 transition-transform" onClick={() => capsuleCardRef.current?.openModal()}>
              <div className="text-2xl mb-2">📝</div>
              <span className="text-sm font-medium text-gray-700">Diário</span>
            </button>
            
            <button className="amorarium-card p-4 text-center hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">🎯</div>
              <span className="text-sm font-medium text-gray-700">Novo Sonho</span>
            </button>
            
            <button className="amorarium-card p-4 text-center hover:scale-105 transition-transform" onClick={() => navigate('/gallery')}>
              <div className="text-2xl mb-2">🖼️</div>
              <span className="text-sm font-medium text-gray-700">Galeria</span>
            </button>
            
            <button className="amorarium-card p-4 text-center hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">🎵</div>
              <span className="text-sm font-medium text-gray-700">Playlist</span>
            </button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Index;
