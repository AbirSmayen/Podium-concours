const express = require('express');
const routerMotivations = express.Router();
const { sendMotivation, getTeamMotivations, reactMotivation } = require('../controllers/motivationController');
const { authenticate } = require('../middleware/auth');
const { isActive, isLeaderOrAdmin } = require('../middleware/roleCheck');
const { motivationValidation, idValidation } = require('../utils/validators');

// Leader envoie un message
routerMotivations.post('/', authenticate, isActive, isLeaderOrAdmin, motivationValidation, sendMotivation);

// Membres/Leaders récupèrent les messages d'une équipe (auth requis)
routerMotivations.get('/team/:teamId', authenticate, isActive, getTeamMotivations);

// Réactions aux messages
routerMotivations.post('/:motivationId/react', authenticate, isActive, reactMotivation);

module.exports = routerMotivations;

