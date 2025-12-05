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
        console.log('✅ Socket connecté (Admin)');
        // Rejoindre la salle du classement
        this.socket.emit('join', 'leaderboard');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket déconnecté (Admin)');
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

  onLeaderboardUpdate(callback) {
    if (this.socket) {
      this.socket.on('leaderboard-updated', callback);
    }
  }

  onScoreSubmitted(callback) {
    if (this.socket) {
      this.socket.on('score-submitted', callback);
    }
  }

  onScoreUpdated(callback) {
    if (this.socket) {
      this.socket.on('score-updated', callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();

