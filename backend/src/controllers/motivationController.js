const Motivation = require('../models/Motivation');
const Team = require('../models/Team');
const { successResponse, notFoundResponse, forbiddenResponse } = require('../utils/responses');

// Envoyer un message de motivation (leader)
const sendMotivation = async (req, res, next) => {
  try {
    const { message } = req.body;
    const team = await Team.findById(req.user.teamId);
    if (!team) return notFoundResponse(res, 'Équipe introuvable');

    const motivation = await Motivation.create({
      leaderId: req.user._id,
      teamId: team._id,
      message
    });

    // Gamification: on pourrait ajouter un badge ou un compteur ici

    // Émettre en temps réel
    const io = req.app.get('io');
    if (io) {
      io.to(`team:${team._id}`).emit('motivation:new', motivation);
    }

    successResponse(res, { motivation }, 'Message envoyé');
  } catch (error) {
    next(error);
  }
};

// Lister les messages pour un membre ou leader de l'équipe
const getTeamMotivations = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const motivations = await Motivation.find({ teamId }).sort({ createdAt: -1 });
    successResponse(res, { motivations }, 'Messages récupérés');
  } catch (error) {
    next(error);
  }
};

// Ajouter une réaction (membre)
const reactMotivation = async (req, res, next) => {
  try {
    const { motivationId } = req.params;
    const { reaction } = req.body;
    const motivation = await Motivation.findById(motivationId);
    if (!motivation) return notFoundResponse(res, 'Message introuvable');

    motivation.reactions.push({
      userId: req.user._id,
      reaction
    });
    await motivation.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`team:${motivation.teamId}`).emit('motivation:react', { motivationId, reaction, userId: req.user._id });
    }

    successResponse(res, { motivation }, 'Réaction ajoutée');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMotivation,
  getTeamMotivations,
  reactMotivation
};

