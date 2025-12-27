
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dogName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, dogName }) => {
  const tabs = [
    { id: 'home', icon: '🏡', label: '우리집' },
    { id: 'diary', icon: '📔', label: '일기장' },
    { id: 'friends', icon: '🐩', label: '친구들' },
    { id: 'community', icon: '🐾', label: '놀이터' },
    { id: 'map', icon: '🏥', label: '케어숍' },
    { id: 'my', icon: '🧡', label: '내정보' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl relative pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
            👋
          </div>
          <span className="font-bold text-xl tracking-tight text-orange-600">쓰담</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/30">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 flex justify-around py-3 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 transition-all duration-300 relative group ${
                isActive ? 'scale-110' : 'opacity-60 grayscale-[0.5]'
              }`}
            >
              <div className={`text-2xl transition-transform duration-300 ${isActive ? 'translate-y-[-2px]' : ''}`}>
                {tab.icon}
              </div>
              <span className={`text-[9px] font-black transition-colors duration-300 ${
                isActive ? 'text-orange-600' : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
