import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../../slices/authSlice'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(s => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPw, setShowPw] = useState(false)

  // Clear stale error from previous page (e.g. login error bleeding into register)
  useEffect(() => {
    dispatch(clearError())
    return () => dispatch(clearError())
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!')
      navigate('/')
    } else {
      toast.error(result.payload || 'Registration failed')
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
          <h2 className="text-2xl font-serif font-bold text-dark">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Join Aurum Hotels for exclusive benefits</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input type="text" required value={form.name} placeholder="John Doe"
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
              <input type="email" required value={form.email} placeholder="you@example.com"
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
              <input type="tel" value={form.phone} placeholder="+91 98765 43210"
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password} placeholder="Min 6 characters"
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-gold font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
