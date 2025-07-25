const express = require('express');
const router = express.Router();
const { getAllUsers, getUserProfile, updateUser, deleteUser, getMe } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authmiddleware');

// Routes
router.get('/', getAllUsers);              
router.get('/:id', protect, getUserProfile);          
router.put('/:id', protect, updateUser);            
router.get("/me", protect, getMe);   
router.delete('/:id', protect, authorize(['leader', 'admin']), deleteUser); 

module.exports = router;