const express = require('express');
const router = express.Router();
const { getDashboard, getAllUsers, toggleUserStatus, getAllBookings, updateBookingStatus } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

module.exports = router;
