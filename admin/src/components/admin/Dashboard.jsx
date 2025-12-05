import React from 'react';
import { Trophy, Users, Target, CheckCircle, UserPlus } from 'lucide-react';
import StatCard from '../common/StatCard';

const Dashboard = ({ teams, challenges, pendingScores, leaderRequests }) => {
  // Trier les équipes par score
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const getRankColor = (rank) => {
    switch(rank) {
      case 0: return 'text-yellow-500';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-700';
      default: return 'text-gray-400';
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Vue d'ensemble</h2>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Équipes"
          value={teams.length}
          icon={Users}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Défis Actifs"
          value={challenges.length}
          icon={Target}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Scores en Attente"
          value={pendingScores.length}
          icon={CheckCircle}
          color="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Demandes Leader"
          value={leaderRequests.length}
          icon={UserPlus}
          color="from-green-500 to-green-600"
        />
      </div>

      {/* Classement */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Classement des Équipes
        </h3>
        
        {sortedTeams.length === 0 ? (
          <p className="text-center text-gray-600 py-8">Aucune équipe pour le moment</p>
        ) : (
          <div className="space-y-3">
            {sortedTeams.map((team, idx) => (
              <div 
                key={team._id} 
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className={`text-3xl font-bold ${getRankColor(idx)}`}>
                  #{idx + 1}
                </div>
                <div className="text-3xl">{team.logo}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{team.name}</p>
                  <p className="text-sm text-gray-600">
                    {team.members?.length || 0} membre{team.members?.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{team.score || 0}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;