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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestion des Défis</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nouveau Défi
        </button>
      </div>

      {challenges.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-xl text-gray-600">Aucun défi créé</p>
          <button
            onClick={() => openModal()}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Créer votre premier défi
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map(challenge => (
            <div key={challenge._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      challenge.type === 'principal'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {challenge.type === 'principal' ? '⭐ Principal' : '⚡ Mini'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800">{challenge.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <strong>{challenge.points}</strong> points
                    </span>
                    <span>📅 Échéance: {formatShortDate(challenge.deadline)}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openModal(challenge)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge._id, challenge.title)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
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