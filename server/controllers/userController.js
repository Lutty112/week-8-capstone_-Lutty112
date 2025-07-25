
const mongoose = require('mongoose'); // Added for ObjectId validation
const User = require('../models/User');

// Get all users (optionally filtered by role)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // e.g. /api/users?role=leader
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get single user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

// Update user info (only self or admin)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Only update specific fields (not password or role directly)
    const updates = {
      fullName: req.body.fullName,
      email: req.body.email,
      profileImage: req.body.profileImage,
      position: req.body.position,
    };

    const updated = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user (self or admin)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Allow only admin to delete
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete users' });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get logged-in user info (from token)
exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    console.log("req.user.id:", req.user.id); // Added for debugging
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
   res.json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      position: user.position,
      avatar: user.profileImage,
      hasPaidEntryFee: user.hasPaidEntryFee,
      isOnline: user.isOnline,
    });
  } catch (err) {
    console.error("getMe error:", err); // Detailed error logging
    res.status(500).json({ error: 'Failed to fetch user data', details: err.message });
  }
};


