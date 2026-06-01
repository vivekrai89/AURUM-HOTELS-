import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiShield, FiArrowLeft } from 'react-icons/fi'

export default function PaymentPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    api.get(`/bookings/${bookingId}`)
      .then(res => setBooking(res.data.booking))
      .catch(() => toast.error('Booking not found'))
      .finally(() => setLoading(false))
  }, [bookingId])

  const handlePayment = async () => {
    setPaying(true)
    try {
      const { data } = await api.post('/payments/create-order', { bookingId: booking.id })
      const { order, paymentId, key, demoMode } = data

      // Demo mode: no real Razorpay key configured
      if (demoMode) {
        // Simulate payment verification directly
        try {
          await api.post('/payments/verify', {
            razorpay_order_id: order.id,
            razorpay_payment_id: 'DEMO_PAY_' + Date.now(),
            razorpay_signature: 'DEMO_SIG',
            bookingId: booking.id,
            paymentId,
          })
          toast.success('Payment successful! 🎉 (Demo Mode)')
          // Refresh booking to get confirmed status
          const updated = await api.get(`/bookings/${bookingId}`)
          navigate('/confirmation', { state: { booking: updated.data.booking } })
        } catch {
          toast.error('Payment verification failed')
          setPaying(false)
        }
        return
      }

      // Real Razorpay flow
      if (!window.Razorpay) {
        toast.error('Razorpay SDK not loaded. Check your internet connection.')
        setPaying(false)
        return
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Aurum Hotels',
        description: `Booking #${booking.bookingId}`,
        order_id: order.id,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#C8841A' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.id,
              paymentId,
            })
            toast.success('Payment successful! 🎉')
            const updated = await api.get(`/bookings/${bookingId}`)
            navigate('/confirmation', { state: { booking: updated.data.booking } })
          } catch {
            toast.error('Payment verification failed')
            setPaying(false)
          }
        },
        modal: { ondismiss: () => { setPaying(false); toast.error('Payment cancelled') } }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed')
      setPaying(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">❌</p>
        <h3 className="text-xl font-serif">Booking not found</h3>
        <button onClick={() => navigate('/my-bookings')} className="btn-primary mt-4">My Bookings</button>
      </div>
    </div>
  )

  const isAlreadyPaid = booking.status === 'confirmed' || booking.status === 'completed'

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-lg mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold mb-6 transition-colors">
          <FiArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl font-serif font-bold text-dark mb-8">Payment</h1>

        <div className="card p-8">
          {/* Booking Summary */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏨</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-dark">{booking.roomType} Room</h3>
            <p className="text-sm text-gray-500 mt-1">Booking ID: {booking.bookingId}</p>
          </div>

          <div className="space-y-3 text-sm border-y border-gray-100 py-6 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Check In</span><span className="font-medium">{booking.checkIn}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Check Out</span><span className="font-medium">{booking.checkOut}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Guests</span><span className="font-medium">{booking.guests}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Status</span>
              <span className={`badge status-${booking.status}`}>{booking.status}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-dark border-t pt-3 mt-1">
              <span>Total Amount</span>
              <span className="text-gold">₹{Number(booking.totalPrice).toLocaleString()}</span>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Special Requests</p>
              <p className="text-sm text-gray-600">{booking.specialRequests}</p>
            </div>
          )}

          {isAlreadyPaid ? (
            <div className="text-center py-4">
              <p className="text-green-600 font-semibold mb-4">✅ This booking is already confirmed!</p>
              <button onClick={() => navigate('/confirmation', { state: { booking } })} className="btn-primary w-full">
                View Confirmation
              </button>
            </div>
          ) : (
            <button onClick={handlePayment} disabled={paying}
              className="btn-primary w-full text-center text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed">
              {paying ? 'Processing Payment...' : `Pay ₹${Number(booking.totalPrice).toLocaleString()}`}
            </button>
          )}

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <FiShield size={14} className="text-green-500" />
            <span>Secured by Razorpay. Your payment info is encrypted.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
