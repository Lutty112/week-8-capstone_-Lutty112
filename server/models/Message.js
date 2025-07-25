const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomName: { type: String, enum: ['GeneralRoom', 'Leaders-Corner'], required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  context: { type: String, required: true },
  image: { type: String, default: 'default-recipe.jpg' },
  reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        emoji: { type: String }, // e.g., '❤️', '👍'
      } ],
  createdAt: { type: String, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);


