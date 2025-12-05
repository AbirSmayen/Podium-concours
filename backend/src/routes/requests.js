const express = require('express');
const routerRequests = express.Router();
const { submitRequest, getTeamRequests, acceptRequest, rejectRequest } = require('../controllers/requestController');
const { authenticate } = require('../middleware/auth');
const { isActive, isLeaderOrAdmin } = require('../middleware/roleCheck');
const { requestValidation, idValidation } = require('../utils/validators');

// Public : soumettre une demande
routerRequests.post('/', requestValidation, submitRequest);

// Leader ou Admin : voir demandes de son équipe et accepter/refuser
routerRequests.get('/team', authenticate, isActive, isLeaderOrAdmin, getTeamRequests);
routerRequests.put('/:id/accept', authenticate, isActive, isLeaderOrAdmin, idValidation, acceptRequest);
routerRequests.put('/:id/reject', authenticate, isActive, isLeaderOrAdmin, idValidation, rejectRequest);

module.exports = routerRequests;

