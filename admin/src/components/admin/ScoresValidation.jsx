import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Trophy, Target, User } from 'lucide-react';
import Modal from './Modal';

const ScoresValidation = ({ pendingScores, onValidate, onReject }) => {
  const [selectedScore, setSelectedScore] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  const handleValidate = (scoreId) => {
    if (window.confirm('Valider ce score ?')) {
      onValidate(scoreId);
    }
  };

  const handleRejectClick = (score) => {
    setSelectedScore(score);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectNote.trim()) {
      alert('Veuillez fournir une raison pour le rejet');
      return;
    }
    onReject(selectedScore._id, rejectNote);
    setShowRejectModal(false);
    setRejectNote('');
    setSelectedScore(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Validation des Scores
        </h2>
        <p className="text-gray-600">Examinez et validez les soumissions des équipes</p>
      </div>

      {pendingScores.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Aucun score en attente</p>
          <p className="text-gray-600">Tous les scores ont été traités</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingScores.map((score, idx) => (
            <div
              key={score._id || idx}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-300 overflow-hidden"
              style={{
                animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both`
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Trophy className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {score.teamId?.name || score.teamName || 'Équipe inconnue'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Target className="w-4 h-4" />
                        <span className="font-medium">
                          {score.challengeId?.title || score.challengeTitle || 'Défi inconnu'}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500">Soumis par</p>
                          <p className="font-medium text-gray-800">
                            {score.submittedBy?.name || score.submittedBy || 'Inconnu'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500">Date de soumission</p>
                          <p className="font-medium text-gray-800">
                            {formatDate(score.submittedAt || score.date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submission Note */}
                    {score.submissionNote && (
                      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <p className="text-xs font-medium text-indigo-700 mb-1">Note de soumission</p>
                        <p className="text-sm text-gray-700 italic">"{score.submissionNote}"</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                        {score.pointsEarned || score.points || 0}
                      </p>
                      <p className="text-xs font-medium text-gray-500">points</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleValidate(score._id)}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Valider
                      </button>
                      <button
                        onClick={() => handleRejectClick(score)}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectNote('');
          setSelectedScore(null);
        }}
        title="Rejeter le score"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Veuillez fournir une raison pour le rejet de ce score.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison du rejet *
            </label>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all min-h-[100px]"
              placeholder="Ex: Le travail soumis ne répond pas aux critères du défi..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleRejectConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              Confirmer le rejet
            </button>
            <button
              onClick={() => {
                setShowRejectModal(false);
                setRejectNote('');
                setSelectedScore(null);
              }}
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

export default ScoresValidation;
