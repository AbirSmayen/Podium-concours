import React from 'react';
import { Trophy, Users, Target, CheckCircle, UserPlus, Medal, Award } from 'lucide-react';
import StatCard from '../common/StatCard';

const Dashboard = ({ teams, challenges, pendingScores, leaderRequests, onNavigateToRequests }) => {
  // Trier les équipes par score
  const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));

  const getRankIcon = (rank) => {
    switch(rank) {
      case 0: return <Medal className="w-8 h-8 text-yellow-500" />;
      case 1: return <Medal className="w-8 h-8 text-gray-400" />;
      case 2: return <Medal className="w-8 h-8 text-amber-700" />;
      default: return <span className="text-2xl font-bold text-gray-400">#{rank + 1}</span>;
    }
  };

  const getRankGradient = (rank) => {
    switch(rank) {
      case 0: return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 1: return 'from-gray-300 via-gray-400 to-gray-500';
      case 2: return 'from-amber-600 via-amber-700 to-amber-800';
      default: return 'from-gray-100 to-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Vue d'ensemble
          </h2>
          <p className="text-gray-600">Tableau de bord du concours</p>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div 
          onClick={onNavigateToRequests}
          className="cursor-pointer"
        >
          <StatCard
            title="Demandes Leader"
            value={leaderRequests.length}
            icon={UserPlus}
            color="from-green-500 to-green-600"
          />
        </div>
      </div>

      {/* Classement */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Classement des Équipes</h3>
            <p className="text-sm text-gray-600">Mise à jour en temps réel</p>
          </div>
        </div>
        
        {sortedTeams.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Aucune équipe pour le moment</p>
            <p className="text-sm text-gray-500">Les équipes apparaîtront ici une fois créées</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTeams.map((team, idx) => (
              <div 
                key={team._id || idx}
                className={`group relative flex items-center gap-6 p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  idx < 3 
                    ? `bg-gradient-to-r ${getRankGradient(idx)} border-transparent text-white` 
                    : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                }`}
                style={{
                  animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`
                }}
              >
                {/* Badge de rang */}
                <div className="flex-shrink-0">
                  {getRankIcon(idx)}
                </div>

                {/* Logo de l'équipe */}
                <div className="text-4xl flex-shrink-0">
                  {team.logo || '🏆'}
                </div>

                {/* Informations de l'équipe */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xl font-bold mb-1 ${idx < 3 ? 'text-white' : 'text-gray-800'}`}>
                    {team.name}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={idx < 3 ? 'text-white/80' : 'text-gray-600'}>
                      {team.members?.length || team.leaderId ? (
                        <>
                          {team.members?.length || 1} membre{(team.members?.length || 1) > 1 ? 's' : ''}
                        </>
                      ) : (
                        'Aucun membre'
                      )}
                    </span>
                    {team.badges && team.badges.length > 0 && (
                      <div className="flex items-center gap-1">
                        {team.badges.map((badge, i) => (
                          <Award key={i} className={`w-4 h-4 ${idx < 3 ? 'text-white' : 'text-yellow-500'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-4xl font-bold mb-1 ${idx < 3 ? 'text-white' : 'text-indigo-600'}`}>
                    {team.score || 0}
                  </p>
                  <p className={`text-xs font-medium ${idx < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                    points
                  </p>
                </div>

                {/* Effet hover */}
                {idx >= 3 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;