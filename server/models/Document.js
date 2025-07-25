const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String,
     enum: ['Finance', 'Meetings', 'Reports', 'Other'], 
     default: 'Other' },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
