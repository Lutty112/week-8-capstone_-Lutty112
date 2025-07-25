
const express = require('express');
const router = express.Router();
const { createPoll, votePoll, getAllPolls } = require('../controllers/pollController');
const { protect, authorize } = require('../middleware/authmiddleware');

router.post('/', protect, authorize(['leader', 'admin']), createPoll);
router.post('/:id/vote', protect, votePoll); // Fix route to POST and remove authorize
router.get('/', protect, getAllPolls);

module.exports = router;