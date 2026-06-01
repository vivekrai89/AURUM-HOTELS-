import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../../slices/authSlice'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(s => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)

  // Clear stale error from previous page (e.g. "Registration failed" bleeding into Login)
  useEffect(() => {
    dispatch(clearError())
    return () => dispatch(clearError())
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}!`)
      navigate(result.payload.user.role === 'admin' ? '/admin' : '/')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl font-serif font-bold text-dark">AURUM</span>
            <span className="text-xs font-sans text-gold tracking-[0.2em] uppercase mt-1">Hotels</span>
          </Link>
          <h2 className="text-2xl font-serif font-bold text-dark">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your bookings</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
              <input type="email" required value={form.email} placeholder="you@example.com"
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password} placeholder="••••••••"
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account? <Link to="/register" className="text-gold font-medium hover:underline">Create one</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-xl text-xs text-gray-500 text-center">
            <strong>Admin demo:</strong> admin@aurum.com / admin123
          </div>
        </div>
      </div>
    </div>
  )
}
