const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String,
    enum: ['member', 'leader', 'admin'],
    default: 'member' },
  position: { type: String },
  profileImage: { type: String, default: 'default-recipe.jpg' },
  hasPaidEntryFee: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
}, { timestamps: true });


// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);