import React, { useState } from 'react';
import { CheckCircle, XCircle, UserPlus, Mail, MessageSquare, Clock, RefreshCw } from 'lucide-react';

const LeaderRequests = ({ leaderRequests, onApprove, onReject, onRefresh }) => {
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleApprove = async (requestId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir approuver cette demande de leader ?')) return;
    
    setProcessing(requestId);
    setError('');
    setSuccess('');
    
    try {
      await onApprove(requestId);
      setSuccess('Demande approuvée avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'approbation');
      setTimeout(() => setError(''), 5000);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter cette demande de leader ?')) return;
    
    setProcessing(requestId);
    setError('');
    setSuccess('');
    
    try {
      await onReject(requestId);
      setSuccess('Demande rejetée');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors du rejet');
      setTimeout(() => setError(''), 5000);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Demandes de Leader
          </h2>
          <p className="text-gray-600">
            Gérez les demandes des utilisateurs souhaitant devenir leaders d'équipe
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-semibold">
            {leaderRequests.length} demande{leaderRequests.length > 1 ? 's' : ''} en attente
          </div>
          {onRefresh && (
            <button
              onClick={async () => {
                setRefreshing(true);
                try {
                  await onRefresh();
                } finally {
                  setRefreshing(false);
                }
              }}
              disabled={refreshing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg animate-slideIn">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg animate-slideIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}

      {/* Requests List */}
      {leaderRequests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-10 h-10 text-indigo-600" />
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Aucune demande en attente</p>
          <p className="text-gray-600">
            Les demandes de leader apparaîtront ici lorsqu'un utilisateur souhaitera devenir leader d'équipe.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaderRequests.map((request, idx) => (
            <div
              key={request._id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-300"
              style={{
                animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both`
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {request.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {request.name}
                      </h3>
                      <div className="flex items-center gap-2 text-indigo-600 mb-3">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">{request.email}</span>
                      </div>
                      {request.leaderRequestMessage && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border-l-4 border-indigo-500">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700 italic text-sm leading-relaxed">
                              "{request.leaderRequestMessage}"
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
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
                    onClick={() => handleApprove(request._id)}
                    disabled={processing === request._id}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {processing === request._id ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Approuver
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    disabled={processing === request._id}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {processing === request._id ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        Rejeter
                      </>
                    )}
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

export default LeaderRequests;