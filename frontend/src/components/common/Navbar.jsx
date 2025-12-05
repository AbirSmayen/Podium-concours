import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, Trophy } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Podium Concours</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'leader' ? '/leader/dashboard' : '/member/dashboard'}
                  className="flex items-center gap-2 text-white/90 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <div className="flex items-center gap-3 border-l border-white/20 pl-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-white text-sm">{user?.name}</p>
                    <p className="text-xs text-white/70 capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/leaderboard"
                  className="text-white/90 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 hidden sm:block"
                >
                  Classement
                </Link>
                <Link
                  to="/login"
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Connexion
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;