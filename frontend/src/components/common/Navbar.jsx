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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <Trophy className="w-8 h-8" />
            Team Challenge
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'leader' ? '/leader/dashboard' : '/member/dashboard'}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 border-l pl-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/leaderboard"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Classement
                </Link>
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
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