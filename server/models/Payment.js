const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'TZS' },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['mobile_money', 'bank_transfer', 'cash', 'other'], default: 'mobile_money' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionReference: { type: String }, // optional unique ID from payment gateway
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);


