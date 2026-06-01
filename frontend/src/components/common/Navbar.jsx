import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../slices/authSlice'
import { FiMenu, FiX, FiLogOut, FiCalendar, FiSettings } from 'react-icons/fi'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const { user, token } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setDropOpen(false)
  }

  const handleAmenities = (e) => {
    e.preventDefault()
    setOpen(false)
    if (window.location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleHome = () => {
    setOpen(false)
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" onClick={handleHome} className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-dark">AURUM</span>
            <span className="text-xs font-sans text-gold tracking-[0.2em] uppercase mt-1">Hotels</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={handleHome} className="text-sm font-medium text-gray-600 hover:text-gold transition-colors">Home</button>
            <Link to="/rooms" className="text-sm font-medium text-gray-600 hover:text-gold transition-colors">Rooms</Link>
            <a href="#amenities" onClick={handleAmenities} className="text-sm font-medium text-gray-600 hover:text-gold transition-colors cursor-pointer">Amenities</a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-gold transition-colors">Contact</a>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-4">
            {token && user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gold transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name?.split(' ')[0]}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-card border border-gray-100 py-2 z-50">
                    <Link to="/my-bookings" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <FiCalendar size={16} /> My Bookings
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <FiSettings size={16} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <FiLogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gold transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Book Now</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-600">
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <button onClick={handleHome} className="block text-sm font-medium text-gray-700 py-2">Home</button>
          <Link to="/rooms" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Rooms</Link>
          <a href="#amenities" onClick={handleAmenities} className="block text-sm font-medium text-gray-700 py-2 cursor-pointer">Amenities</a>
          {token && user ? (
            <>
              <Link to="/my-bookings" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 py-2">My Bookings</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Admin Panel</Link>}
              <button onClick={handleLogout} className="block text-sm font-medium text-red-600 py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Sign In</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary block text-center text-sm py-2">Book Now</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}