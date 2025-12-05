import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Target, Calendar, Award, FileText } from 'lucide-react';

const ChallengesList = () => {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState('all'); // all, principal, mini
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await api.get('/challenges');
      setChallenges(response.data);
    } catch (error) {
      console.error('Erreur chargement défis:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    if (filter === 'all') return true;
    return challenge.type === filter;
  });

  if (loading) {
    return <div className="text-center py-8">Chargement des défis...</div>;
  }

  return (
    <div>
      {/* Header / Filtres */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Défis Disponibles</h3>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tous
          </button>

          <button
            onClick={() => setFilter('principal')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'principal'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Principaux
          </button>

          <button
            onClick={() => setFilter('mini')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'mini'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mini-défis
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.length === 0 ? (
          <p className="text-gray-500 col-span-2 text-center py-8">
            Aucun défi disponible
          </p>
        ) : (
          filteredChallenges.map((challenge) => (
            <div
              key={challenge._id}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              {/* Header du défi */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-indigo-600" />

                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      {challenge.title}
                    </h4>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        challenge.type === 'principal'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {challenge.type === 'principal'
                        ? 'Défi Principal'
                        : 'Mini-défi'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="font-bold text-yellow-800">
                    {challenge.points} pts
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">{challenge.description}</p>

              {/* Détails */}
              <div className="space-y-2 text-sm">
                {challenge.deadline && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Date limite:{' '}
                      {new Date(challenge.deadline).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}

                {/* Ressources */}
                {challenge.resources &&
                  challenge.resources.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <FileText className="w-4 h-4" />
                        <span>Ressources:</span>
                      </div>

                      <ul className="space-y-1 ml-6">
                        {challenge.resources.map((resource, index) => (
                          <li key={index}>
                            <a
                              href={resource}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {resource}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChallengesList;
