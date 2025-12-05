// src/services/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connecté');
        // Rejoindre la salle du classement
        this.socket.emit('join', 'leaderboard');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket déconnecté');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Erreur de connexion Socket:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onScoreUpdate(callback) {
    if (this.socket) {
      this.socket.on('score-updated', callback);
    }
  }

  onLeaderboardUpdate(callback) {
    if (this.socket) {
      this.socket.on('leaderboard-updated', callback);
    }
  }

  joinTeamRoom(teamId) {
    if (this.socket) {
      this.socket.emit('join-team', teamId);
      console.log(`👥 Rejoint la salle de l'équipe ${teamId}`);
    }
  }

  leaveTeamRoom(teamId) {
    if (this.socket) {
      this.socket.emit('leave-team', teamId);
      console.log(`👋 Quitté la salle de l'équipe ${teamId}`);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();