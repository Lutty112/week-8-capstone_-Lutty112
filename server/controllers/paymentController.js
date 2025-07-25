const Payment = require('../models/Payment');

// Log a payment (after successful processing from gateway)
exports.recordPayment = async (req, res) => {
  try {
    const { amount, currency, paymentMethod, transactionReference, status } = req.body;

    const payment = await Payment.create({
      payer: req.user._id,
      amount,
      currency,
      paymentMethod,
      transactionReference,
      status
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Payment recording failed', error });
  }
};

// Get all payments by user
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve payments', error });
  }
};

// Admin: Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'username email');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve all payments', error });
  }
};

// M-PESA Simulation 
exports.simulateMpesaPayment = async (req, res) => {
  try {
    const { phone, amount } = req.body;

    // Simulate reference number (e.g., M-PESA transaction code)
    const transactionReference = `MPESA${Math.floor(100000 + Math.random() * 900000)}`;

    // Simulate delay
    setTimeout(async () => {
      const payment = await Payment.create({
        payer: req.user._id,
        amount,
        currency: 'TZS',
        paymentMethod: 'M-Pesa (Simulated)',
        transactionReference,
        status: 'completed',
      });

      res.status(201).json({ message: 'Simulated M-Pesa payment success', payment });
    }, 2000); // simulate 2 second delay
  } catch (error) {
    res.status(500).json({ message: 'Simulation failed', error });
  }
};

