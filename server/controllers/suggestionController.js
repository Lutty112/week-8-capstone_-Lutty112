const mongoose = require('mongoose');
const Suggestion = require('../models/Suggestion');

exports.createSuggestion = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const suggestion = await Suggestion.create({
      content,
      submittedBy: req.user._id,
    });
    console.log('Created suggestion:', suggestion);
    res.status(201).json(suggestion);
  } catch (error) {
    console.error('Create suggestion error:', error.message);
    res.status(500).json({ message: 'Error creating suggestion', error: error.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    console.log('Fetching suggestions for user:', req.user._id);
    const suggestions = await Suggestion.find().lean();
    console.log('Fetched suggestions:', suggestions);
    res.json(suggestions);
  } catch (error) {
    console.error('Fetch suggestions error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(200).json([]); // Fallback to empty array
  }
};

exports.upvoteSuggestion = async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
    if (suggestion.upvotes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already upvoted' });
    }
    suggestion.upvotes.push(req.user._id);
    await suggestion.save();
    res.json(suggestion);
  } catch (error) {
    console.error('Upvote error:', error.message);
    res.status(500).json({ message: 'Error upvoting suggestion', error: error.message });
  }
};