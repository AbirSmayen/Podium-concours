const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom de l'équipe est obligatoire"],
    unique: true,
    trim: true,
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"]
  },
  logo: {
    type: String,
    default: ''
  },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le leader est obligatoire']
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [{
    type: String,
    enum: ['first_challenge', 'speed_demon', 'team_player', 'perfectionist', 'champion']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de tri par score
teamSchema.index({ score: -1 });

// Méthode pour calculer le rang de l'équipe
teamSchema.methods.getRank = async function() {
  const Team = this.constructor;
  const higherScoreCount = await Team.countDocuments({ 
    score: { $gt: this.score } 
  });
  return higherScoreCount + 1;
};

// Méthode pour ajouter un badge
teamSchema.methods.addBadge = function(badgeName) {
  if (!this.badges.includes(badgeName)) {
    this.badges.push(badgeName);
  }
};

module.exports = mongoose.model('Team', teamSchema);