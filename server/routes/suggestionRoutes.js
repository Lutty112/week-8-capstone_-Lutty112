const express = require('express');
const router = express.Router();
const { createSuggestion, getSuggestions, upvoteSuggestion } = require('../controllers/suggestionController');
const { protect } = require('../middleware/authmiddleware');

router.post('/', protect, createSuggestion);
router.get('/', protect, getSuggestions);
router.post('/:id/upvote', protect, upvoteSuggestion); // Add upvote route

module.exports = router;