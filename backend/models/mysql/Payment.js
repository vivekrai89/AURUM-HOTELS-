const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  razorpayOrderId: { type: DataTypes.STRING(100) },
  razorpayPaymentId: { type: DataTypes.STRING(100) },
  razorpaySignature: { type: DataTypes.STRING(255) },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency: { type: DataTypes.STRING(5), defaultValue: 'INR' },
  status: { type: DataTypes.ENUM('created', 'paid', 'failed', 'refunded'), defaultValue: 'created' },
}, { tableName: 'payments', timestamps: true });

module.exports = Payment;
