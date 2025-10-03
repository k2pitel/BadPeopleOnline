const express = require('express');
const { nanoid } = require('nanoid');
const Room = require('../models/Room');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all public rooms
router.get('/', optionalAuth, async (req, res) => {
  try {
    const rooms = await Room.find({ 
      isPublic: true, 
      status: 'waiting',
      currentPlayers: { $lt: '$maxPlayers' }
    })
    .select('code name host maxPlayers currentPlayers status createdAt')
    .populate('host', 'username displayName')
    .limit(20)
    .sort('-createdAt');

    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get room by code
router.get('/:code', optionalAuth, async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code.toUpperCase() })
      .populate('host', 'username displayName')
      .populate('questionPack');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Hide votes if game is in progress
    const roomData = room.toObject();
    if (room.status === 'playing') {
      delete roomData.votes;
    }

    res.json(roomData);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new room
router.post('/', auth, async (req, res) => {
  try {
    const { name, isPublic, maxPlayers, questionPackId } = req.body;

    // Generate unique room code
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = nanoid(6).toUpperCase();
      const existing = await Room.findOne({ code });
      if (!existing) {
        isUnique = true;
      }
    }

    const room = new Room({
      code,
      name,
      host: req.user._id,
      isPublic: isPublic !== false,
      maxPlayers: maxPlayers || 8,
      questionPack: questionPackId,
      players: [{
        userId: req.user._id,
        username: req.user.username,
        displayName: req.user.displayName,
        score: 0,
        isConnected: true
      }],
      currentPlayers: 1
    });

    await room.save();

    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
