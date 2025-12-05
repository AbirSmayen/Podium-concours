const { body, param, validationResult } = require('express-validator');

// Middleware pour valider les résultats
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array().map(err => err.msg).join(', '),
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

// Validateurs pour l'authentification
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ max: 100 }).withMessage('Le nom ne peut pas dépasser 100 caractères'),
  body('email')
    .trim()
    .notEmpty().withMessage("L'email est obligatoire")
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est obligatoire')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  validate
];

// Validation pour demande d'adhésion
const requestValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est obligatoire'),
  body('email').trim().notEmpty().isEmail().withMessage('Email invalide'),
  body('password').notEmpty().isLength({ min: 6 }).withMessage('Mot de passe trop court'),
  body('teamId').notEmpty().isMongoId().withMessage('ID d\'équipe invalide'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message trop long'),
  validate
];

// Validation pour les motivations
const motivationValidation = [
  body('message')
    .notEmpty().withMessage('Le message est obligatoire')
    .isLength({ max: 1000 }).withMessage('Message trop long'),
  validate
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage("L'email est obligatoire")
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est obligatoire'),
  validate
];

// Validateurs pour les équipes
const teamValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage("Le nom de l'équipe est obligatoire")
    .isLength({ max: 100 }).withMessage("Le nom ne peut pas dépasser 100 caractères"),
  body('leaderId')
    .optional()
    .isMongoId().withMessage('ID de leader invalide'),
  validate
];

// Validateurs pour les défis
const challengeValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Le titre est obligatoire')
    .isLength({ max: 200 }).withMessage('Le titre ne peut pas dépasser 200 caractères'),
  body('description')
    .trim()
    .notEmpty().withMessage('La description est obligatoire')
    .isLength({ max: 2000 }).withMessage('La description ne peut pas dépasser 2000 caractères'),
  body('type')
    .isIn(['principal', 'mini']).withMessage('Type invalide'),
  body('points')
    .isInt({ min: 0 }).withMessage('Les points doivent être un nombre positif'),
  body('deadline')
    .notEmpty().withMessage('La date limite est obligatoire')
    .isISO8601().withMessage('Format de date invalide'),
  validate
];

// Validateurs pour les scores
const scoreValidation = [
  body('challengeId')
    .notEmpty().withMessage('Le défi est obligatoire')
    .isMongoId().withMessage('ID de défi invalide'),
  body('submissionNote')
    .optional()
    .isLength({ max: 500 }).withMessage('La note ne peut pas dépasser 500 caractères'),
  validate
];

// Validateur pour les IDs MongoDB
const idValidation = [
  param('id')
    .isMongoId().withMessage('ID invalide'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  teamValidation,
  challengeValidation,
  scoreValidation,
  idValidation,
  requestValidation,
  motivationValidation
};