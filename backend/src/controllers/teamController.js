

const Team = require('../models/Team');
const User = require('../models/User');
const { successResponse, errorResponse, createdResponse, notFoundResponse, badRequestResponse } = require('../utils/responses');

// @desc    Créer une équipe (Leader)
// @route   POST /api/teams
// @access  Private/Leader
const createTeam = async (req, res, next) => {
  try {
    const { name, logo } = req.body;

    if (req.user.role !== 'leader' && req.user.role !== 'admin') {
      return errorResponse(res, 'Seuls les leaders peuvent créer des équipes', 403);
    }

    if (req.user.status !== 'active') {
      return errorResponse(res, 'Votre compte leader doit être activé pour créer une équipe', 403);
    }

    if (req.user.teamId) {
      return badRequestResponse(res, 'Vous avez déjà une équipe');
    }

    const team = await Team.create({
      name,
      logo: logo || '',
      leaderId: req.user._id,
      members: [req.user._id]
    });

    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    const populatedTeam = await Team.findById(team._id)
      .populate('leaderId', 'name email')
      .populate('members', 'name email role');

    createdResponse(res, { team: populatedTeam }, 'Équipe créée avec succès');

  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer toutes les équipes
// @route   GET /api/teams
// @access  Public
const getAllTeams = async (req, res, next) => {
  try {
    const { sortBy = 'score', order = 'desc', search } = req.query;

    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const teams = await Team.find(query)
      .populate('leaderId', 'name email')
      .populate('members', 'name email role')
      .sort(sortOptions);

    const teamsWithRank = await Promise.all(
      teams.map(async (team) => {
        const rank = await team.getRank();
        return {
          ...team.toObject(),
          rank
        };
      })
    );

    successResponse(res, { 
      teams: teamsWithRank,
      total: teams.length 
    }, 'Équipes récupérées');

  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer une équipe par ID
// @route   GET /api/teams/:id
// @access  Public
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leaderId', 'name email')
      .populate('members', 'name email role status');

    if (!team) {
      return notFoundResponse(res, 'Équipe non trouvée');
    }

    const rank = await team.getRank();

    successResponse(res, { 
      team: {
        ...team.toObject(),
        rank
      }
    }, 'Équipe récupérée');

  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer le classement (leaderboard)
// @route   GET /api/teams/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const teams = await Team.find()
      .populate('leaderId', 'name email')
      .populate('members', 'name')
      .sort({ score: -1 })
      .limit(parseInt(limit));

    const leaderboard = teams.map((team, index) => ({
      rank: index + 1,
      id: team._id,
      name: team.name,
      logo: team.logo,
      score: team.score,
      leader: team.leaderId,
      membersCount: team.members.length,
      badges: team.badges
    }));

    successResponse(res, { leaderboard }, 'Classement récupéré');

  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une équipe
// @route   PUT /api/teams/:id
// @access  Private/Leader
const updateTeam = async (req, res, next) => {
  try {
    const { name, logo } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return notFoundResponse(res, 'Équipe non trouvée');
    }

    if (team.leaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Seul le leader de l\'équipe peut la modifier', 403);
    }

    if (name) team.name = name;
    if (logo !== undefined) team.logo = logo;

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('leaderId', 'name email')
      .populate('members', 'name email role');

    successResponse(res, { team: updatedTeam }, 'Équipe mise à jour');

  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un membre
// @route   POST /api/teams/:id/members
// @access  Private/Leader
const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return notFoundResponse(res, 'Équipe non trouvée');
    }

    if (team.leaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Seul le leader peut ajouter des membres', 403);
    }

    const user = await User.findById(userId);

    if (!user) {
      return notFoundResponse(res, 'Utilisateur non trouvé');
    }

    if (user.teamId) {
      return badRequestResponse(res, 'Cet utilisateur est déjà dans une équipe');
    }

    team.members.push(userId);
    await team.save();

    user.teamId = team._id;
    await user.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('leaderId', 'name email')
      .populate('members', 'name email role');

    successResponse(res, { team: updatedTeam }, 'Membre ajouté');

  } catch (error) {
    next(error);
  }
};

// @desc    Retirer un membre
// @route   DELETE /api/teams/:id/members/:memberId
// @access  Private/Leader
const removeMember = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    const team = await Team.findById(id);

    if (!team) {
      return notFoundResponse(res, 'Équipe non trouvée');
    }

    if (team.leaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Seul le leader peut retirer des membres', 403);
    }

    if (team.leaderId.toString() === memberId) {
      return badRequestResponse(res, 'Vous ne pouvez pas retirer le leader');
    }

    team.members = team.members.filter(m => m.toString() !== memberId);
    await team.save();

    await User.findByIdAndUpdate(memberId, { teamId: null });

    const updatedTeam = await Team.findById(team._id)
      .populate('leaderId', 'name email')
      .populate('members', 'name email role');

    successResponse(res, { team: updatedTeam }, 'Membre retiré');

  } catch (error) {
    next(error);
  }
};

// @desc    Quitter une équipe
// @route   POST /api/teams/:id/leave
// @access  Private
const leaveTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return notFoundResponse(res, 'Équipe non trouvée');
    }

    if (!team.members.includes(req.user._id)) {
      return badRequestResponse(res, 'Vous n\'êtes pas membre de cette équipe');
    }

    if (team.leaderId.toString() === req.user._id.toString()) {
      return badRequestResponse(res, 'Le leader ne peut pas quitter l\'équipe');
    }

    team.members = team.members.filter(m => m.toString() !== req.user._id.toString());
    await team.save();

    await User.findByIdAndUpdate(req.user._id, { teamId: null });

    successResponse(res, null, 'Vous avez quitté l\'équipe');

  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une équipe
// @route   DELETE /api/teams/:id
// @access  Private/Leader/Admin
const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return notFoundResponse(res, 'Équipe non trouvée');
    }

    if (team.leaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Seul le leader ou un admin peut supprimer l\'équipe', 403);
    }

    await User.updateMany(
      { teamId: team._id },
      { teamId: null }
    );

    await team.deleteOne();

    successResponse(res, null, 'Équipe supprimée');

  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un badge
// @route   POST /api/teams/:id/badges
// @access  Private/Admin
const addBadge = async (req, res, next) => {
  try {
    const { badge } = req.body;

    const validBadges = ['first_challenge', 'speed_demon', 'team_player', 'perfectionist', 'champion'];
    
    if (!validBadges.includes(badge)) {
      return badRequestResponse(res, 'Badge invalide');
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return notFoundResponse(res, 'Équipe non trouvée');
    }

    team.addBadge(badge);
    await team.save();

    successResponse(res, { team }, 'Badge ajouté');

  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
