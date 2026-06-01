import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi'

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setData(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const { stats, monthlyRevenue, recentBookings } = data || {}

  const chartData = monthlyRevenue?.map(m => ({
    month: months[m.month - 1],
    revenue: Number(m.revenue),
    bookings: Number(m.count),
  })) || []

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: FiUsers, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Bookings', value: stats?.totalBookings, icon: FiCalendar, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Revenue', value: `₹${Number(stats?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Confirmed', value: stats?.confirmedBookings, icon: FiTrendingUp, color: 'bg-gold/10 text-gold' },
  ]

  const statusClass = { pending: 'status-pending', confirmed: 'status-confirmed', cancelled: 'status-cancelled', completed: 'status-completed' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-dark">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-serif font-bold text-dark">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Booking Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: stats?.pendingBookings, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Confirmed', value: stats?.confirmedBookings, color: 'text-green-600 bg-green-50' },
          { label: 'Cancelled', value: stats?.cancelledBookings, color: 'text-red-600 bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-serif font-semibold text-dark mb-4">Monthly Revenue (₹)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#C8841A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-16">No revenue data yet</p>}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-serif font-semibold text-dark mb-4">Monthly Bookings</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#C8841A" strokeWidth={2} dot={{ fill: '#C8841A', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-16">No booking data yet</p>}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-serif font-semibold text-dark">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {['Booking ID', 'User ID', 'Room Type', 'Check In', 'Check Out', 'Amount', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings?.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gold">{b.bookingId}</td>
                  <td className="px-6 py-4 text-gray-600">{b.userId}</td>
                  <td className="px-6 py-4 font-medium text-dark">{b.roomType}</td>
                  <td className="px-6 py-4 text-gray-600">{b.checkIn}</td>
                  <td className="px-6 py-4 text-gray-600">{b.checkOut}</td>
                  <td className="px-6 py-4 font-semibold">₹{Number(b.totalPrice).toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`badge ${statusClass[b.status]}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!recentBookings?.length && <p className="text-center text-gray-400 py-12">No bookings yet</p>}
        </div>
      </div>
    </div>
  )
}
