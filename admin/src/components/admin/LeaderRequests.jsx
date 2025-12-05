import React from 'react';
import { CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { formatShortDate } from '../../utils/helpers';

const LeaderRequests = ({ leaderRequests, onApprove, onReject }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Demandes de Leader</h2>

      {leaderRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <UserPlus className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Aucune demande en attente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaderRequests.map(request => (
            <div 
              key={request._id} 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{request.name}</h3>
                  <p className="text-indigo-600 mb-3">{request.email}</p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-gray-700 italic">"{request.message}"</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    📅 Demande du {formatShortDate(request.date)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onApprove(request._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approuver
                  </button>
                  <button
                    onClick={() => onReject(request._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <XCircle className="w-5 h-5" />
                    Rejeter
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