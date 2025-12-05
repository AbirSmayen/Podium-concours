// src/services/mockApi.js
import { mockUsers, mockTeams, mockChallenges, mockScores } from './mockData';

// Simuler un délai réseau
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

class MockAPI {
  constructor() {
    // Stocker les données en mémoire
    this.users = { ...mockUsers };
    this.teams = [...mockTeams];
    this.challenges = [...mockChallenges];
    this.scores = [...mockScores];
    this.currentUser = null;
  }

  // Auth
  async login(email, password) {
    await delay();
    
    // Trouver l'utilisateur
    let user = null;
    if (email === 'leader@test.com') {
      user = this.users.leader;
    } else if (email === 'member@test.com') {
      user = this.users.member;
    }

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    this.currentUser = user;
    const token = 'mock-jwt-token-' + user.role;
    
    return {
      data: {
        token,
        user
      }
    };
  }

  async register(userData) {
    await delay();
    const newUser = {
      _id: 'member' + Date.now(),
      ...userData,
      role: 'member',
      status: 'active'
    };
    return { data: newUser };
  }

  async requestLeader(formData) {
    await delay();
    return { data: { message: 'Demande envoyée avec succès' } };
  }

  // Teams
  async getTeams() {
    await delay();
    return { data: this.teams };
  }

  async getTeam(id) {
    await delay();
    const team = this.teams.find(t => t._id === id);
    if (!team) throw new Error('Équipe non trouvée');
    return { data: team };
  }

  async updateTeam(id, data) {
    await delay();
    const index = this.teams.findIndex(t => t._id === id);
    if (index !== -1) {
      this.teams[index] = { ...this.teams[index], ...data };
      return { data: this.teams[index] };
    }
    throw new Error('Équipe non trouvée');
  }

  async deleteTeamMember(teamId, memberId) {
    await delay();
    const team = this.teams.find(t => t._id === teamId);
    if (team) {
      team.members = team.members.filter(m => m._id !== memberId);
      return { data: team };
    }
    throw new Error('Équipe non trouvée');
  }

  // Challenges
  async getChallenges() {
    await delay();
    return { data: this.challenges };
  }

  async getChallenge(id) {
    await delay();
    const challenge = this.challenges.find(c => c._id === id);
    if (!challenge) throw new Error('Défi non trouvé');
    return { data: challenge };
  }

  // Scores
  async getScores(params = {}) {
    await delay();
    let filteredScores = [...this.scores];
    
    if (params.teamId) {
      filteredScores = filteredScores.filter(s => s.teamId === params.teamId);
    }
    
    return { data: filteredScores };
  }

  async submitScore(scoreData) {
    await delay();
    const newScore = {
      _id: 'score' + Date.now(),
      ...scoreData,
      validated: false,
      createdAt: new Date()
    };
    this.scores.push(newScore);
    return { data: newScore };
  }

  async validateScore(id, validatedBy) {
    await delay();
    const score = this.scores.find(s => s._id === id);
    if (score) {
      score.validated = true;
      score.validatedBy = validatedBy;
      
      // Mettre à jour le score de l'équipe
      const team = this.teams.find(t => t._id === score.teamId);
      if (team) {
        team.score += score.pointsEarned;
      }
      
      return { data: score };
    }
    throw new Error('Score non trouvé');
  }
}

export const mockApi = new MockAPI();