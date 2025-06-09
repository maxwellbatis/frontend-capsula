import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Music, Image as ImageIcon, MapPin } from 'lucide-react';
import CoupleBanner from '@/components/CoupleBanner';
import { useCouple } from '@/hooks/useCouple';
import { useCapsules } from '@/hooks/useCapsules';

const Timeline = () => {
  const { couple } = useCouple();
  const { capsules, loading, error } = useCapsules();

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <CoupleBanner coupleId={couple?.id || null} />
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Nossa Linha do Tempo</h1>
          <p className="text-gray-600">Todos os momentos especiais que guardamos juntos</p>
        </div>
        <div className="space-y-6">
          {loading ? <div>Carregando cápsulas...</div> : error ? <div className="text-red-500">{error}</div> : (
            capsules.map((capsule) => (
              <div key={capsule.id} className="relative">
                <div className="flex items-start space-x-4">
                  <div className="bg-amorarium-peach p-3 rounded-full text-white flex-shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="amorarium-card flex-1 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-amorarium-rose">{capsule.title}</h3>
                      <span className="text-sm text-gray-500">{capsule.createdAt ? new Date(capsule.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{capsule.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {capsule.imageUrl && <img src={capsule.imageUrl} alt="imagem" className="w-32 h-20 object-cover rounded" />}
                      {capsule.musicUrl && <span className="inline-flex items-center gap-1 text-amorarium-gold text-sm"><Music className="w-4 h-4" /> <a href={capsule.musicUrl} target="_blank" rel="noopener noreferrer">Música</a></span>}
                      {capsule.location && <span className="inline-flex items-center gap-1 text-amorarium-rose text-sm"><MapPin className="w-4 h-4" />{capsule.location}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-8 text-center">
          <button className="amorarium-button">
            Ver Mais Momentos
          </button>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Timeline;
