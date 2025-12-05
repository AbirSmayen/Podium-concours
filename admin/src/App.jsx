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
import { teamsService } from './services/teamsService';
import { challengesService } from './services/challengesService';
import { scoresService } from './services/scoresService';
import { usersService } from './services/usersService';
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
    
    // Rafraîchir les données toutes les 30 secondes pour synchroniser les demandes
    const interval = setInterval(() => {
      loadData();
    }, 30000); // 30 secondes
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des données...');
      
      // Vérifier que le token existe
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Aucun token trouvé, impossible de charger les données');
        return;
      }
      
      console.log('📡 Appel des API...');
      const [teamsResponse, challengesResponse, scoresResponse, requestsResponse] = await Promise.all([
        teamsService.getAllTeams().catch(err => {
          console.error('❌ Erreur getAllTeams:', err);
          return { success: false, data: { teams: [] } };
        }),
        challengesService.getAllChallenges({ isActive: true }).catch(err => {
          console.error('❌ Erreur getAllChallenges:', err);
          return { success: false, data: { challenges: [] } };
        }),
        scoresService.getPendingScores().catch(err => {
          console.error('❌ Erreur getPendingScores:', err);
          return { success: false, data: { scores: [] } };
        }),
        usersService.getLeaderRequests().catch(err => {
          console.error('❌ Erreur getLeaderRequests:', err);
          return { success: false, data: { requests: [] } };
        })
      ]);
      
      console.log('✅ Réponses reçues:', {
        teams: teamsResponse.success,
        challenges: challengesResponse.success,
        scores: scoresResponse.success,
        requests: requestsResponse.success
      });
      
      // Les services retournent déjà response.data, donc on accède directement
      setTeams(teamsResponse.success ? (teamsResponse.data?.teams || []) : []);
      setChallenges(challengesResponse.success ? (challengesResponse.data?.challenges || []) : []);
      setPendingScores(scoresResponse.success ? (scoresResponse.data?.scores || []) : []);
      
      // Log pour déboguer les demandes de leader
      console.log('📋 Réponse brute des demandes de leader:', requestsResponse);
      
      // Gérer différentes structures de réponse
      let requests = [];
      if (requestsResponse && requestsResponse.success) {
        requests = requestsResponse.data?.requests || requestsResponse.data || [];
      } else if (Array.isArray(requestsResponse)) {
        requests = requestsResponse;
      } else if (requestsResponse && requestsResponse.requests) {
        requests = requestsResponse.requests;
      }
      
      console.log(`📋 ${requests.length} demande(s) de leader récupérée(s)`, requests);
      setLeaderRequests(Array.isArray(requests) ? requests : []);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      console.error('Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      // En cas d'erreur, utiliser des données vides plutôt que de planter
      setTeams([]);
      setChallenges([]);
      setPendingScores([]);
      setLeaderRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des équipes
  const handleCreateTeam = async (teamData) => {
    try {
      const response = await teamsService.createTeam(teamData);
      if (response.success) {
        setTeams([...teams, response.data.team]);
        alert(MESSAGES.SUCCESS.TEAM_CREATED || 'Équipe créée avec succès');
        loadData(); // Recharger les données pour avoir les dernières infos
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la création de l\'équipe');
    }
  };

  const handleUpdateTeam = async (id, teamData) => {
    try {
      const response = await teamsService.updateTeam(id, teamData);
      if (response.success) {
        setTeams(teams.map(t => t._id === id ? response.data.team : t));
        alert(MESSAGES.SUCCESS.TEAM_UPDATED || 'Équipe mise à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'équipe');
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      const response = await teamsService.deleteTeam(id);
      if (response.success) {
        setTeams(teams.filter(t => t._id !== id));
        alert(MESSAGES.SUCCESS.TEAM_DELETED || 'Équipe supprimée avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression de l\'équipe');
    }
  };

  // Gestion des défis
  const handleCreateChallenge = async (challengeData) => {
    try {
      const response = await challengesService.createChallenge(challengeData);
      if (response.success) {
        setChallenges([...challenges, response.data.challenge]);
        alert(MESSAGES.SUCCESS.CHALLENGE_CREATED || 'Défi créé avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la création du défi');
    }
  };

  const handleUpdateChallenge = async (id, challengeData) => {
    try {
      const response = await challengesService.updateChallenge(id, challengeData);
      if (response.success) {
        setChallenges(challenges.map(c => c._id === id ? response.data.challenge : c));
        alert(MESSAGES.SUCCESS.CHALLENGE_UPDATED || 'Défi mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour du défi');
    }
  };

  const handleDeleteChallenge = async (id) => {
    try {
      const response = await challengesService.deleteChallenge(id);
      if (response.success) {
        setChallenges(challenges.filter(c => c._id !== id));
        alert(MESSAGES.SUCCESS.CHALLENGE_DELETED || 'Défi supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression du défi');
    }
  };

  // Gestion des scores
  const handleValidateScore = async (scoreId, validationNote = '') => {
    try {
      const response = await scoresService.validateScore(scoreId, validationNote);
      if (response.success) {
        setPendingScores(pendingScores.filter(s => s._id !== scoreId));
        // Recharger les équipes pour avoir les scores mis à jour
        const teamsResponse = await teamsService.getAllTeams();
        setTeams(teamsResponse.data?.teams || teams);
        alert(MESSAGES.SUCCESS.SCORE_VALIDATED || 'Score validé avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la validation du score');
    }
  };

  const handleRejectScore = async (scoreId, validationNote) => {
    try {
      const response = await scoresService.rejectScore(scoreId, validationNote);
      if (response.success) {
        setPendingScores(pendingScores.filter(s => s._id !== scoreId));
        alert(MESSAGES.SUCCESS.SCORE_REJECTED || 'Score rejeté');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors du rejet du score');
    }
  };

  // Gestion des demandes de leader
  const handleApproveLeader = async (requestId) => {
    try {
      const response = await usersService.updateLeaderStatus(requestId, 'active');
      if (response.success) {
        setLeaderRequests(leaderRequests.filter(r => r._id !== requestId));
        // Recharger les données pour mettre à jour la liste
        loadData();
        return Promise.resolve();
      } else {
        throw new Error(response.message || 'Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const handleRejectLeader = async (requestId) => {
    try {
      const response = await usersService.updateLeaderStatus(requestId, 'blocked');
      if (response.success) {
        setLeaderRequests(leaderRequests.filter(r => r._id !== requestId));
        // Recharger les données pour mettre à jour la liste
        loadData();
        return Promise.resolve();
      } else {
        throw new Error(response.message || 'Erreur lors du rejet');
      }
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            teams={teams}
            challenges={challenges}
            pendingScores={pendingScores}
            leaderRequests={leaderRequests}
            onNavigateToRequests={() => setActiveTab('requests')}
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
            onRefresh={loadData}
          />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
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