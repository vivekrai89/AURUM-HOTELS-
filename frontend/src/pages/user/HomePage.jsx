import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRooms } from '../../slices/roomSlice'
import RoomCard from '../../components/user/RoomCard'
import { FiSearch, FiCalendar, FiUsers, FiAward, FiShield, FiCoffee, FiWifi, FiMapPin } from 'react-icons/fi'
import { MdOutlinePool, MdOutlineSpa } from 'react-icons/md'

const POPULAR_CITIES = ['Delhi', 'Mumbai', 'Goa', 'Bangalore', 'Jaipur']

export default function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { rooms, loading } = useSelector(s => s.rooms)
  const [search, setSearch] = useState({ city: '', checkIn: '', checkOut: '', guests: 1, type: '' })
  const [citySuggestions, setCitySuggestions] = useState([])

  useEffect(() => { dispatch(fetchRooms()) }, [])

  const handleCityInput = (val) => {
    setSearch(s => ({ ...s, city: val }))
    if (val.trim().length > 0) {
      const filtered = POPULAR_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase()))
      setCitySuggestions(filtered)
    } else {
      setCitySuggestions([])
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.city) params.set('city', search.city)
    if (search.checkIn) params.set('checkIn', search.checkIn)
    if (search.checkOut) params.set('checkOut', search.checkOut)
    if (search.guests > 1) params.set('guests', search.guests)
    if (search.type) params.set('type', search.type)
    navigate(`/rooms?${params.toString()}`)
    setCitySuggestions([])
  }

  const amenities = [
    { icon: MdOutlinePool, label: 'Infinity Pool' },
    { icon: MdOutlineSpa, label: 'Luxury Spa' },
    { icon: FiWifi, label: 'High-Speed WiFi' },
    { icon: FiCoffee, label: 'Fine Dining' },
    { icon: FiShield, label: '24/7 Security' },
    { icon: FiAward, label: 'Concierge Service' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 hero-gradient opacity-80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-gold tracking-[0.3em] text-sm uppercase font-sans mb-4 animate-fade-in">Welcome to Aurum Hotels</p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Where Luxury<br /><em>Meets Comfort</em>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-12 font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover luxury hotels across India's finest destinations. From Delhi to Goa, find your perfect stay.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-3 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">

              {/* City Search */}
              <div className="relative md:col-span-2">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 h-full">
                  <FiMapPin size={16} className="text-gold shrink-0" />
                  <input
                    type="text"
                    value={search.city}
                    onChange={e => handleCityInput(e.target.value)}
                    placeholder="Search city... (Delhi, Goa...)"
                    className="w-full py-3.5 text-sm bg-transparent focus:outline-none text-gray-700"
                  />
                </div>
                {/* Suggestions dropdown */}
                {citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg mt-1 z-50 overflow-hidden">
                    {citySuggestions.map(city => (
                      <button key={city} type="button"
                        onClick={() => { setSearch(s => ({ ...s, city })); setCitySuggestions([]) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gold/10 hover:text-gold flex items-center gap-2">
                        <FiMapPin size={13} className="text-gold" /> {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Type */}
              <div className="md:col-span-1">
                <select value={search.type} onChange={e => setSearch({ ...search, type: e.target.value })}
                  className="w-full h-full px-4 py-3.5 text-sm text-gray-700 border-0 focus:outline-none rounded-xl bg-gray-50">
                  <option value="">All Types</option>
                  {['Standard', 'Deluxe', 'Suite', 'Presidential', 'Family'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Check In */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 md:col-span-1">
                <FiCalendar size={16} className="text-gray-400 shrink-0" />
                <input type="date" value={search.checkIn} onChange={e => setSearch({ ...search, checkIn: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full py-3.5 text-sm bg-transparent focus:outline-none text-gray-700" />
              </div>

              {/* Check Out */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 md:col-span-1">
                <FiCalendar size={16} className="text-gray-400 shrink-0" />
                <input type="date" value={search.checkOut} onChange={e => setSearch({ ...search, checkOut: e.target.value })}
                  min={search.checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full py-3.5 text-sm bg-transparent focus:outline-none text-gray-700" />
              </div>

              {/* Search Button */}
              <button type="submit" className="btn-primary flex items-center justify-center gap-2 md:col-span-1">
                <FiSearch size={16} /> Search
              </button>
            </div>
          </form>

          {/* Popular Cities */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap animate-fade-in">
            <span className="text-gray-400 text-sm">Popular:</span>
            {POPULAR_CITIES.map(city => (
              <button key={city} type="button"
                onClick={() => navigate(`/rooms?city=${city}`)}
                className="text-sm text-white/80 hover:text-gold border border-white/20 hover:border-gold px-3 py-1 rounded-full transition-all">
                📍 {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[['5', 'Cities'], ['15+', 'Luxury Rooms'], ['4.8★', 'Average Rating'], ['24/7', 'Concierge']].map(([num, label]) => (
              <div key={label}>
                <div className="text-3xl font-serif font-bold text-gold">{num}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-2">Our Accommodations</p>
            <h2 className="text-4xl font-serif font-bold text-dark">Featured Rooms & Suites</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.slice(0, 6).map(room => <RoomCard key={room._id} room={room} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <button onClick={() => navigate('/rooms')} className="btn-outline">View All Rooms →</button>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-2">What We Offer</p>
            <h2 className="text-4xl font-serif font-bold text-dark">World-Class Amenities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map(({ icon: Icon, label }) => (
              <div key={label} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-gold hover:shadow-gold transition-all duration-300 group">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold transition-colors">
                  <Icon size={22} className="text-gold group-hover:text-white transition-colors" />
                </div>
                <p className="text-sm font-medium text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif text-white mb-4">Ready for an Unforgettable Stay?</h2>
          <p className="text-gray-300 mb-8">Book directly for the best rates and exclusive perks.</p>
          <button onClick={() => navigate('/rooms')} className="gold-gradient text-white font-semibold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
            Explore All Rooms
          </button>
        </div>
      </section>
    </div>
  )
}