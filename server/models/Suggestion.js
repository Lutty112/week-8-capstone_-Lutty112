const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String,
    enum: ['new', 'reviewed', 'replied'],
    default: 'new' 
  },
  reply: { type: String },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added upvotes
}, { timestamps: true });

module.exports = mongoose.model('Suggestion', suggestionSchema);