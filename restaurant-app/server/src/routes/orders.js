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
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('items.food');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Rate an order
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate delivered orders' });
    }

    if (order.rating) {
      return res.status(400).json({ message: 'Order already rated' });
    }

    order.rating = rating;
    await order.save();

    // Update food ratings
    for (const item of order.items) {
      if (item.food) {
        const food = await Food.findById(item.food);
        if (food) {
          if (!food.ratingCount) food.ratingCount = 0;
          if (!food.ratingSum) food.ratingSum = 0;
          
          food.ratingCount++;
          food.ratingSum += rating;
          food.rating = +(food.ratingSum / food.ratingCount).toFixed(1);
          
          await food.save();
        }
      }
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
