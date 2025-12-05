const Request = require('../models/Request');
const User = require('../models/User');
const Team = require('../models/Team');
const { successResponse, badRequestResponse, notFoundResponse } = require('../utils/responses');
const bcrypt = require('bcryptjs');

// Envoyer une demande d'adhésion (public)
const submitRequest = async (req, res, next) => {
  try {
    const { name, email, password, teamId, message } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return notFoundResponse(res, 'Équipe introuvable');

    // Vérifier si email déjà utilisé
    const existing = await User.findOne({ email });
    if (existing) return badRequestResponse(res, 'Un compte existe déjà avec cet email');

    // Vérifier si une demande existe déjà
    const existingReq = await Request.findOne({ email, teamId, status: 'pending' });
    if (existingReq) return badRequestResponse(res, 'Une demande est déjà en attente pour cette équipe');

    const request = await Request.create({
      name,
      email,
      password, // sera hashé à l'acceptation
      teamId,
      message: message || ''
    });

    successResponse(res, { request }, 'Demande envoyée');
  } catch (error) {
    next(error);
  }
};

// Liste des demandes pour un leader (leader actif)
const getTeamRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ teamId: req.user.teamId, status: 'pending' })
      .sort({ createdAt: -1 });
    successResponse(res, { requests }, 'Demandes récupérées');
  } catch (error) {
    next(error);
  }
};

// Accepter une demande (leader)
const acceptRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request || request.status !== 'pending') return notFoundResponse(res, 'Demande introuvable');

    // Créer l'utilisateur membre
    const hashed = await bcrypt.hash(request.password, 10);
    const user = await User.create({
      name: request.name,
      email: request.email,
      password: hashed,
      role: 'member',
      status: 'active',
      teamId: request.teamId
    });

    // Ajouter le membre à l'équipe
    await Team.findByIdAndUpdate(request.teamId, { $addToSet: { members: user._id } });

    request.status = 'accepted';
    await request.deleteOne();

    successResponse(res, { user }, 'Membre accepté et créé');
  } catch (error) {
    next(error);
  }
};

// Refuser une demande (leader)
const rejectRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request || request.status !== 'pending') return notFoundResponse(res, 'Demande introuvable');

    request.status = 'rejected';
    await request.deleteOne();

    successResponse(res, null, 'Demande refusée');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRequest,
  getTeamRequests,
  acceptRequest,
  rejectRequest
};

