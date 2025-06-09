import React from 'react';
import { Heart, Bell, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useCouple } from '@/hooks/useCouple';

const Header = () => {
  const { couple } = useCouple();
  
  // Calculate days together based on couple's anniversary
  const daysTogether = React.useMemo(() => {
    if (!couple?.anniversary) return 0;
    const anniversary = new Date(couple.anniversary);
    const today = new Date();
    // Zera o horário para comparar apenas a data local
    const annivDate = new Date(anniversary.getFullYear(), anniversary.getMonth(), anniversary.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diff = Math.round((todayDate.getTime() - annivDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [couple?.anniversary]);

  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-amorarium-peach/20 sticky top-0 z-50 dark:bg-slate-800/70 dark:border-slate-600/20">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-amorarium-rose fill-current animate-heart-beat" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amorarium-rose to-amorarium-gold bg-clip-text text-transparent">
                Amorarium
              </h1>
            </div>
          </div>

          <div className="text-center">
            {couple?.anniversary ? (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-300">Juntos há</p>
                <p className="text-xl font-bold text-amorarium-rose">{daysTogether} dias</p>
              </>
            ) : null}
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <button className="p-2 rounded-full bg-amorarium-cream hover:bg-amorarium-peach/20 transition-colors">
              <Bell className="w-5 h-5 text-amorarium-rose" />
            </button>
            <button className="p-2 rounded-full bg-amorarium-cream hover:bg-amorarium-peach/20 transition-colors">
              <Settings className="w-5 h-5 text-amorarium-rose" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
