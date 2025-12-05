import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import socketService from '../../services/socket';
import Leaderboard from './Leaderboard';
import ChallengesList from './ChallengesList';
import TeamBadges from './TeamBadges';
import { Trophy, Target, Award, Users } from 'lucide-react';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState({
    teamScore: 0,
    teamRank: 0,
    completedChallenges: 0,
    totalMembers: 0,
  });
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    // Connexion Socket.io
    const socket = socketService.connect();
    if (user.teamId) {
      socketService.joinTeamRoom(user.teamId);
    }

    socketService.onLeaderboardUpdate(() => {
      fetchData();
    });

    return () => {
      if (user.teamId) {
        socketService.leaveTeamRoom(user.teamId);
      }
    };
  }, [user.teamId]);

  const fetchData = async () => {
    try {
      const [teamRes, scoresRes, teamsRes] = await Promise.all([
        api.get(`/teams/${user.teamId}`),
        api.get(`/scores?teamId=${user.teamId}`),
        api.get('/teams'),
      ]);

      setTeam(teamRes.data);
      
      const totalScore = scoresRes.data
        .filter((s) => s.validated)
        .reduce((sum, score) => sum + score.pointsEarned, 0);

      const sortedTeams = teamsRes.data.sort((a, b) => b.score - a.score);
      const teamRank = sortedTeams.findIndex((t) => t._id === user.teamId) + 1;

      setStats({
        teamScore: totalScore,
        teamRank: teamRank,
        completedChallenges: scoresRes.data.filter((s) => s.validated).length,
        totalMembers: teamRes.data.members?.length || 0,
      });
    } catch (error) {
      console.error('Erreur chargement données:', error);
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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Espace Membre</h1>
              <p className="text-blue-100 mt-2">
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
                <p className="text-gray-600 text-sm">Score Équipe</p>
                <p className="text-3xl font-bold text-gray-900">{stats.teamScore}</p>
              </div>
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Classement</p>
                <p className="text-3xl font-bold text-gray-900">#{stats.teamRank}</p>
              </div>
              <Award className="w-12 h-12 text-purple-500" />
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
                <p className="text-gray-600 text-sm">Membres</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'leaderboard'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Classement
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'challenges'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Défis
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'badges'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Badges
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'leaderboard' && <Leaderboard />}
            {activeTab === 'challenges' && <ChallengesList />}
            {activeTab === 'badges' && <TeamBadges teamId={user.teamId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;