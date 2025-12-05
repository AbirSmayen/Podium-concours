import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, Trophy, Award } from 'lucide-react';
import Modal from './Modal';
import { usersService } from '../../services/usersService';

const TeamsManagement = ({ teams, onCreateTeam, onUpdateTeam, onDeleteTeam }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [loadingLeaders, setLoadingLeaders] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    leaderId: ''
  });

  useEffect(() => {
    if (showModal && !editingTeam) {
      fetchActiveLeaders();
    }
  }, [showModal, editingTeam]);

  const fetchActiveLeaders = async () => {
    try {
      setLoadingLeaders(true);
      const response = await usersService.getAllUsers({ role: 'leader', status: 'active' });
      if (response.success && response.data) {
        // Filtrer les leaders qui n'ont pas encore d'équipe
        const leadersWithoutTeam = (response.data.users || []).filter(
          leader => !leader.teamId
        );
        setLeaders(leadersWithoutTeam);
      }
    } catch (error) {
      console.error('Erreur chargement leaders:', error);
      setLeaders([]);
    } finally {
      setLoadingLeaders(false);
    }
  };

  const openModal = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name || '',
        logo: team.logo || '',
        leaderId: team.leaderId?._id || team.leaderId || ''
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        logo: '',
        leaderId: ''
      });
      fetchActiveLeaders();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTeam(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Le nom de l\'équipe est obligatoire');
      return;
    }

    if (!editingTeam && !formData.leaderId) {
      alert('Veuillez sélectionner un leader pour cette équipe');
      return;
    }

    if (editingTeam) {
      onUpdateTeam(editingTeam._id, formData);
    } else {
      onCreateTeam(formData);
    }
    closeModal();
  };

  const handleDelete = (teamId, teamName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${teamName}" ?`)) {
      onDeleteTeam(teamId);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gestion des Équipes
          </h2>
          <p className="text-gray-600">Gérez les équipes et leurs membres</p>
        </div>
        <button
          onClick={() => openModal()}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Nouvelle Équipe
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-indigo-600" />
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Aucune équipe créée</p>
          <p className="text-gray-600 mb-6">Commencez par créer votre première équipe</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Créer une équipe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, idx) => (
            <div
              key={team._id || idx}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-300"
              style={{
                animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both`
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
              
              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{team.logo || '🏆'}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {team.name}
                      </h3>
                      {team.rank && (
                        <p className="text-sm text-gray-500">Rang #{team.rank}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(team)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(team._id, team.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Score</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">{team.score || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Membres</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-800">
                      {team.members?.length || (team.leaderId ? 1 : 0)}
                    </span>
                  </div>
                </div>

                {/* Badges */}
                {team.badges && team.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
                      >
                        <Award className="w-3 h-3" />
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Leader Info */}
                {team.leaderId && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Leader</p>
                    <p className="text-sm font-medium text-gray-800">
                      {team.leaderId?.name || 'Non défini'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingTeam ? 'Modifier l\'équipe' : 'Nouvelle équipe'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'équipe *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Ex: Les Champions"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo (emoji)
            </label>
            <input
              type="text"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="🏆"
              maxLength={2}
            />
          </div>
          {!editingTeam && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leader * <span className="text-xs text-gray-500">(Seuls les leaders actifs sans équipe sont affichés)</span>
              </label>
              {loadingLeaders ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                  <p className="text-gray-500 text-sm">Chargement des leaders...</p>
                </div>
              ) : leaders.length === 0 ? (
                <div className="w-full px-4 py-3 border border-yellow-300 rounded-xl bg-yellow-50">
                  <p className="text-yellow-700 text-sm">Aucun leader disponible. Veuillez d'abord approuver des leaders.</p>
                </div>
              ) : (
                <select
                  value={formData.leaderId}
                  onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">-- Sélectionner un leader --</option>
                  {leaders.map((leader) => (
                    <option key={leader._id} value={leader._id}>
                      {leader.name} ({leader.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {editingTeam ? 'Modifier' : 'Créer'}
            </button>
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamsManagement;

