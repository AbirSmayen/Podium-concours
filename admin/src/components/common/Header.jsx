import React from 'react';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg border-b-4 border-indigo-600">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-10 h-10 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Gestion complète de la plateforme</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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