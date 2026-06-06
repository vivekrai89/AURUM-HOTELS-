import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './slices/authSlice'

// User Pages
import HomePage from './pages/user/HomePage'
import RoomsPage from './pages/user/RoomsPage'
import RoomDetailPage from './pages/user/RoomDetailPage'
import BookingPage from './pages/user/BookingPage'
import PaymentPage from './pages/user/PaymentPage'
import ConfirmationPage from './pages/user/ConfirmationPage'
import MyBookingsPage from './pages/user/MyBookingsPage'
import LoginPage from './pages/user/LoginPage'
import RegisterPage from './pages/user/RegisterPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRooms from './pages/admin/AdminRooms'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'

// Layout
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import AdminLayout from './components/admin/AdminLayout'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(s => s.auth)
  return token ? children : <Navigate to="/login" />
}

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useSelector(s => s.auth)
  if (!token) return <Navigate to="/login" />
  if (loading || (!user && token)) return null
  if (user && user.role !== 'admin') return <Navigate to="/" />
  return children
}

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 text-xl"
      title="Back to top"
    >
      ↑
    </button>
  )
}

const UserLayout = () => (
  <>
    <ScrollToTop />
    <Navbar />
    <Outlet />
    <Footer />
    <BackToTopButton />
  </>
)

export default function App() {
  const dispatch = useDispatch()
  const { token } = useSelector(s => s.auth)

  useEffect(() => {
    if (token) dispatch(getMe())
  }, [token])

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* User routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking/:roomId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/payment/:bookingId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}