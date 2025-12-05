import React, { useState, useEffect } from 'react';
import { requestsService } from '../../services/requestsService';
import { CheckCircle, XCircle, UserPlus, Mail, MessageSquare, Clock } from 'lucide-react';

const TeamRequests = ({ teamId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [teamId]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsService.getTeamRequests();
      if (response.success && response.data) {
        setRequests(response.data.requests || []);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir accepter cette demande ?')) return;

    try {
      setError('');
      setSuccess('');
      const response = await requestsService.acceptRequest(requestId);
      if (response.success) {
        setSuccess('Demande acceptée avec succès !');
        fetchRequests();
      } else {
        setError(response.message || 'Erreur lors de l\'acceptation');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'acceptation');
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir refuser cette demande ?')) return;

    try {
      setError('');
      setSuccess('');
      const response = await requestsService.rejectRequest(requestId);
      if (response.success) {
        setSuccess('Demande refusée');
        fetchRequests();
      } else {
        setError(response.message || 'Erreur lors du refus');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors du refus');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Chargement des demandes...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Demandes d'adhésion
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {requests.length} demande{requests.length > 1 ? 's' : ''} en attente
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
        >
          Actualiser
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slideIn">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 animate-slideIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-10 h-10 text-indigo-600" />
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Aucune demande en attente</p>
          <p className="text-gray-600">
            Les demandes d'adhésion apparaîtront ici lorsqu'un utilisateur souhaitera rejoindre votre équipe.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {request.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{request.name}</h4>
                      <div className="flex items-center gap-2 text-indigo-600 mb-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{request.email}</span>
                      </div>
                      {request.message && (
                        <div className="bg-gray-50 rounded-lg p-4 mt-3 border-l-4 border-indigo-500">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700 italic text-sm">{request.message}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>
                          Demande du {request.createdAt ? new Date(request.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date inconnue'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleAccept(request._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium transform hover:scale-[1.02]"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accepter
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium transform hover:scale-[1.02]"
                  >
                    <XCircle className="w-5 h-5" />
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamRequests;

