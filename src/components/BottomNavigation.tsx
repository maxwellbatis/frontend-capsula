import React from 'react';
import { Home, Clock, Star, User, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', icon: Home, label: 'Hoje', path: '/' },
    { id: 'timeline', icon: Clock, label: 'Linha do Tempo', path: '/timeline' },
    { id: 'dreams', icon: Star, label: 'Sonhos', path: '/dreams' },
    { id: 'profile', icon: User, label: 'Perfil', path: '/profile' },
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => tab.path === currentPath);
    return activeTab ? activeTab.id : 'home';
  };

  const activeTab = getActiveTab();

  const handleLogout = () => {
    localStorage.removeItem('amorarium-token');
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-amorarium-peach/20 z-50 dark:bg-slate-800/90 dark:border-slate-600/20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-br from-amorarium-peach to-amorarium-rose text-white shadow-lg' 
                    : 'text-gray-500 hover:text-amorarium-rose dark:text-gray-400 dark:hover:text-amorarium-rose'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
          {/* Botão de sair */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-400 hover:text-red-400 transition-all duration-200"
            aria-label="Sair"
          >
            <LogOut className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
