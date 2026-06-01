const Room = require('../models/mongo/Room')

// GET /api/rooms
const getRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, guests, city } = req.query
    const filter = { isAvailable: true }

    if (type) filter.type = type
    if (guests) filter.maxGuests = { $gte: Number(guests) }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (city && city.trim()) {
      filter.city = { $regex: new RegExp(city.trim(), 'i') }
    }

    const rooms = await Room.find(filter).sort({ rating: -1 })
    res.json({ success: true, rooms, total: rooms.length })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/rooms/:id
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' })
    res.json({ success: true, room })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/rooms
const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body)
    res.status(201).json({ success: true, room })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/rooms/:id
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' })
    res.json({ success: true, room })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/rooms/:id
const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Room deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/rooms/cities
const getCities = async (req, res) => {
  try {
    const cities = await Room.distinct('city')
    res.json({ success: true, cities })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/rooms/:id/review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const room = await Room.findById(req.params.id)
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' })

    room.reviews.push({
      userId: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    })

    const avg = room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length
    room.rating = Math.round(avg * 10) / 10

    await room.save()
    res.json({ success: true, message: 'Review added', room })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, getCities, addReview }