const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
})

const locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  landmarks: [String]
}, { _id: false })

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Family'], required: true },
  city: { type: String, required: true },
  location: locationSchema,
  description: { type: String, required: true },
  price: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  size: Number,
  floor: Number,
  images: [String],
  amenities: [String],
  features: {
    wifi: Boolean, ac: Boolean, tv: Boolean,
    minibar: Boolean, balcony: Boolean,
    jacuzzi: Boolean, pool: Boolean, breakfast: Boolean
  },
  rating: { type: Number, default: 4.0 },
  reviews: [reviewSchema],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Room', roomSchema)