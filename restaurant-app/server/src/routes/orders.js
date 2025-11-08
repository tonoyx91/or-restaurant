const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Food = require('../models/Food');
const { vatPercent, platformFee } = require('../config');

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, address, phone, voucher, paymentMethod } = req.body;
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const vat = +(subtotal * (vatPercent / 100)).toFixed(2);
    const pf = platformFee;
    let total = subtotal + vat + pf;
    if (voucher && voucher.discountPercent) {
      total = total * (1 - voucher.discountPercent / 100);
    }
    const order = new Order({
      user: req.user.id,
      items,
      address,
      phone,
      voucher,
      paymentMethod,
      subtotal,
      vat,
      platformFee: pf,
      total
    });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.food');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
