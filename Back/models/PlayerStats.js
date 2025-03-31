import mongoose from 'mongoose';

const playerStatsSchema = new mongoose.Schema({
  wins: {
    type: Number,
    required: true,
    default: 0
  },
  losses: {
    type: Number,
    required: true,
    default: 0
  },
  enemiesKilledByPlayer: {
    type: Number,
    required: true,
    default: 0
  },
  playerDeathsByEnemies: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Actualizar el campo updatedAt antes de guardar
playerStatsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const PlayerStats = mongoose.model('PlayerStats', playerStatsSchema);

export default PlayerStats; 