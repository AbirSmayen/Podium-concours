import React from 'react';
import { LayoutDashboard, Users, Target, CheckCircle, UserPlus } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'teams', label: 'Équipes', icon: Users },
    { id: 'challenges', label: 'Défis', icon: Target },
    { id: 'scores', label: 'Scores', icon: CheckCircle },
    { id: 'requests', label: 'Demandes Leader', icon: UserPlus }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-purple-200/50 sticky top-[73px] z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 rounded-t-xl relative ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-b from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : ''}`} />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;


