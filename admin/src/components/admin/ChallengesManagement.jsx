import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Trophy } from 'lucide-react';
import Modal from './Modal';
import { formatShortDate } from '../../utils/helpers';

const ChallengesManagement = ({ challenges, onCreateChallenge, onUpdateChallenge, onDeleteChallenge }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'mini',
    points: '',
    deadline: ''
  });

  const openModal = (challenge = null) => {
    if (challenge) {
      setEditingChallenge(challenge);
      setFormData({
        title: challenge.title,
        description: challenge.description,
        type: challenge.type,
        points: challenge.points,
        deadline: challenge.deadline.split('T')[0]
      });
    } else {
      setEditingChallenge(null);
      setFormData({
        title: '',
        description: '',
        type: 'mini',
        points: '',
        deadline: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingChallenge(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.points || !formData.deadline) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const challengeData = {
      ...formData,
      points: parseInt(formData.points)
    };

    if (editingChallenge) {
      onUpdateChallenge(editingChallenge._id, challengeData);
    } else {
      onCreateChallenge(challengeData);
    }
    closeModal();
  };

  const handleDelete = (challengeId, challengeTitle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le défi "${challengeTitle}" ?`)) {
      onDeleteChallenge(challengeId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isUrgent = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 2;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gestion des Défis
          </h2>
          <p className="text-gray-600">Créez et gérez les défis du concours</p>
        </div>
        <button
          onClick={() => openModal()}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Nouveau Défi
        </button>
      </div>

      {challenges.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Aucun défi créé</p>
          <p className="text-gray-600 mb-6">Commencez par créer votre premier défi</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Créer un défi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map((challenge, idx) => (
            <div
              key={challenge._id || idx}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                isUrgent(challenge.deadline)
                  ? 'border-red-300 hover:border-red-400'
                  : 'border-gray-100 hover:border-indigo-300'
              }`}
              style={{
                animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both`
              }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                challenge.type === 'principal'
                  ? 'from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5'
                  : 'from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5'
              } transition-all duration-300`}></div>

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      challenge.type === 'principal'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    }`}>
                      {challenge.type === 'principal' ? '⭐ Principal' : '⚡ Mini'}
                    </span>
                    {isUrgent(challenge.deadline) && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">
                        ⚠️ Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(challenge)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(challenge._id, challenge.title)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                  {challenge.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {challenge.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Points</span>
                    <span className="text-xl font-bold text-indigo-600">{challenge.points}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Échéance</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDate(challenge.deadline)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                {challenge.isActive !== undefined && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      challenge.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {challenge.isActive ? '✓ Actif' : '✗ Inactif'}
                    </span>
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
        title={editingChallenge ? 'Modifier le défi' : 'Nouveau défi'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du défi *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ex: Défi Innovation 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="3"
              placeholder="Décrivez le défi..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="mini">Mini</option>
                <option value="principal">Principal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points *
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="100"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date limite *
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              {editingChallenge ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChallengesManagement;