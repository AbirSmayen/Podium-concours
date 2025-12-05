// src/services/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

class SocketService {
  constructor() {
    this.socket = null;
    this.mockCallbacks = {
      'score-updated': [],
      'leaderboard-updated': []
    };
  }

  connect() {
    if (USE_MOCK) {
      console.log('Socket en mode MOCK');
      // Simuler des mises à jour périodiques
      this.startMockUpdates();
      return { connected: true };
    }

    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      this.socket.on('connect', () => {
        console.log('Socket connecté');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket déconnecté');
      });
    }
    return this.socket;
  }

  startMockUpdates() {
    // Simuler une mise à jour toutes les 30 secondes
    setInterval(() => {
      this.mockCallbacks['leaderboard-updated'].forEach(cb => cb({ updated: true }));
    }, 30000);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onScoreUpdate(callback) {
    if (USE_MOCK) {
      this.mockCallbacks['score-updated'].push(callback);
      return;
    }
    if (this.socket) {
      this.socket.on('score-updated', callback);
    }
  }

  onLeaderboardUpdate(callback) {
    if (USE_MOCK) {
      this.mockCallbacks['leaderboard-updated'].push(callback);
      return;
    }
    if (this.socket) {
      this.socket.on('leaderboard-updated', callback);
    }
  }

  joinTeamRoom(teamId) {
    if (USE_MOCK) {
      console.log('Mock: Joined team room', teamId);
      return;
    }
    if (this.socket) {
      this.socket.emit('join-team', teamId);
    }
  }

  leaveTeamRoom(teamId) {
    if (USE_MOCK) {
      console.log('Mock: Left team room', teamId);
      return;
    }
    if (this.socket) {
      this.socket.emit('leave-team', teamId);
    }
  }
}

export default new SocketService();