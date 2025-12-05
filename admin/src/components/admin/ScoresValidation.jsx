import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { formatShortDate } from '../../utils/helpers';

const ScoresValidation = ({ pendingScores, onValidate, onReject }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Scores à Valider</h2>

      {pendingScores.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Aucun score en attente de validation</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingScores.map(score => (
            <div 
              key={score._id} 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{score.teamName}</h3>
                  <p className="text-gray-600 mb-2">{score.challengeTitle}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      Soumis par: <strong>{score.submittedBy}</strong>
                    </span>
                    <span>📅 {formatShortDate(score.date)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600 mb-4">{score.points} pts</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onValidate(score._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Valider
                    </button>
                    <button
                      onClick={() => onReject(score._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <XCircle className="w-5 h-5" />
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoresValidation;