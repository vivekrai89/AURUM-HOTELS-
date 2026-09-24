const { Sequelize } = require('sequelize');
require('dotenv').config();

const host = process.env.DB_HOST || 'localhost';
const isLocal = ['localhost', '127.0.0.1'].includes(host);

// Cloud MySQL (Aiven etc.) requires SSL. Set DB_SSL=false to turn it off.
const useSSL = process.env.DB_SSL ? process.env.DB_SSL === 'true' : !isLocal;

const sequelize = new Sequelize(
  process.env.DB_NAME || 'hotel_booking',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 20000,
      ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {})
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const RETRY_MS = 30000;

// Never crashes the server: if MySQL is down, log it and retry in the background.
// Rooms (MongoDB) keep working; login/bookings work again once MySQL is back.
const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected');

    await sequelize.sync({ alter: true });
    console.log('✅ MySQL tables synced');
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
    console.log(`🔁 Retrying MySQL in ${RETRY_MS / 1000}s...`);
    setTimeout(connectMySQL, RETRY_MS);
  }
};

module.exports = { sequelize, connectMySQL };
