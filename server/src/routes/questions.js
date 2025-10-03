const express = require('express');
const QuestionPack = require('../models/QuestionPack');
const { optionalAuth, auth } = require('../middleware/auth');

const router = express.Router();

// Get all available question packs
router.get('/', optionalAuth, async (req, res) => {
  try {
    let query = { isActive: true };

    // If user is not premium, only show free packs
    if (!req.user?.isPremium) {
      query.isPremium = false;
    }

    const packs = await QuestionPack.find(query)
      .select('-questions') // Don't send questions in list
      .sort('-createdAt');

    res.json(packs);
  } catch (error) {
    console.error('Get question packs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific question pack
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const pack = await QuestionPack.findById(req.params.id);

    if (!pack || !pack.isActive) {
      return res.status(404).json({ error: 'Question pack not found' });
    }

    // Check if user has access
    if (pack.isPremium && !req.user?.isPremium) {
      const hasPurchased = req.user?.purchasedPacks?.includes(pack._id);
      if (!hasPurchased) {
        return res.status(403).json({ error: 'Premium pack - purchase required' });
      }
    }

    res.json(pack);
  } catch (error) {
    console.error('Get question pack error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
