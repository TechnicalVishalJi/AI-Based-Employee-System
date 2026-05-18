const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/ai/recommend
// @desc    Get AI Recommendations
// @access  Private
router.post('/recommend', authMiddleware, aiController.recommend);

module.exports = router;
