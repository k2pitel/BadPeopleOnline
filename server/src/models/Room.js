const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  maxPlayers: {
    type: Number,
    default: 8,
    min: 3,
    max: 12
  },
  currentPlayers: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting'
  },
  questionPack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionPack'
  },
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  totalRounds: {
    type: Number,
    default: 10
  },
  players: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    displayName: String,
    score: {
      type: Number,
      default: 0
    },
    isConnected: {
      type: Boolean,
      default: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  votes: [{
    questionId: String,
    round: Number,
    votes: [{
      voterId: mongoose.Schema.Types.ObjectId,
      targetId: mongoose.Schema.Types.ObjectId,
      timestamp: Date
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
