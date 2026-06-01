import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiCheck, FiCalendar, FiUsers } from 'react-icons/fi'

export default function ConfirmationPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const booking = state?.booking

  useEffect(() => {
    if (!booking) {
      navigate('/my-bookings', { replace: true })
    }
  }, [booking, navigate])

  if (!booking) return null

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-fade-in">
          <FiCheck size={40} className="text-green-600" strokeWidth={3} />
        </div>

        <h1 className="text-4xl font-serif font-bold text-dark mb-2 animate-fade-in">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8 animate-fade-in">Your reservation has been successfully placed. We look forward to welcoming you!</p>

        {/* Confirmation Card */}
        <div className="card p-8 text-left mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Booking ID</p>
              <p className="text-xl font-serif font-bold text-gold">{booking.bookingId}</p>
            </div>
            <span className="badge status-confirmed text-sm px-4 py-2">Confirmed</span>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <FiCalendar size={11} /> Check In
              </p>
              <p className="font-semibold text-dark">{booking.checkIn}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <FiCalendar size={11} /> Check Out
              </p>
              <p className="font-semibold text-dark">{booking.checkOut}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Room Type</p>
              <p className="font-semibold text-dark">{booking.roomType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <FiUsers size={11} /> Guests
              </p>
              <p className="font-semibold text-dark">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-6 pt-6 flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Paid</span>
            <span className="text-2xl font-serif font-bold text-gold">₹{Number(booking.totalPrice).toLocaleString()}</span>
          </div>
        </div>

        {/* Hotel Info */}
        <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 text-left mb-8 animate-fade-in">
          <p className="font-semibold text-dark mb-2">📍 Aurum Hotels</p>
          <p className="text-sm text-gray-600">123 Luxury Lane, Connaught Place, New Delhi 110001</p>
          <p className="text-sm text-gray-600 mt-1">📞 +91 98765 43210</p>
          <p className="text-sm text-gray-500 mt-3 text-xs">Please carry a valid photo ID at check-in. Check-in time: 2:00 PM | Check-out: 11:00 AM</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 animate-fade-in">
          <button onClick={() => navigate('/my-bookings')} className="btn-outline flex-1">View My Bookings</button>
          <button onClick={() => navigate('/rooms')} className="btn-primary flex-1">Book Another Room</button>
        </div>
      </div>
    </div>
  )
}
