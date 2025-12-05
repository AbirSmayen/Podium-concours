import React from 'react';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/20 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-purple-200">Gestion complète de la plateforme</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
              <p className="font-semibold text-white text-sm">{user.name}</p>
              <p className="text-xs text-purple-200">{user.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;