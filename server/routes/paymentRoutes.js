const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authmiddleware');
const { recordPayment, getMyPayments, getAllPayments } = require('../controllers/paymentController');

router.post('/', protect, recordPayment);
router.get('/my', protect, getMyPayments);
router.get('/', protect, authorize(['leader', 'admin']), getAllPayments); 

module.exports = router;
