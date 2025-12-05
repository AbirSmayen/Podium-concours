const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  type: {
    type: String,
    enum: ['principal', 'mini'],
    default: 'mini'
  },
  points: {
    type: Number,
    required: [true, 'Les points sont obligatoires'],
    min: [0, 'Les points ne peuvent pas être négatifs']
  },
  deadline: {
    type: Date,
    required: [true, 'La date limite est obligatoire']
  },
  resources: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
challengeSchema.index({ deadline: 1, isActive: 1 });

// Méthode pour vérifier si le défi est expiré
challengeSchema.methods.isExpired = function() {
  return new Date() > this.deadline;
};

// Virtual pour savoir si le défi est bientôt expiré (moins de 48h)
challengeSchema.virtual('isUrgent').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const hoursRemaining = (deadline - now) / (1000 * 60 * 60);
  return hoursRemaining > 0 && hoursRemaining < 48;
});

module.exports = mongoose.model('Challenge', challengeSchema);