const Score = require('../models/Score');
const Challenge = require('../models/Challenge');
const Team = require('../models/Team');
const { successResponse, createdResponse, notFoundResponse, badRequestResponse } = require('../utils/responses');

// @desc    Soumettre un score (Leader/Member)
// @route   POST /api/scores
// @access  Private
const submitScore = async (req, res, next) => {
  try {
    const { challengeId, submissionNote } = req.body;

    // Vérifier que l'utilisateur a une équipe
    if (!req.user.teamId) {
      return badRequestResponse(res, 'Vous devez faire partie d\'une équipe pour soumettre un score');
    }

    // Vérifier que le défi existe et est actif
    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return notFoundResponse(res, 'Défi non trouvé');
    }

    if (!challenge.isActive) {
      return badRequestResponse(res, 'Ce défi n\'est plus actif');
    }

    if (challenge.isExpired()) {
      return badRequestResponse(res, 'Ce défi est expiré');
    }

    // Vérifier si l'équipe a déjà soumis pour ce défi
    const existingScore = await Score.findOne({
      teamId: req.user.teamId,
      challengeId
    });

    if (existingScore) {
      return badRequestResponse(res, 'Votre équipe a déjà soumis pour ce défi');
    }

    // Créer le score
    const score = await Score.create({
      teamId: req.user.teamId,
      challengeId,
      pointsEarned: challenge.points,
      submittedBy: req.user._id,
      submissionNote: submissionNote || '',
      status: 'pending'
    });

    const populatedScore = await Score.findById(score._id)
      .populate('teamId', 'name logo')
      .populate('challengeId', 'title type points')
      .populate('submittedBy', 'name email');

    // Émettre un événement Socket.IO pour notifier l'admin
    const io = req.app.get('io');
    if (io) {
      io.to('leaderboard').emit('score-submitted', {
        scoreId: score._id.toString(),
        teamId: req.user.teamId.toString(),
        challengeId: challengeId
      });
    }

    createdResponse(res, { score: populatedScore }, 'Score soumis avec succès. En attente de validation.');

  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer tous les scores
// @route   GET /api/scores
// @access  Private/Admin
const getAllScores = async (req, res, next) => {
  try {
    const { status, teamId, challengeId, sortBy = 'submittedAt', order = 'desc' } = req.query;

    let query = {};

    if (status) query.status = status;
    if (teamId) query.teamId = teamId;
    if (challengeId) query.challengeId = challengeId;

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const scores = await Score.find(query)
      .populate('teamId', 'name logo score')
      .populate('challengeId', 'title type points')
      .populate('submittedBy', 'name email')
      .populate('validatedBy', 'name email')
      .sort(sortOptions);

    successResponse(res, { 
      scores,
      total: scores.length 
    }, 'Scores récupérés');

  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les scores en attente de validation
// @route   GET /api/scores/pending
// @access  Private/Admin
const getPendingScores = async (req, res, next) => {
  try {
    const scores = await Score.find({ status: 'pending' })
      .populate('teamId', 'name logo score')
      .populate('challengeId', 'title type points deadline')
      .populate('submittedBy', 'name email')
      .sort({ submittedAt: -1 });

    successResponse(res, { 
      scores,
      total: scores.length 
    }, 'Scores en attente récupérés');

  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les scores d'une équipe
// @route   GET /api/scores/team/:teamId
// @access  Public
const getTeamScores = async (req, res, next) => {
  try {
    const scores = await Score.find({ teamId: req.params.teamId })
      .populate('challengeId', 'title type points deadline')
      .populate('submittedBy', 'name')
      .populate('validatedBy', 'name')
      .sort({ submittedAt: -1 });

    // Calculer les statistiques
    const validated = scores.filter(s => s.status === 'validated').length;
    const pending = scores.filter(s => s.status === 'pending').length;
    const rejected = scores.filter(s => s.status === 'rejected').length;
    const totalPoints = scores
      .filter(s => s.status === 'validated')
      .reduce((sum, s) => sum + s.pointsEarned, 0);

    successResponse(res, { 
      scores,
      stats: {
        total: scores.length,
        validated,
        pending,
        rejected,
        totalPoints
      }
    }, 'Scores de l\'équipe récupérés');

  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer un score par ID
// @route   GET /api/scores/:id
// @access  Private
const getScoreById = async (req, res, next) => {
  try {
    const score = await Score.findById(req.params.id)
      .populate('teamId', 'name logo score')
      .populate('challengeId', 'title type points deadline description')
      .populate('submittedBy', 'name email')
      .populate('validatedBy', 'name email');

    if (!score) {
      return notFoundResponse(res, 'Score non trouvé');
    }

    // Vérifier les permissions (seulement l'équipe concernée ou admin)
    if (req.user.role !== 'admin' && 
        (!req.user.teamId || req.user.teamId.toString() !== score.teamId._id.toString())) {
      return errorResponse(res, 'Accès refusé', 403);
    }

    successResponse(res, { score }, 'Score récupéré');

  } catch (error) {
    next(error);
  }
};

// @desc    Valider un score (Admin)
// @route   PUT /api/scores/:id/validate
// @access  Private/Admin
const validateScore = async (req, res, next) => {
  try {
    const { validationNote } = req.body;

    const score = await Score.findById(req.params.id);

    if (!score) {
      return notFoundResponse(res, 'Score non trouvé');
    }

    if (score.status !== 'pending') {
      return badRequestResponse(res, 'Ce score a déjà été traité');
    }

    // Valider le score (met à jour automatiquement le score de l'équipe)
    await score.validateScore(req.user._id, validationNote);

    // Récupérer l'équipe mise à jour
    const team = await Team.findById(score.teamId);
    
    // Vérifier si l'équipe obtient un badge
    const teamScores = await Score.countDocuments({ 
      teamId: score.teamId, 
      status: 'validated' 
    });

    // Badge "first_challenge" - Premier défi validé
    if (teamScores === 1) {
      team.addBadge('first_challenge');
      await team.save();
    }

    const populatedScore = await Score.findById(score._id)
      .populate('teamId', 'name logo score badges')
      .populate('challengeId', 'title type points')
      .populate('submittedBy', 'name')
      .populate('validatedBy', 'name');

    // Émettre un événement Socket.IO pour mettre à jour le classement
    const io = req.app.get('io');
    if (io) {
      io.to('leaderboard').emit('leaderboard-updated', {
        teamId: score.teamId.toString(),
        newScore: team.score
      });
      io.to(`team:${score.teamId.toString()}`).emit('score-updated', {
        scoreId: score._id.toString(),
        status: 'validated'
      });
    }

    successResponse(res, { score: populatedScore }, 'Score validé avec succès');

  } catch (error) {
    next(error);
  }
};

// @desc    Rejeter un score (Admin)
// @route   PUT /api/scores/:id/reject
// @access  Private/Admin
const rejectScore = async (req, res, next) => {
  try {
    const { validationNote } = req.body;

    if (!validationNote) {
      return badRequestResponse(res, 'Veuillez fournir une raison pour le rejet');
    }

    const score = await Score.findById(req.params.id);

    if (!score) {
      return notFoundResponse(res, 'Score non trouvé');
    }

    if (score.status !== 'pending') {
      return badRequestResponse(res, 'Ce score a déjà été traité');
    }

    await score.reject(req.user._id, validationNote);

    const populatedScore = await Score.findById(score._id)
      .populate('teamId', 'name logo')
      .populate('challengeId', 'title type')
      .populate('submittedBy', 'name')
      .populate('validatedBy', 'name');

    // Émettre un événement Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`team:${score.teamId.toString()}`).emit('score-updated', {
        scoreId: score._id.toString(),
        status: 'rejected'
      });
    }

    successResponse(res, { score: populatedScore }, 'Score rejeté');

  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un score (Admin)
// @route   DELETE /api/scores/:id
// @access  Private/Admin
const deleteScore = async (req, res, next) => {
  try {
    const score = await Score.findById(req.params.id);

    if (!score) {
      return notFoundResponse(res, 'Score non trouvé');
    }

    // Si le score était validé, déduire les points de l'équipe
    if (score.status === 'validated') {
      await Team.findByIdAndUpdate(
        score.teamId,
        { $inc: { score: -score.pointsEarned } }
      );
    }

    await score.deleteOne();

    successResponse(res, null, 'Score supprimé');

  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les statistiques des scores (Admin)
// @route   GET /api/scores/stats
// @access  Private/Admin
const getScoreStats = async (req, res, next) => {
  try {
    const total = await Score.countDocuments();
    const pending = await Score.countDocuments({ status: 'pending' });
    const validated = await Score.countDocuments({ status: 'validated' });
    const rejected = await Score.countDocuments({ status: 'rejected' });

    // Points totaux distribués
    const validatedScores = await Score.find({ status: 'validated' });
    const totalPointsDistributed = validatedScores.reduce((sum, s) => sum + s.pointsEarned, 0);

    // Scores par type de défi
    const scoresByType = await Score.aggregate([
      {
        $lookup: {
          from: 'challenges',
          localField: 'challengeId',
          foreignField: '_id',
          as: 'challenge'
        }
      },
      { $unwind: '$challenge' },
      {
        $group: {
          _id: '$challenge.type',
          count: { $sum: 1 }
        }
      }
    ]);

    successResponse(res, {
      total,
      byStatus: {
        pending,
        validated,
        rejected
      },
      totalPointsDistributed,
      byType: scoresByType
    }, 'Statistiques des scores récupérées');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitScore,
  getAllScores,
  getPendingScores,
  getTeamScores,
  getScoreById,
  validateScore,
  rejectScore,
  deleteScore,
  getScoreStats
};