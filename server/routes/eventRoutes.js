const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authmiddleware');
const { createEvent, getAllEvents, deleteEvent } = require('../controllers/eventController');

router.post('/', protect, authorize(['leader', 'admin']), createEvent);
router.get('/', protect,  getAllEvents);
router.delete('/:id', protect, authorize(['leader', 'admin']), deleteEvent);
router.post('/:id/attend', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (!event.attendees.includes(req.user._id)) {
      event.attendees.push(req.user._id);
      await event.save();
    }
    res.json({ message: 'Successfully joined event' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join event', error });
  }
});

module.exports = router;
