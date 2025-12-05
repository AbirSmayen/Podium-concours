import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Trophy, LogIn } from 'lucide-react';

const PublicLeaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/teams/leaderboard');
      if (response.data.success && response.data.data) {
        const leaderboard = response.data.data.leaderboard || [];
        setTeams(leaderboard.slice(0, 10)); // Top 10
      } else {
        // Fallback
        const response2 = await api.get('/teams');
        const teams = response2.data.success 
          ? (response2.data.data?.teams || [])
          : (Array.isArray(response2.data) ? response2.data : []);
        const sortedTeams = teams
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, 10);
        setTeams(sortedTeams);
      }
    } catch (error) {
      console.error('Erreur chargement classement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">
            Classement des Équipes
          </h1>
          <p className="text-xl text-indigo-200">
            Découvrez le classement en temps réel du challenge
          </p>
        </div>

        {/* Podium */}
        {!loading && teams.length >= 3 && (
          <div className="flex justify-center items-end gap-4 mb-12">
            {/* 2ème place */}
            <div className="flex-1 max-w-xs">
              <div className="bg-gradient-to-br from-gray-300 to-gray-500 rounded-t-lg p-6 text-center">
                <div className="text-6xl mb-2">🥈</div>
                {teams[1]?.logo ? (
                  typeof teams[1].logo === 'string' && teams[1].logo.startsWith('http') ? (
                    <img
                      src={teams[1].logo}
                      alt={teams[1].name}
                      className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-3 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-3 flex items-center justify-center text-4xl bg-white/20">
                      {teams[1].logo}
                    </div>
                  )
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-3 flex items-center justify-center text-4xl bg-white/20">
                    🏆
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">
                  {teams[1]?.name}
                </h3>
                <p className="text-3xl font-bold text-white">
                  {teams[1]?.score} pts
                </p>
              </div>
              <div className="bg-gray-400 h-32 rounded-b-lg"></div>
            </div>

            {/* 1ère place */}
            <div className="flex-1 max-w-xs">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-t-lg p-6 text-center">
                <div className="text-7xl mb-2">🏆</div>
                {teams[0]?.logo ? (
                  typeof teams[0].logo === 'string' && teams[0].logo.startsWith('http') ? (
                    <img
                      src={teams[0].logo}
                      alt={teams[0].name}
                      className="w-24 h-24 mx-auto rounded-full border-4 border-white mb-3 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 mx-auto rounded-full border-4 border-white mb-3 flex items-center justify-center text-5xl bg-white/20">
                      {teams[0].logo}
                    </div>
                  )
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-white mb-3 flex items-center justify-center text-5xl bg-white/20">
                    🏆
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {teams[0]?.name}
                </h3>
                <p className="text-4xl font-bold text-white">
                  {teams[0]?.score} pts
                </p>
              </div>
              <div className="bg-yellow-500 h-40 rounded-b-lg"></div>
            </div>

            {/* 3ème place */}
            <div className="flex-1 max-w-xs">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-lg p-6 text-center">
                <div className="text-6xl mb-2">🥉</div>
                {teams[2]?.logo ? (
                  typeof teams[2].logo === 'string' && teams[2].logo.startsWith('http') ? (
                    <img
                      src={teams[2].logo}
                      alt={teams[2].name}
                      className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-3 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-3 flex items-center justify-center text-4xl bg-white/20">
                      {teams[2].logo}
                    </div>
                  )
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-3 flex items-center justify-center text-4xl bg-white/20">
                    🏆
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">
                  {teams[2]?.name}
                </h3>
                <p className="text-3xl font-bold text-white">
                  {teams[2]?.score} pts
                </p>
              </div>
              <div className="bg-orange-500 h-28 rounded-b-lg"></div>
            </div>
          </div>
        )}

        {/* Liste complète */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Top 10 des Équipes</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {teams.map((team, index) => (
                <div
                  key={team._id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-400 w-12">
                      #{index + 1}
                    </span>
                    {team.logo ? (
                      typeof team.logo === 'string' && team.logo.startsWith('http') ? (
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gray-100">
                          {team.logo}
                        </div>
                      )
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gray-100">
                        🏆
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">
                        {team.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {team.members?.length || 0} membres
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600">
                      {team.score}
                    </p>
                    <p className="text-gray-500 text-sm">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition shadow-lg"
          >
            <LogIn className="w-6 h-6" />
            Se connecter pour participer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicLeaderboard;