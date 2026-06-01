import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRooms } from '../../slices/roomSlice'
import RoomCard from '../../components/user/RoomCard'
import { FiSearch, FiFilter, FiMapPin, FiX } from 'react-icons/fi'

const POPULAR_CITIES = ['Delhi', 'Mumbai', 'Goa', 'Bangalore', 'Jaipur']

export default function RoomsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { rooms, loading } = useSelector(s => s.rooms)

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: '', maxPrice: '',
    guests: searchParams.get('guests') || '',
  })
  const [cityInput, setCityInput] = useState(searchParams.get('city') || '')
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const params = {}
    if (filters.city) params.city = filters.city
    if (filters.type) params.type = filters.type
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.guests) params.guests = filters.guests
    dispatch(fetchRooms(params))
  }, [filters])

  const handleCityInput = (val) => {
    setCityInput(val)
    setShowSuggestions(val.trim().length > 0)
  }

  const applyCity = (city) => {
    setCityInput(city)
    setFilters(f => ({ ...f, city }))
    setShowSuggestions(false)
  }

  const clearCity = () => {
    setCityInput('')
    setFilters(f => ({ ...f, city: '' }))
  }

  const filteredSuggestions = POPULAR_CITIES.filter(c =>
    c.toLowerCase().includes(cityInput.toLowerCase())
  )

  const searchedCity = filters.city

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold mb-2">Find Your Perfect Room</h1>
          <p className="text-gray-400">Luxury stays across India's finest destinations</p>

          {/* City Search Bar */}
          <div className="relative max-w-lg mt-6">
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 gap-3">
              <FiMapPin size={18} className="text-gold shrink-0" />
              <input
                type="text"
                value={cityInput}
                onChange={e => handleCityInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') applyCity(cityInput) }}
                placeholder="Search by city (Delhi, Mumbai, Goa...)"
                className="flex-1 py-3.5 bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
              />
              {cityInput && (
                <button onClick={clearCity} className="text-gray-400 hover:text-white">
                  <FiX size={16} />
                </button>
              )}
              <button onClick={() => applyCity(cityInput)} className="text-gold hover:text-white transition-colors">
                <FiSearch size={18} />
              </button>
            </div>

            {/* Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl mt-1 z-50 overflow-hidden">
                {filteredSuggestions.map(city => (
                  <button key={city} onClick={() => applyCity(city)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gold/10 hover:text-gold flex items-center gap-2 border-b border-gray-50 last:border-0">
                    <FiMapPin size={14} className="text-gold" /> {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Cities */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {POPULAR_CITIES.map(city => (
              <button key={city} onClick={() => applyCity(city)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filters.city === city ? 'bg-gold text-white border-gold' : 'border-white/20 text-gray-300 hover:border-gold hover:text-gold'}`}>
                📍 {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <FiFilter size={16} className="text-gray-500" />
          <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
            className="input-field py-2 px-3 text-sm w-auto">
            <option value="">All Types</option>
            {['Standard', 'Deluxe', 'Suite', 'Presidential', 'Family'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input type="number" placeholder="Min ₹" value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="input-field py-2 px-3 text-sm w-28" />
          <input type="number" placeholder="Max ₹" value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="input-field py-2 px-3 text-sm w-28" />
          <input type="number" placeholder="Guests" min={1} value={filters.guests}
            onChange={e => setFilters(f => ({ ...f, guests: e.target.value }))}
            className="input-field py-2 px-3 text-sm w-24" />
          {(filters.city || filters.type || filters.minPrice || filters.maxPrice || filters.guests) && (
            <button onClick={() => { setFilters({ city: '', type: '', minPrice: '', maxPrice: '', guests: '' }); setCityInput('') }}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
              <FiX size={14} /> Clear All
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : rooms.length === 0 ? (
          // No rooms found message
          <div className="text-center py-24">
            <p className="text-6xl mb-6">🏨</p>
            <h3 className="text-2xl font-serif font-bold text-dark mb-3">
              {searchedCity
                ? `No hotels available in "${searchedCity}"`
                : 'No rooms found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchedCity
                ? `We're expanding soon! Currently available in:`
                : 'Try adjusting your filters'}
            </p>
            {searchedCity && (
              <div className="flex gap-3 justify-center flex-wrap mb-8">
                {POPULAR_CITIES.map(city => (
                  <button key={city} onClick={() => applyCity(city)}
                    className="btn-outline text-sm py-2 px-4">
                    📍 {city}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => { setFilters({ city: '', type: '', minPrice: '', maxPrice: '', guests: '' }); setCityInput('') }}
              className="btn-primary">
              View All Rooms
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {filters.city
                ? `${rooms.length} room${rooms.length > 1 ? 's' : ''} found in ${filters.city}`
                : `${rooms.length} rooms found`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map(room => <RoomCard key={room._id} room={room} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}