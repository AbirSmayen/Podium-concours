const express = require('express');
const routerChallenges = express.Router();
const {
  createChallenge,
  getAllChallenges,
  getActiveChallenges,
  getChallengeById,
  updateChallenge,
  toggleChallenge,
  deleteChallenge,
  getChallengeStats,
  getTeamChallenges
} = require('../controllers/challengeController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
const { challengeValidation, idValidation } = require('../utils/validators');

// Routes publiques
routerChallenges.get('/', getAllChallenges);
routerChallenges.get('/active', getActiveChallenges);
routerChallenges.get('/team/:teamId', getTeamChallenges);
routerChallenges.get('/:id', idValidation, getChallengeById);

// Routes protégées - Admin
routerChallenges.use(authenticate);
routerChallenges.use(isAdmin);

routerChallenges.post('/', challengeValidation, createChallenge);
routerChallenges.get('/stats', getChallengeStats);
routerChallenges.put('/:id', idValidation, updateChallenge);
routerChallenges.put('/:id/toggle', idValidation, toggleChallenge);
routerChallenges.delete('/:id', idValidation, deleteChallenge);

module.exports = routerChallenges;