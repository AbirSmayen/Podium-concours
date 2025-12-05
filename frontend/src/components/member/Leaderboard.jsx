import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import socketService from '../../services/socket';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connecter le socket
    socketService.connect();
    
    fetchLeaderboard();

    // Écouter les mises à jour du classement
    socketService.onLeaderboardUpdate(() => {
      fetchLeaderboard();
    });

    // Nettoyer à la déconnexion
    return () => {
      socketService.off('leaderboard-updated');
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/teams/leaderboard');
      if (response.data.success && response.data.data) {
        const teamsWithRank = response.data.data.leaderboard.map((team, index) => ({
          ...team,
          rank: index + 1
        }));
        setTeams(teamsWithRank);
      } else {
        // Fallback si la structure est différente
        const response2 = await api.get('/teams');
        const teams = response2.data.success ? response2.data.data.teams : response2.data;
        const sortedTeams = (Array.isArray(teams) ? teams : [])
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .map((team, index) => ({ ...team, rank: index + 1 }));
        setTeams(sortedTeams);
      }
    } catch (error) {
      console.error('Erreur chargement classement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPodiumColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-orange-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement du classement...</div>;
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Classement Général</h3>

      {/* Podium - Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {teams.slice(0, 3).map((team) => (
          <div
            key={team._id}
            className={`bg-gradient-to-br ${getPodiumColor(team.rank)} text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition`}
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {getRankIcon(team.rank)}
              </div>
              {team.logo ? (
                typeof team.logo === 'string' && team.logo.startsWith('http') ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-4 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-4 flex items-center justify-center text-4xl bg-white/20">
                    {team.logo}
                  </div>
                )
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-4 flex items-center justify-center text-4xl bg-white/20">
                  🏆
                </div>
              )}
              <h4 className="text-2xl font-bold mb-2">{team.name}</h4>
              <p className="text-3xl font-bold mb-1">{team.score} pts</p>
              <p className="text-sm opacity-90">Position #{team.rank}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Liste complète */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Équipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membres
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Badges
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team) => (
              <tr
                key={team._id}
                className={`hover:bg-gray-50 ${team.rank <= 3 ? 'bg-yellow-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      #{team.rank}
                    </span>
                    {team.rank <= 3 && getRankIcon(team.rank)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {team.logo ? (
                      typeof team.logo === 'string' && team.logo.startsWith('http') ? (
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gray-100">
                          {team.logo}
                        </div>
                      )
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gray-100">
                        🏆
                      </div>
                    )}
                    <span className="font-semibold text-gray-900">{team.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xl font-bold text-indigo-600">
                    {team.score} pts
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {team.members?.length || 0} membres
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {team.badges?.slice(0, 3).map((badge, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                        title={badge}
                      >
                        🏆
                      </span>
                    ))}
                    {team.badges?.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{team.badges.length - 3}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;