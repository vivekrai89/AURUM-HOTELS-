const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyPayments } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my', protect, getMyPayments);

module.exports = router;
