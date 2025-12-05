const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { successResponse, errorResponse, createdResponse, badRequestResponse } = require('../utils/responses');

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, leaderRequestMessage } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return badRequestResponse(res, 'Cet email est déjà utilisé');
    }

    // Créer l'utilisateur
    const userData = {
      name,
      email,
      password,
      role: role === 'leader' ? 'leader' : 'member',
      status: role === 'leader' ? 'pending' : 'active'
    };

    // Ajouter le message si demande de leader
    if (role === 'leader' && leaderRequestMessage) {
      userData.leaderRequestMessage = leaderRequestMessage;
    }

    const user = await User.create(userData);

    // Générer le token
    const token = generateToken(user._id, user.role);

    createdResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        teamId: user.teamId
      },
      token
    }, 'Inscription réussie');

  } catch (error) {
    next(error);
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur avec le mot de passe
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return badRequestResponse(res, 'Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return badRequestResponse(res, 'Email ou mot de passe incorrect');
    }

    // Vérifier le statut
    if (user.status === 'blocked') {
      return errorResponse(res, 'Votre compte a été bloqué. Contactez un administrateur.', 403);
    }

    // Générer le token
    const token = generateToken(user._id, user.role);

    successResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        teamId: user.teamId
      },
      token
    }, 'Connexion réussie');

  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('teamId', 'name logo score');
    
    successResponse(res, { user }, 'Profil récupéré');

  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le profil
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email && email !== user.email) {
      // Vérifier si le nouvel email existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return badRequestResponse(res, 'Cet email est déjà utilisé');
      }
      user.email = email;
    }

    await user.save();

    successResponse(res, { user }, 'Profil mis à jour');

  } catch (error) {
    next(error);
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return badRequestResponse(res, 'Veuillez fournir l\'ancien et le nouveau mot de passe');
    }

    const user = await User.findById(req.user._id).select('+password');

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return badRequestResponse(res, 'Mot de passe actuel incorrect');
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    successResponse(res, null, 'Mot de passe mis à jour avec succès');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};