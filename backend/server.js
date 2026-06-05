const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectMySQL } = require('./config/mysql');
const { connectMongo } = require('./config/mongo');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://aurum-hotels-livid.vercel.app',
    'https://aurum-hotels-frontend.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/rooms', require('./routes/room.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.get('/', (req, res) => res.json({ message: 'Hotel Booking API Running 🏨' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectMySQL();
  await connectMongo();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
