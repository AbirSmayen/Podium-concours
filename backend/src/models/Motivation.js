const mongoose = require('mongoose');

const motivationSchema = new mongoose.Schema({
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  message: { type: String, required: true, maxlength: 1000 },
  reactions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reaction: { type: String, enum: ['like', 'clap', 'fire', 'heart'], default: 'like' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Motivation', motivationSchema);

