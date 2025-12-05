const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, "L'équipe est obligatoire"]
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: [true, 'Le défi est obligatoire']
  },
  pointsEarned: {
    type: Number,
    required: [true, 'Les points gagnés sont obligatoires'],
    min: [0, 'Les points ne peuvent pas être négatifs']
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le soumissionnaire est obligatoire']
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'validated', 'rejected'],
    default: 'pending'
  },
  submissionNote: {
    type: String,
    maxlength: [500, 'La note ne peut pas dépasser 500 caractères'],
    default: ''
  },
  validationNote: {
    type: String,
    maxlength: [500, 'La note ne peut pas dépasser 500 caractères'],
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  validatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index pour éviter les doublons (une équipe ne peut soumettre qu'une fois par défi)
scoreSchema.index({ teamId: 1, challengeId: 1 }, { unique: true });

// Index pour améliorer les performances
scoreSchema.index({ status: 1, submittedAt: -1 });

// Méthode pour valider un score
scoreSchema.methods.validate = async function(adminId, note = '') {
  this.status = 'validated';
  this.validatedBy = adminId;
  this.validatedAt = new Date();
  this.validationNote = note;
  
  // Mettre à jour le score de l'équipe
  const Team = mongoose.model('Team');
  await Team.findByIdAndUpdate(
    this.teamId,
    { $inc: { score: this.pointsEarned } }
  );
  
  return await this.save();
};

// Méthode pour rejeter un score
scoreSchema.methods.reject = async function(adminId, note = '') {
  this.status = 'rejected';
  this.validatedBy = adminId;
  this.validatedAt = new Date();
  this.validationNote = note;
  return await this.save();
};

module.exports = mongoose.model('Score', scoreSchema);