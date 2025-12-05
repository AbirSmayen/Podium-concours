const express = require('express');
const routerScores = express.Router();
const {
  submitScore,
  getAllScores,
  getPendingScores,
  getTeamScores,
  getScoreById,
  validateScore,
  rejectScore,
  deleteScore,
  getScoreStats
} = require('../controllers/scoreController');
const { authenticate } = require('../middleware/auth');
const { isAdmin, isActive } = require('../middleware/roleCheck');
const { scoreValidation, idValidation } = require('../utils/validators');

// Routes publiques
routerScores.get('/team/:teamId', getTeamScores);

// Routes protégées - Membres actifs
routerScores.post('/', authenticate, isActive, scoreValidation, submitScore);
routerScores.get('/:id', authenticate, idValidation, getScoreById);

// Routes protégées - Admin (doivent être avant /:id pour éviter les conflits)
routerScores.get('/pending', authenticate, isAdmin, getPendingScores);
routerScores.get('/stats', authenticate, isAdmin, getScoreStats);
routerScores.get('/', authenticate, isAdmin, getAllScores); // Route pour obtenir tous les scores (admin)
routerScores.put('/:id/validate', authenticate, isAdmin, idValidation, validateScore);
routerScores.put('/:id/reject', authenticate, isAdmin, idValidation, rejectScore);
routerScores.delete('/:id', authenticate, isAdmin, idValidation, deleteScore);

module.exports = routerScores;