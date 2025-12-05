import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import Dashboard from './components/admin/Dashboard';
import TeamsManagement from './components/admin/TeamsManagement';
import ChallengesManagement from './components/admin/ChallengesManagement';
import ScoresValidation from './components/admin/ScoresValidation';
import LeaderRequests from './components/admin/LeaderRequests';
import Loading from './components/common/Loading';

// Services
import { getAllTeams, createTeam, updateTeam, deleteTeam } from './services/teamsService';
import { getAllChallenges, createChallenge, updateChallenge, deleteChallenge } from './services/challengesService';
import { getPendingScores, validateScore, rejectScore } from './services/scoresService';
import { MESSAGES } from './utils/constants';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teams, setTeams] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [pendingScores, setPendingScores] = useState([]);
  const [leaderRequests, setLeaderRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Pour le moment, utiliser des données de test
      // Remplacez ceci par vos vrais appels API quand le backend sera prêt
      setTeams([
        { _id: '1', name: 'Les Champions', logo: '🏆', score: 850, members: ['Alice', 'Bob'], badges: ['Premier'] },
        { _id: '2', name: 'Les Innovateurs', logo: '💡', score: 720, members: ['David', 'Emma'], badges: [] }
      ]);
      
      setChallenges([
        { _id: '1', title: 'Défi Principal 2025', type: 'principal', points: 500, deadline: '2025-03-15', description: 'Challenge majeur' }
      ]);
      
      setPendingScores([
        { _id: '1', teamName: 'Les Champions', challengeTitle: 'Défi Principal', points: 500, submittedBy: 'Alice', date: '2024-12-01' }
      ]);
      
      setLeaderRequests([
        { _id: '1', name: 'Jean Dupont', email: 'jean@example.com', message: 'Je veux devenir leader', date: '2024-11-28' }
      ]);
      
      // Décommentez quand votre backend sera prêt :
      /*
      const [teamsData, challengesData, scoresData] = await Promise.all([
        getAllTeams(),
        getAllChallenges(),
        getPendingScores()
      ]);
      setTeams(teamsData);
      setChallenges(challengesData);
      setPendingScores(scoresData);
      */
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Gestion des équipes
  const handleCreateTeam = async (teamData) => {
    try {
      // Version temporaire pour tester l'interface
      const newTeam = {
        _id: Date.now().toString(),
        ...teamData,
        score: 0,
        members: [],
        badges: []
      };
      setTeams([...teams, newTeam]);
      alert(MESSAGES.SUCCESS.TEAM_CREATED);
      
      // Décommentez quand le backend sera prêt :
      // const newTeam = await createTeam(teamData);
      // setTeams([...teams, newTeam]);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de l\'équipe');
    }
  };

  const handleUpdateTeam = async (id, teamData) => {
    try {
      setTeams(teams.map(t => t._id === id ? { ...t, ...teamData } : t));
      alert(MESSAGES.SUCCESS.TEAM_UPDATED);
      
      // Décommentez quand le backend sera prêt :
      // const updatedTeam = await updateTeam(id, teamData);
      // setTeams(teams.map(t => t._id === id ? updatedTeam : t));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour de l\'équipe');
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      setTeams(teams.filter(t => t._id !== id));
      alert(MESSAGES.SUCCESS.TEAM_DELETED);
      
      // Décommentez quand le backend sera prêt :
      // await deleteTeam(id);
      // setTeams(teams.filter(t => t._id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'équipe');
    }
  };

  // Gestion des défis
  const handleCreateChallenge = async (challengeData) => {
    try {
      const newChallenge = {
        _id: Date.now().toString(),
        ...challengeData
      };
      setChallenges([...challenges, newChallenge]);
      alert(MESSAGES.SUCCESS.CHALLENGE_CREATED);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du défi');
    }
  };

  const handleUpdateChallenge = async (id, challengeData) => {
    try {
      setChallenges(challenges.map(c => c._id === id ? { ...c, ...challengeData } : c));
      alert(MESSAGES.SUCCESS.CHALLENGE_UPDATED);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du défi');
    }
  };

  const handleDeleteChallenge = async (id) => {
    try {
      setChallenges(challenges.filter(c => c._id !== id));
      alert(MESSAGES.SUCCESS.CHALLENGE_DELETED);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du défi');
    }
  };

  // Gestion des scores
  const handleValidateScore = async (scoreId) => {
    try {
      const score = pendingScores.find(s => s._id === scoreId);
      setPendingScores(pendingScores.filter(s => s._id !== scoreId));
      
      if (score) {
        setTeams(teams.map(t => 
          t.name === score.teamName 
            ? { ...t, score: (t.score || 0) + score.points }
            : t
        ));
      }
      alert(MESSAGES.SUCCESS.SCORE_VALIDATED);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la validation du score');
    }
  };

  const handleRejectScore = async (scoreId) => {
    try {
      setPendingScores(pendingScores.filter(s => s._id !== scoreId));
      alert(MESSAGES.SUCCESS.SCORE_REJECTED);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du rejet du score');
    }
  };

  // Gestion des demandes de leader
  const handleApproveLeader = (requestId) => {
    setLeaderRequests(leaderRequests.filter(r => r._id !== requestId));
    alert(MESSAGES.SUCCESS.LEADER_APPROVED);
  };

  const handleRejectLeader = (requestId) => {
    setLeaderRequests(leaderRequests.filter(r => r._id !== requestId));
    alert(MESSAGES.SUCCESS.LEADER_REJECTED);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Header />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            teams={teams}
            challenges={challenges}
            pendingScores={pendingScores}
            leaderRequests={leaderRequests}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsManagement
            teams={teams}
            onCreateTeam={handleCreateTeam}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        )}

        {activeTab === 'challenges' && (
          <ChallengesManagement
            challenges={challenges}
            onCreateChallenge={handleCreateChallenge}
            onUpdateChallenge={handleUpdateChallenge}
            onDeleteChallenge={handleDeleteChallenge}
          />
        )}

        {activeTab === 'scores' && (
          <ScoresValidation
            pendingScores={pendingScores}
            onValidate={handleValidateScore}
            onReject={handleRejectScore}
          />
        )}

        {activeTab === 'requests' && (
          <LeaderRequests
            leaderRequests={leaderRequests}
            onApprove={handleApproveLeader}
            onReject={handleRejectLeader}
          />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;