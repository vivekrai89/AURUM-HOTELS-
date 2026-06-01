const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bookingId: { type: DataTypes.STRING(20), unique: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  roomId: { type: DataTypes.STRING(50), allowNull: false }, // MongoDB room _id
  roomType: { type: DataTypes.STRING(100) },
  checkIn: { type: DataTypes.DATEONLY, allowNull: false },
  checkOut: { type: DataTypes.DATEONLY, allowNull: false },
  guests: { type: DataTypes.INTEGER, defaultValue: 1 },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'), defaultValue: 'pending' },
  specialRequests: { type: DataTypes.TEXT },
}, { tableName: 'bookings', timestamps: true });

module.exports = Booking;
