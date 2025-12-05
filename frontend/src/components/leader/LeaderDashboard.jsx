import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import socketService from '../../services/socket';
import { Users, Trophy, Target, Award } from 'lucide-react';
import TeamMembers from './TeamMembers';
import ScoreSubmission from './ScoreSubmission';

const LeaderDashboard = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalScore: 0,
    completedChallenges: 0,
    rank: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTeamData();
    
    // Connexion Socket.io
    const socket = socketService.connect();
    if (user.teamId) {
      socketService.joinTeamRoom(user.teamId);
    }

    socketService.onScoreUpdate((data) => {
      if (data.teamId === user.teamId) {
        fetchTeamData();
      }
    });

    return () => {
      if (user.teamId) {
        socketService.leaveTeamRoom(user.teamId);
      }
    };
  }, [user.teamId]);

  const fetchTeamData = async () => {
    try {
      const [teamRes, scoresRes] = await Promise.all([
        api.get(`/teams/${user.teamId}`),
        api.get(`/scores?teamId=${user.teamId}`),
      ]);

      setTeam(teamRes.data);
      
      const totalScore = scoresRes.data.reduce((sum, score) => sum + score.pointsEarned, 0);
      
      setStats({
        totalMembers: teamRes.data.members.length,
        totalScore: totalScore,
        completedChallenges: scoresRes.data.length,
        rank: teamRes.data.rank || 0,
      });
    } catch (error) {
      console.error('Erreur chargement données équipe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord Leader</h1>
              <p className="text-indigo-100 mt-2">
                Bienvenue, {user.name} - {team?.name}
              </p>
            </div>
            {team?.logo && (
              <img
                src={team.logo}
                alt={team.name}
                className="w-16 h-16 rounded-full border-4 border-white"
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Membres</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Score Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalScore}</p>
              </div>
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Défis complétés</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedChallenges}</p>
              </div>
              <Target className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Classement</p>
                <p className="text-3xl font-bold text-gray-900">#{stats.rank}</p>
              </div>
              <Award className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'members'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Membres
              </button>
              <button
                onClick={() => setActiveTab('scores')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'scores'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Soumettre Score
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Badges de l'équipe</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {team?.badges && team.badges.length > 0 ? (
                    team.badges.map((badge, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-lg text-center"
                      >
                        <Award className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                        <p className="font-medium text-gray-900">{badge}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-4">Aucun badge pour le moment</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'members' && <TeamMembers teamId={user.teamId} />}
            {activeTab === 'scores' && <ScoreSubmission teamId={user.teamId} onSuccess={fetchTeamData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;