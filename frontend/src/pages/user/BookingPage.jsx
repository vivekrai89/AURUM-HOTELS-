import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRoomById } from '../../slices/roomSlice'
import { createBooking } from '../../slices/bookingSlice'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiCalendar, FiUsers } from 'react-icons/fi'

export default function BookingPage() {
  const { roomId } = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { room, loading: roomLoading } = useSelector(s => s.rooms)
  const { loading } = useSelector(s => s.bookings)
  const { user } = useSelector(s => s.auth)

  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = searchParams.get('guests') || 1

  const [form, setForm] = useState({ checkIn, checkOut, guests: Number(guests), specialRequests: '' })

  // Clear stale room and fetch fresh
  useEffect(() => {
    dispatch(fetchRoomById(roomId))
  }, [roomId, dispatch])

  const nights = form.checkIn && form.checkOut
    ? Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24))
    : 0

  const basePrice = (room && nights > 0) ? nights * room.price : 0
  const gstAmount = Math.round(basePrice * 0.18)
  const totalPrice = basePrice + gstAmount

  const handleSubmit = async () => {
    if (!form.checkIn || !form.checkOut) {
      toast.error('Please select check-in and check-out dates')
      return
    }
    if (nights <= 0) {
      toast.error('Check-out must be after check-in')
      return
    }
    if (!user) {
      toast.error('Please log in to make a booking')
      navigate('/login')
      return
    }

    const result = await dispatch(createBooking({
      roomId,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: Number(form.guests),
      specialRequests: form.specialRequests,
      totalPrice,
    }))

    if (createBooking.fulfilled.match(result)) {
      toast.success('Booking created! Proceed to payment.')
      navigate(`/payment/${result.payload.booking.id}`)
    } else {
      toast.error(result.payload || 'Booking failed. Please try again.')
    }
  }

  if (roomLoading || !room) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold mb-6 transition-colors">
          <FiArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl font-serif font-bold text-dark mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Guest Info */}
            <div className="card p-6">
              <h3 className="text-lg font-serif font-semibold text-dark mb-4">Guest Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input className="input-field bg-gray-50" value={user?.name || ''} readOnly />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                  <input className="input-field bg-gray-50" value={user?.email || ''} readOnly />
                </div>
              </div>
            </div>

            {/* Stay Dates */}
            <div className="card p-6">
              <h3 className="text-lg font-serif font-semibold text-dark mb-4">Stay Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    <FiCalendar size={12} className="inline mr-1" />Check In
                  </label>
                  <input
                    type="date"
                    value={form.checkIn}
                    min={today}
                    onChange={e => setForm(f => ({ ...f, checkIn: e.target.value, checkOut: f.checkOut && f.checkOut <= e.target.value ? '' : f.checkOut }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    <FiCalendar size={12} className="inline mr-1" />Check Out
                  </label>
                  <input
                    type="date"
                    value={form.checkOut}
                    min={form.checkIn || today}
                    onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    <FiUsers size={12} className="inline mr-1" />Guests
                  </label>
                  <select
                    value={form.guests}
                    onChange={e => setForm(f => ({ ...f, guests: Number(e.target.value) }))}
                    className="input-field"
                  >
                    {Array.from({ length: room.maxGuests || 4 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              {form.checkIn && form.checkOut && nights <= 0 && (
                <p className="text-xs text-red-500 mt-2">⚠ Check-out date must be after check-in date</p>
              )}
            </div>

            {/* Special Requests */}
            <div className="card p-6">
              <h3 className="text-lg font-serif font-semibold text-dark mb-4">Special Requests</h3>
              <textarea
                rows={4}
                value={form.specialRequests}
                placeholder="E.g. Early check-in, high floor, anniversary decoration..."
                onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))}
                className="input-field resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">Special requests are subject to availability</p>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-serif font-semibold text-dark mb-4">Booking Summary</h3>
              {room.images?.[0] && (
                <img src={room.images[0]} alt={room.name} className="w-full h-40 object-cover rounded-xl mb-4" />
              )}
              <h4 className="font-serif font-semibold text-dark">{room.name}</h4>
              <p className="text-sm text-gray-500 mb-4">{room.type} Room</p>

              <div className="space-y-2 text-sm border-t pt-4 mb-4">
                {form.checkIn && <div className="flex justify-between text-gray-600"><span>Check In</span><span className="font-medium">{form.checkIn}</span></div>}
                {form.checkOut && <div className="flex justify-between text-gray-600"><span>Check Out</span><span className="font-medium">{form.checkOut}</span></div>}
                {nights > 0 && <div className="flex justify-between text-gray-600"><span>Duration</span><span className="font-medium">{nights} night{nights > 1 ? 's' : ''}</span></div>}
              </div>

              {nights > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>₹{room.price?.toLocaleString()} × {nights} nights</span>
                    <span>₹{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-dark text-base">
                    <span>Total Payable</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || nights <= 0}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Booking...' : nights <= 0 ? 'Select Dates First' : 'Proceed to Payment →'}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">🔒 Secure booking via Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
