const Challenge = require('../models/Challenge');
const { successResponse: successResp, createdResponse: createdResp, notFoundResponse: notFoundResp, badRequestResponse: badRequestResp } = require('../utils/responses');

const createChallenge = async (req, res, next) => {
  try {
    const { title, description, type, points, deadline, resources } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      type,
      points,
      deadline,
      resources: resources || [],
      createdBy: req.user._id
    });

    const populatedChallenge = await Challenge.findById(challenge._id)
      .populate('createdBy', 'name email');

    createdResp(res, { challenge: populatedChallenge }, 'Défi créé');

  } catch (error) {
    next(error);
  }
};

const getAllChallenges = async (req, res, next) => {
  try {
    const { type, isActive, sortBy = 'createdAt', order = 'desc' } = req.query;

    let query = {};

    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const challenges = await Challenge.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOptions);

    const challengesWithStatus = challenges.map(challenge => ({
      ...challenge.toObject(),
      isExpired: challenge.isExpired(),
      isUrgent: challenge.isUrgent
    }));

    successResp(res, { 
      challenges: challengesWithStatus,
      total: challenges.length 
    }, 'Défis récupérés');

  } catch (error) {
    next(error);
  }
};

const getActiveChallenges = async (req, res, next) => {
  try {
    const { type } = req.query;

    let query = { 
      isActive: true,
      deadline: { $gte: new Date() }
    };

    if (type) query.type = type;

    const challenges = await Challenge.find(query)
      .populate('createdBy', 'name email')
      .sort({ deadline: 1 });

    const challengesWithStatus = challenges.map(challenge => ({
      ...challenge.toObject(),
      isUrgent: challenge.isUrgent
    }));

    successResp(res, { 
      challenges: challengesWithStatus,
      total: challenges.length 
    }, 'Défis actifs');

  } catch (error) {
    next(error);
  }
};

const getChallengeById = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!challenge) {
      return notFoundResp(res, 'Défi non trouvé');
    }

    const challengeData = {
      ...challenge.toObject(),
      isExpired: challenge.isExpired(),
      isUrgent: challenge.isUrgent
    };

    successResp(res, { challenge: challengeData }, 'Défi récupéré');

  } catch (error) {
    next(error);
  }
};

const updateChallenge = async (req, res, next) => {
  try {
    const { title, description, type, points, deadline, resources, isActive } = req.body;

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return notFoundResp(res, 'Défi non trouvé');
    }

    if (title !== undefined) challenge.title = title;
    if (description !== undefined) challenge.description = description;
    if (type !== undefined) challenge.type = type;
    if (points !== undefined) challenge.points = points;
    if (deadline !== undefined) challenge.deadline = deadline;
    if (resources !== undefined) challenge.resources = resources;
    if (isActive !== undefined) challenge.isActive = isActive;

    await challenge.save();

    const updatedChallenge = await Challenge.findById(challenge._id)
      .populate('createdBy', 'name email');

    successResp(res, { challenge: updatedChallenge }, 'Défi mis à jour');

  } catch (error) {
    next(error);
  }
};

const toggleChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return notFoundResp(res, 'Défi non trouvé');
    }

    challenge.isActive = !challenge.isActive;
    await challenge.save();

    successResp(res, { 
      challenge,
      isActive: challenge.isActive 
    }, `Défi ${challenge.isActive ? 'activé' : 'désactivé'}`);

  } catch (error) {
    next(error);
  }
};

const deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return notFoundResp(res, 'Défi non trouvé');
    }

    const Score = require('../models/Score');
    const scoresCount = await Score.countDocuments({ challengeId: challenge._id });

    if (scoresCount > 0) {
      return badRequestResp(res, 'Impossible de supprimer un défi avec des soumissions');
    }

    await challenge.deleteOne();

    successResp(res, null, 'Défi supprimé');

  } catch (error) {
    next(error);
  }
};

const getChallengeStats = async (req, res, next) => {
  try {
    const total = await Challenge.countDocuments();
    const active = await Challenge.countDocuments({ isActive: true });
    const expired = await Challenge.countDocuments({ deadline: { $lt: new Date() } });
    const principal = await Challenge.countDocuments({ type: 'principal' });
    const mini = await Challenge.countDocuments({ type: 'mini' });

    const twoDaysFromNow = new Date();
    twoDaysFromNow.setHours(twoDaysFromNow.getHours() + 48);
    
    const urgent = await Challenge.countDocuments({
      isActive: true,
      deadline: { $gte: new Date(), $lte: twoDaysFromNow }
    });

    successResp(res, {
      total,
      active,
      expired,
      urgent,
      byType: { principal, mini }
    }, 'Statistiques');

  } catch (error) {
    next(error);
  }
};

const getTeamChallenges = async (req, res, next) => {
  try {
    const Score = require('../models/Score');
    
    const challenges = await Challenge.find({ 
      isActive: true,
      deadline: { $gte: new Date() }
    }).sort({ deadline: 1 });

    const teamScores = await Score.find({ 
      teamId: req.params.teamId 
    }).select('challengeId status pointsEarned');

    const challengesWithStatus = challenges.map(challenge => {
      const score = teamScores.find(s => 
        s.challengeId.toString() === challenge._id.toString()
      );

      return {
        ...challenge.toObject(),
        isUrgent: challenge.isUrgent,
        teamStatus: score ? {
          submitted: true,
          status: score.status,
          points: score.pointsEarned
        } : {
          submitted: false
        }
      };
    });

    successResp(res, { 
      challenges: challengesWithStatus 
    }, 'Défis équipe');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChallenge,
  getAllChallenges,
  getActiveChallenges,
  getChallengeById,
  updateChallenge,
  toggleChallenge,
  deleteChallenge,
  getChallengeStats,
  getTeamChallenges
};