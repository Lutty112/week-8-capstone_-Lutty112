
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'TZS' },
  paymentMethod: { type: String, enum: ['mobile_money', 'bank_transfer', 'cash', 'other'], default: 'mobile_money', required: true },
  transactionReference: { type: String },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);