const Payment = require('../models/mysql/Payment');
const Booking = require('../models/mysql/Booking');
const crypto = require('crypto');

// POST /api/payments/create-order
const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ success: false, message: 'Booking ID required' });

    const booking = await Booking.findOne({ where: { id: bookingId, userId: req.user.id } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'confirmed') {
      return res.status(400).json({ success: false, message: 'Booking is already paid' });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay keys are not set (dev/demo mode), simulate a payment order
    if (!razorpayKeyId || razorpayKeyId === 'rzp_test_your_key_id') {
      const mockOrderId = 'order_' + Math.random().toString(36).slice(2, 14).toUpperCase();
      const paymentRecord = await Payment.create({
        bookingId: booking.id,
        userId: req.user.id,
        razorpayOrderId: mockOrderId,
        amount: booking.totalPrice,
        currency: 'INR',
        status: 'created',
      });

      return res.json({
        success: true,
        order: {
          id: mockOrderId,
          amount: Math.round(Number(booking.totalPrice) * 100),
          currency: 'INR',
        },
        paymentId: paymentRecord.id,
        key: 'DEMO_MODE',
        demoMode: true,
      });
    }

    // Real Razorpay integration
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(booking.totalPrice) * 100),
      currency: 'INR',
      receipt: `rcpt_${booking.bookingId}`,
    });

    const paymentRecord = await Payment.create({
      bookingId: booking.id,
      userId: req.user.id,
      razorpayOrderId: order.id,
      amount: booking.totalPrice,
      currency: 'INR',
      status: 'created',
    });

    res.json({ success: true, order, paymentId: paymentRecord.id, key: razorpayKeyId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/payments/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, paymentId } = req.body;

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Demo mode: skip signature check
    if (!razorpayKeySecret || razorpayKeySecret === 'your_razorpay_secret') {
      const payment = await Payment.findByPk(paymentId);
      if (payment) {
        await payment.update({ status: 'paid', razorpayPaymentId: razorpay_payment_id || 'DEMO_PAY' });
      }
      await Booking.update({ status: 'confirmed' }, { where: { id: bookingId } });
      return res.json({ success: true, message: 'Payment verified (demo mode)' });
    }

    // Real verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const payment = await Payment.findByPk(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });

    await payment.update({ status: 'paid', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature });
    await Booking.update({ status: 'confirmed' }, { where: { id: bookingId } });

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/payments/my
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, verifyPayment, getMyPayments };
