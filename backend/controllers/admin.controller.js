const User = require('../models/mysql/User');
const Booking = require('../models/mysql/Booking');
const Payment = require('../models/mysql/Payment');
const { Op, fn, col } = require('sequelize');

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalBookings = await Booking.count();
    const confirmedBookings = await Booking.count({ where: { status: 'confirmed' } });
    const cancelledBookings = await Booking.count({ where: { status: 'cancelled' } });
    const pendingBookings = await Booking.count({ where: { status: 'pending' } });

    const totalRevenue = await Payment.sum('amount', { where: { status: 'paid' } }) || 0;

    // Monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.findAll({
      where: { status: 'paid', createdAt: { [Op.gte]: sixMonthsAgo } },
      attributes: [
        [fn('MONTH', col('createdAt')), 'month'],
        [fn('YEAR', col('createdAt')), 'year'],
        [fn('SUM', col('amount')), 'revenue'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: [fn('MONTH', col('createdAt')), fn('YEAR', col('createdAt'))],
      order: [[fn('YEAR', col('createdAt')), 'ASC'], [fn('MONTH', col('createdAt')), 'ASC']]
    });

    // Recent bookings
    const recentBookings = await Booking.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    res.json({
      success: true,
      stats: { totalUsers, totalBookings, confirmedBookings, cancelledBookings, pendingBookings, totalRevenue },
      monthlyRevenue,
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/users/:id/toggle
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // FIX: capture new state before message
    const newStatus = !user.isActive;
    await user.update({ isActive: newStatus });
    res.json({ success: true, message: `User ${newStatus ? 'activated' : 'deactivated'}`, isActive: newStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    await booking.update({ status });
    res.json({ success: true, message: 'Booking status updated', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboard, getAllUsers, toggleUserStatus, getAllBookings, updateBookingStatus };
