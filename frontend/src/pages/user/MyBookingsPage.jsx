import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyBookings, cancelBooking } from '../../slices/bookingSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiCalendar, FiUsers } from 'react-icons/fi'

export default function MyBookingsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { bookings, loading } = useSelector(s => s.bookings)

  useEffect(() => { dispatch(fetchMyBookings()) }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    const result = await dispatch(cancelBooking(id))
    if (cancelBooking.fulfilled.match(result)) toast.success('Booking cancelled')
    else toast.error('Failed to cancel booking')
  }

  const statusClass = { pending: 'status-pending', confirmed: 'status-confirmed', cancelled: 'status-cancelled', completed: 'status-completed' }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-dark mb-8">My Bookings</h1>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-36 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-5xl mb-4">🏨</p>
            <h3 className="text-xl font-serif text-dark mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Your upcoming stays will appear here</p>
            <button onClick={() => navigate('/rooms')} className="btn-primary">Browse Rooms</button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-serif font-semibold text-dark text-lg">{booking.roomType} Room</h3>
                      <span className={`badge ${statusClass[booking.status]}`}>{booking.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar size={13} className="text-gold" />
                        {booking.checkIn} → {booking.checkOut}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiUsers size={13} className="text-gold" />
                        {booking.guests} Guest{booking.guests > 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-400">ID: {booking.bookingId}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3">
                    <span className="text-2xl font-serif font-bold text-gold">₹{Number(booking.totalPrice).toLocaleString()}</span>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <button onClick={() => navigate(`/payment/${booking.id}`)}
                          className="btn-primary text-sm py-1.5 px-4">Pay Now</button>
                      )}
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <button onClick={() => handleCancel(booking.id)}
                          className="text-sm border border-red-200 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
