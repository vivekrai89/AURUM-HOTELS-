import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = () => {
    api.get('/admin/bookings').then(res => setBookings(res.data.bookings)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/bookings/${id}/status`, { status })
      toast.success(`Booking marked as ${status}`)
      load()
    } catch { toast.error('Failed to update status') }
  }

  const statuses = ['all', 'pending', 'confirmed', 'cancelled', 'completed']
  const statusClass = { pending: 'status-pending', confirmed: 'status-confirmed', cancelled: 'status-cancelled', completed: 'status-completed' }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-dark">Bookings</h1>
        <p className="text-sm text-gray-500 mt-0.5">{bookings.length} total bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${filter === s ? 'bg-gold text-white border-gold' : 'border-gray-200 text-gray-600 hover:border-gold hover:text-gold'}`}>
            {s} {s === 'all' ? `(${bookings.length})` : `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {['Booking ID', 'User', 'Room', 'Check In', 'Check Out', 'Guests', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No bookings found</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gold">{b.bookingId}</td>
                  <td className="px-5 py-4 text-gray-600">{b.userId}</td>
                  <td className="px-5 py-4 font-medium text-dark whitespace-nowrap">{b.roomType}</td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{b.checkIn}</td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{b.checkOut}</td>
                  <td className="px-5 py-4 text-gray-600">{b.guests}</td>
                  <td className="px-5 py-4 font-semibold whitespace-nowrap">₹{Number(b.totalPrice).toLocaleString()}</td>
                  <td className="px-5 py-4"><span className={`badge ${statusClass[b.status]}`}>{b.status}</span></td>
                  <td className="px-5 py-4">
                    <select value={b.status}
                      onChange={e => updateStatus(b.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold bg-white">
                      {['pending','confirmed','cancelled','completed'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
