const Payment = require('../models/Payment');

// Log a payment (after successful processing from gateway)
exports.recordPayment = async (req, res) => {
  try {
    const { amount, currency = 'TZS', method, transactionReference } = req.body;

    const payment = await Payment.create({
      payer: req.user._id,
      amount,
      currency,
      paymentMethod: method, // Map method to paymentMethod
      transactionReference: transactionReference || `TX${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'pending',
      createdAt: new Date(), // Explicitly set for consistency
    });

    console.log('Payment recorded:', payment);
    res.status(201).json(payment);
  } catch (error) {
    console.error('Payment recording failed:', error);
    res.status(500).json({ message: 'Payment recording failed', error: error.message });
  }
};

// Get all payments by user
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ payer: req.user._id }).sort({ createdAt: -1 });
    console.log('Payments fetched for user:', req.user._id, payments);
    res.json(payments || []);
  } catch (error) {
    console.error('Could not retrieve payments:', error);
    res.status(500).json({ message: 'Could not retrieve payments', error: error.message });
  }
};

// Admin: Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('payer', 'username email');
    console.log('All payments fetched:', payments);
    res.json(payments || []);
  } catch (error) {
    console.error('Could not retrieve all payments:', error);
    res.status(500).json({ message: 'Could not retrieve all payments', error: error.message });
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
        createdAt: new Date(),
      });

      console.log('Simulated M-Pesa payment:', payment);
      res.status(201).json({ message: 'Simulated M-Pesa payment success', payment });
    }, 2000);
  } catch (error) {
    console.error('Simulation failed:', error);
    res.status(500).json({ message: 'Simulation failed', error: error.message });
  }
};