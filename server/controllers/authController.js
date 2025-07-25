
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

exports.register = async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : 'default-profile.jpg';

    console.log('Register attempt:', { fullName, phone, email, profileImage });

    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: 'Please provide fullName, phone, and password' });
    }

    const existingUser = await User.findOne({ $or: [{ email: email?.toLowerCase() }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or phone',
        existingField: existingUser.email === email?.toLowerCase() ? 'email' : 'phone',
      });
    }

    const newUser = new User({
      fullName,
      phone,
      email: email?.toLowerCase(),
      password,
      profileImage,
    });
    await newUser.save();
    console.log('New user created:', { _id: newUser._id, email: newUser.email });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        position: newUser.position,
        profileImage: newUser.profileImage,
        hasPaidEntryFee: newUser.hasPaidEntryFee,
        isOnline: newUser.isOnline,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase();
    console.log('Normalized email:', normalizedEmail);
    const user = await User.findOne({ email: normalizedEmail });
    console.log('Found user:', user ? { _id: user._id, email: user.email } : 'No user found');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        position: user.position,
        profileImage: user.profileImage,
        hasPaidEntryFee: user.hasPaidEntryFee,
        isOnline: user.isOnline,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};