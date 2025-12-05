const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Email invalide'] },
  password: { type: String, required: true, minlength: 6 }, // sera hashé à l'acceptation
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  role: { type: String, enum: ['member'], default: 'member' },
  message: { type: String, default: '', maxlength: 500 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

