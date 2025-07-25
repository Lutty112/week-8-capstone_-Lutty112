const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      optionText: { type: String, required: true },
      votes: { type: Number, default: 0 },
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);



