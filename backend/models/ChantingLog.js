const mongoose = require('mongoose');

const chantingLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // stored as YYYY-MM-DD for easy querying
    required: true
  },
  rounds: {
    type: Number,
    required: true,
    min: [0, 'Rounds cannot be negative']
  }
}, {
  timestamps: true
});

// Compound unique index: one log per user per date
chantingLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ChantingLog', chantingLogSchema);
