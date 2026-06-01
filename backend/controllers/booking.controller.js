const Booking = require('../models/mysql/Booking');
const Room = require('../models/mongo/Room');
const { v4: uuidv4 } = require('uuid');

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, specialRequests } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return res.status(400).json({ success: false, message: 'Invalid dates' });

    // Use frontend-calculated price (with GST) if provided, else calculate base price
    const basePrice = nights * room.price;
    const totalPrice = req.body.totalPrice && Number(req.body.totalPrice) > 0
      ? Number(req.body.totalPrice)
      : Math.round(basePrice * 1.18);
    const bookingId = 'BK' + uuidv4().slice(0, 8).toUpperCase();

    const booking = await Booking.create({
      bookingId,
      userId: req.user.id,
      roomId,
      roomType: room.type,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      specialRequests,
      status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Booking created', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Already cancelled' });

    await booking.update({ status: 'cancelled' });
    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking };
