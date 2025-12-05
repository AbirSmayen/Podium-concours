import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Award, Star } from 'lucide-react';

const TeamBadges = ({ teamId }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamBadges();
  }, [teamId]);

  const fetchTeamBadges = async () => {
    try {
      const response = await api.get(`/teams/${teamId}`);
      setTeam(response.data);
    } catch (error) {
      console.error('Erreur chargement badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des badges...</div>;
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Badges de l'équipe {team?.name}</h3>

      {team?.badges && team.badges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.badges.map((badge, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition text-center"
            >
              <div className="w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-12 h-12 text-yellow-700" />
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">{badge}</h4>
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-600 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Votre équipe n'a pas encore de badges
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Complétez des défis pour débloquer des badges !
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamBadges;