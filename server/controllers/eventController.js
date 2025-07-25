// controllers/eventController.js
const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: req.user._id,
      attendees: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error });
  }
};
