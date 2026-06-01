const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, addReview } = require('../controllers/room.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', protect, adminOnly, createRoom);
router.put('/:id', protect, adminOnly, updateRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);
router.post('/:id/review', protect, addReview);

module.exports = router;
