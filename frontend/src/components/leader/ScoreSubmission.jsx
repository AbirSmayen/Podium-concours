import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Send, CheckCircle } from 'lucide-react';

const ScoreSubmission = ({ teamId, onSuccess }) => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [pointsEarned, setPointsEarned] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await api.get('/challenges');
      setChallenges(response.data);
    } catch (error) {
      console.error('Erreur chargement défis:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/scores', {
        teamId,
        challengeId: selectedChallenge,
        pointsEarned: parseInt(pointsEarned),
        comment,
      });

      setSuccess('Score soumis avec succès ! En attente de validation.');
      setSelectedChallenge('');
      setPointsEarned('');
      setComment('');
      
      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const selectedChallengeData = challenges.find((c) => c._id === selectedChallenge);

  return (
    <div className="max-w-2xl">
      <h3 className="text-xl font-bold mb-6">Soumettre un score</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un défi *
          </label>
          <select
            value={selectedChallenge}
            onChange={(e) => setSelectedChallenge(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Choisir un défi --</option>
            {challenges.map((challenge) => (
              <option key={challenge._id} value={challenge._id}>
                {challenge.title} ({challenge.type}) - {challenge.points} points max
              </option>
            ))}
          </select>
        </div>

        {selectedChallengeData && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              {selectedChallengeData.title}
            </h4>
            <p className="text-sm text-blue-800 mb-2">
              {selectedChallengeData.description}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Points maximum:</span> {selectedChallengeData.points}
            </p>
            {selectedChallengeData.deadline && (
              <p className="text-sm text-blue-700">
                <span className="font-medium">Date limite:</span>{' '}
                {new Date(selectedChallengeData.deadline).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points obtenus *
          </label>
          <input
            type="number"
            value={pointsEarned}
            onChange={(e) => setPointsEarned(e.target.value)}
            required
            min="0"
            max={selectedChallengeData?.points || 100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: 50"
          />
          {selectedChallengeData && (
            <p className="text-sm text-gray-500 mt-1">
              Maximum: {selectedChallengeData.points} points
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Décrivez comment vous avez complété ce défi..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedChallenge}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          {loading ? 'Soumission...' : 'Soumettre le score'}
        </button>
      </form>
    </div>
  );
};

export default ScoreSubmission;