const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      title: String,
      price: Number,
      qty: Number
    }
  ],
  address: String,
  phone: String,
  voucher: { code: String, discountPercent: Number },
  paymentMethod: String,
  subtotal: Number,
  vat: Number,
  platformFee: Number,
  total: Number,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
