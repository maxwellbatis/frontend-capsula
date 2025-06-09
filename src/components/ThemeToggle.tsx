
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-amorarium-cream hover:bg-amorarium-peach/20 transition-colors"
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-amorarium-rose" />
      ) : (
        <Sun className="w-5 h-5 text-amorarium-rose" />
      )}
    </button>
  );
};

export default ThemeToggle;
