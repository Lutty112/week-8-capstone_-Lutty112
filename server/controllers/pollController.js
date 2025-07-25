
const Poll = require('../models/Poll');

exports.createPoll = async (req, res) => {
  try {
    console.log('Creating poll, user:', req.user); // Debug user
    const { question, options } = req.body;

    const poll = await Poll.create({
      question,
      options,
      createdBy: req.user._id,
    });

    res.status(201).json(poll);
  } catch (error) {
    console.error('Poll creation error:', error);
    res.status(500).json({ message: 'Poll creation failed', error });
  }
};

exports.votePoll = async (req, res) => {
  try {
    console.log('Voting, user:', req.user); // Debug user
    const { pollId, optionIndex } = req.body;
    const poll = await Poll.findById(pollId);

    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.json(poll);
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ message: 'Voting failed', error });
  }
};

exports.getAllPolls = async (req, res) => {
  try {
    console.log('Fetching polls, user:', req.user); // Debug user
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    console.error('Fetch polls error:', error);
    res.status(500).json({ message: 'Failed to fetch polls', error });
  }
};