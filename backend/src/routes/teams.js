const express = require('express');
const routerTeams = express.Router();
const {
  createTeam,
  getAllTeams,
  getTeamById,
  getLeaderboard,
  updateTeam,
  addMember,
  removeMember,
  leaveTeam,
  deleteTeam,
  addBadge
} = require('../controllers/teamController');
const { authenticate } = require('../middleware/auth');
const { isLeaderOrAdmin, isAdmin, isActive } = require('../middleware/roleCheck');
const { teamValidation, idValidation } = require('../utils/validators');

// Routes publiques
routerTeams.get('/', getAllTeams);
routerTeams.get('/leaderboard', getLeaderboard);
routerTeams.get('/:id', idValidation, getTeamById);

// Routes protégées - Création (Leader actif)
routerTeams.post('/', authenticate, isActive, teamValidation, createTeam);

// Routes protégées - Gestion (Leader ou Admin)
routerTeams.put('/:id', authenticate, isActive, idValidation, updateTeam);
routerTeams.post('/:id/members', authenticate, isActive, idValidation, addMember);
routerTeams.delete('/:id/members/:memberId', authenticate, isActive, removeMember);
routerTeams.delete('/:id', authenticate, isActive, idValidation, deleteTeam);

// Routes protégées - Membre quitte
routerTeams.post('/:id/leave', authenticate, idValidation, leaveTeam);

// Routes protégées - Admin
routerTeams.post('/:id/badges', authenticate, isAdmin, idValidation, addBadge);

module.exports = routerTeams;



