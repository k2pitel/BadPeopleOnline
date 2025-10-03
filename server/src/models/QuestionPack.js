const mongoose = require('mongoose');

const questionPackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['default', 'spicy', 'family-friendly', 'custom'],
    default: 'default'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  },
  questions: [{
    text: {
      type: String,
      required: true
    },
    category: String,
    tags: [String]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuestionPack = mongoose.model('QuestionPack', questionPackSchema);

module.exports = QuestionPack;
