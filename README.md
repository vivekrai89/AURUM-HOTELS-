## Live Demo

🌐 https://aurumhotels.vercel.app

# 🏨 AURUM HOTELS — Full-Stack Hotel Booking App

A complete hotel booking platform built with React.js, Node.js, MySQL, MongoDB, and Razorpay. Features city-based hotel search across 5 Indian cities with interactive maps.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS + Redux Toolkit |
| Backend | Node.js + Express.js |
| Auth | JWT (JSON Web Tokens) |
| Database 1 | MySQL + Sequelize ORM (users, bookings, payments) |
| Database 2 | MongoDB + Mongoose (room content & inventory) |
| Payment | Razorpay |
| Maps | Leaflet.js (OpenStreetMap) |

---

## Features

### User Side
- 🏙️ City-based hotel search — Delhi, Mumbai, Goa, Bangalore, Jaipur
- 🔍 "No hotels available" message for unsupported cities with suggestions
- 🏠 Home page with hero, city search, featured rooms
- 🛏️ Room search with filters (city, type, date, guests, price)
- 🖼️ Room detail page with 5-image gallery (clickable thumbnails)
- 🗺️ Interactive Leaflet map with hotel pin and nearby landmarks
- 📅 Secure booking flow with date selection and price breakdown
- 💳 Razorpay payment integration (Demo + Live mode)
- ✅ Booking confirmation page
- 📋 My Bookings dashboard (view, cancel, pay pending)
- 🔐 Login / Register with JWT auth

### Admin Panel (/admin)
- 📊 Dashboard with revenue charts and stats (Recharts)
- 🛏️ Room management — Add, Edit, Delete rooms (MongoDB)
- 📋 Booking management — View all, update status
- 👥 User management — View all, activate/deactivate

---

## Project Structure

```
hotel-booking/
├── backend/
│   ├── config/
│   │   ├── mysql.js          # Sequelize connection
│   │   └── mongo.js          # Mongoose connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── room.controller.js
│   │   ├── booking.controller.js
│   │   ├── payment.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js  # JWT protect + adminOnly
│   ├── models/
│   │   ├── mysql/
│   │   │   ├── User.js
│   │   │   ├── Booking.js
│   │   │   └── Payment.js
│   │   └── mongo/
│   │       └── Room.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── room.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   └── admin.routes.js
│   ├── seeder.js             # Seeds 15 rooms across 5 cities into MongoDB
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/       # Navbar, Footer
    │   │   ├── user/         # RoomCard
    │   │   └── admin/        # AdminLayout
    │   ├── pages/
    │   │   ├── user/         # Home, Rooms, RoomDetail, Booking, Payment, Confirmation, MyBookings, Login, Register
    │   │   └── admin/        # Dashboard, Rooms, Bookings, Users
    │   ├── slices/           # Redux slices (auth, room, booking)
    │   ├── utils/            # Axios API instance
    │   ├── styles/           # Global CSS
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── store.js
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL (running locally)
- MongoDB (running locally)
- Razorpay test account (free at razorpay.com)

---

### Step 1: MySQL Database Setup

Open MySQL and run:
```sql
CREATE DATABASE hotel_booking;
```
Tables are auto-created by Sequelize on first run.

---

### Step 2: Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
JWT_SECRET=your_secret_key_here

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hotel_booking

MONGO_URI=mongodb://localhost:27017/hotel_booking_rooms

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

FRONTEND_URL=http://localhost:5173
```

Install and run:
```bash
npm install
npm run dev
```

Seed 15 rooms across 5 cities into MongoDB:
```bash
node seeder.js
```

---

### Step 3: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173  
Backend API runs at: http://localhost:5000

---

### Step 4: Create Admin User

After registering a user, open MySQL and run:
```sql
USE hotel_booking;
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Available Cities

| City | Area | Rooms |
|---|---|---|
| 🏙️ Delhi | Connaught Place | 3 rooms |
| 🌊 Mumbai | Bandra West | 3 rooms |
| 🏖️ Goa | Calangute Beach | 3 rooms |
| 🌿 Bangalore | Indiranagar | 3 rooms |
| 🏰 Jaipur | MI Road | 3 rooms |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/rooms | — | Get all rooms (filterable by city, type, price) |
| GET | /api/rooms/:id | — | Get room detail |
| POST | /api/rooms | Admin | Create room |
| PUT | /api/rooms/:id | Admin | Update room |
| DELETE | /api/rooms/:id | Admin | Delete room |
| POST | /api/rooms/:id/review | ✅ | Add review |
| POST | /api/bookings | ✅ | Create booking |
| GET | /api/bookings/my | ✅ | My bookings |
| PUT | /api/bookings/:id/cancel | ✅ | Cancel booking |
| POST | /api/payments/create-order | ✅ | Create Razorpay order |
| POST | /api/payments/verify | ✅ | Verify payment |
| GET | /api/admin/dashboard | Admin | Dashboard stats |
| GET | /api/admin/bookings | Admin | All bookings |
| PUT | /api/admin/bookings/:id/status | Admin | Update status |
| GET | /api/admin/users | Admin | All users |
| PUT | /api/admin/users/:id/toggle | Admin | Toggle user status |

---

## Razorpay Test Cards

Use these in test mode:
- **Card:** 4111 1111 1111 1111  
- **Expiry:** Any future date  
- **CVV:** Any 3 digits  
- **OTP:** 123456

---

## Built with ❤️ by Vivek Rai
Portfolio: https://portfolio-vivekrai.vercel.app/  
GitHub: https://github.com/vivekrai89
