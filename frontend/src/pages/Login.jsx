import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      const user = result.user || result;
      
      if (user) {
        // Redirection selon le rôle
        if (user.role === 'leader') {
          navigate('/leader/dashboard');
        } else if (user.role === 'member') {
          navigate('/member/dashboard');
        } else if (user.role === 'admin') {
          // Rediriger vers l'admin si c'est un admin
          window.location.href = 'http://localhost:3001/login';
        } else {
          navigate('/');
        }
      } else {
        setError('Erreur de connexion');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Connexion</h2>
            <p className="text-gray-600 text-lg">Accédez à votre compte</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slideIn">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-400"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Connexion...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </span>
            </button>
          </form>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                S'inscrire
              </Link>
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <Link
              to="/join-team"
              className="block w-full text-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium py-2.5 rounded-lg transition-all duration-300 text-sm"
            >
              Rejoindre une équipe
            </Link>
            <Link
              to="/leader-request"
              className="block w-full text-center bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-700 hover:from-purple-100 hover:to-indigo-100 font-medium py-2.5 rounded-lg transition-all duration-300 text-sm"
            >
              Devenir un leader d'équipe
            </Link>
            <Link
              to="/leaderboard"
              className="block w-full text-center text-gray-600 hover:text-gray-800 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Voir le classement public
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;