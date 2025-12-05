import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Trash2, Mail } from 'lucide-react';

const TeamMembers = ({ teamId }) => {
  const [members, setMembers] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/teams/${teamId}`);
      setMembers(response.data.members || []);
    } catch (error) {
      console.error('Erreur chargement membres:', error);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/users/register', {
        ...inviteData,
        teamId: teamId,
        role: 'member',
      });

      setSuccess('Membre invité avec succès !');
      setInviteData({ name: '', email: '' });
      setShowInviteForm(false);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) return;

    try {
      await api.delete(`/teams/${teamId}/members/${memberId}`);
      setSuccess('Membre retiré avec succès');
      fetchMembers();
    } catch (error) {
      setError('Erreur lors du retrait du membre');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">
          Membres de l'équipe ({members.length})
        </h3>

        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un membre
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Invitation Form */}
      {showInviteForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="font-semibold mb-4">Inviter un nouveau membre</h4>

          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={inviteData.name}
                onChange={(e) =>
                  setInviteData({ ...inviteData, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Nom du membre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={inviteData.email}
                onChange={(e) =>
                  setInviteData({ ...inviteData, email: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="email@exemple.com"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
              </button>

              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {members.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucun membre dans l'équipe
          </p>
        ) : (
          members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-lg">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRemoveMember(member._id)}
                className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                title="Retirer le membre"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamMembers;