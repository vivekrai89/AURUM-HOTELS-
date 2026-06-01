import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRoomById } from '../../slices/roomSlice'
import { FiUsers, FiMaximize, FiStar, FiWifi, FiWind, FiCheck, FiArrowLeft, FiMapPin, FiNavigation } from 'react-icons/fi'

export default function RoomDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { room, loading } = useSelector(s => s.rooms)
  const { token } = useSelector(s => s.auth)

  const [activeImg, setActiveImg] = useState(0)
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' })
  const [guests, setGuests] = useState(1)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => { dispatch(fetchRoomById(id)) }, [id])

  // Load Leaflet CSS dynamically
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
  }, [])

  // Initialize Leaflet map when room loads
  useEffect(() => {
    if (!room?.location?.lat) return

    const initMap = () => {
      if (window.L && document.getElementById('hotel-map')) {
        // Remove old map if exists
        const container = document.getElementById('hotel-map')
        if (container._leaflet_id) return

        const map = window.L.map('hotel-map').setView([room.location.lat, room.location.lng], 15)

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        // Custom gold marker
        const icon = window.L.divIcon({
          html: `<div style="background:#C8841A;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
                   <span style="transform:rotate(45deg);font-size:16px;">🏨</span>
                 </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          className: ''
        })

        window.L.marker([room.location.lat, room.location.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>Aurum Hotels</b><br/>${room.location.address}`)
          .openPopup()

        setMapLoaded(true)
      }
    }

    if (window.L) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    }
  }, [room])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!room) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🏨</p>
        <h3 className="text-xl font-serif">Room not found</h3>
        <button onClick={() => navigate('/rooms')} className="btn-primary mt-4">Back to Rooms</button>
      </div>
    </div>
  )

  const nights = dates.checkIn && dates.checkOut
    ? Math.ceil((new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24))
    : 0

  const handleBook = () => {
    if (!token) { navigate('/login'); return }
    if (!dates.checkIn || !dates.checkOut) { alert('Please select check-in and check-out dates'); return }
    navigate(`/booking/${room._id}?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}&guests=${guests}`)
  }

  const featureIcons = {
    wifi: { label: 'Free WiFi', icon: '📶' },
    ac: { label: 'Air Conditioning', icon: '❄️' },
    tv: { label: 'Smart TV', icon: '📺' },
    minibar: { label: 'Minibar', icon: '🍹' },
    balcony: { label: 'Balcony', icon: '🌅' },
    jacuzzi: { label: 'Jacuzzi', icon: '🛁' },
    pool: { label: 'Pool Access', icon: '🏊' },
    breakfast: { label: 'Breakfast Included', icon: '☕' },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/rooms')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold mb-6 transition-colors">
          <FiArrowLeft size={16} /> Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="card mb-6">
              <div className="relative h-96 overflow-hidden">
                <img src={room.images?.[activeImg] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}
                  alt={room.name} className="w-full h-full object-cover transition-all duration-500"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' }} />
                <div className="absolute top-4 left-4">
                  <span className="badge bg-gold text-white">{room.type}</span>
                </div>
                {room.city && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full">
                    <FiMapPin size={12} className="text-gold" /> {room.location?.name || room.city}
                  </div>
                )}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-3 py-1.5">
                  <FiStar size={14} className="text-gold" />
                  <span className="text-sm font-semibold">{room.rating}</span>
                </div>
              </div>
              {room.images?.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {room.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${i === activeImg ? 'border-gold' : 'border-transparent'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="card p-6 mb-6">
              <h1 className="text-3xl font-serif font-bold text-dark mb-2">{room.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1.5"><FiUsers size={14} /> Up to {room.maxGuests} guests</span>
                <span className="flex items-center gap-1.5"><FiMaximize size={14} /> {room.size} sq ft</span>
                <span className="flex items-center gap-1.5">🏢 Floor {room.floor}</span>
                {room.city && <span className="flex items-center gap-1.5"><FiMapPin size={14} className="text-gold" /> {room.location?.name || room.city}</span>}
              </div>
              <p className="text-gray-600 leading-relaxed">{room.description}</p>
            </div>

            {/* Features */}
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-serif font-semibold text-dark mb-4">Room Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(room.features || {}).filter(([, v]) => v).map(([key]) => (
                  <div key={key} className="flex items-center gap-2 bg-gold/5 rounded-lg p-3 border border-gold/20">
                    <span>{featureIcons[key]?.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{featureIcons[key]?.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-serif font-semibold text-dark mb-4">All Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {room.amenities?.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCheck size={14} className="text-gold shrink-0" /> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Location Section */}
            {room.location?.lat && (
              <div className="card p-6 mb-6">
                <h3 className="text-xl font-serif font-semibold text-dark mb-2">Location</h3>
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                  <FiMapPin size={16} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-dark">Aurum Hotels, {room.location.name}</p>
                    <p className="text-gray-500">{room.location.address}</p>
                  </div>
                </div>

                {/* Map */}
                <div id="hotel-map" className="w-full h-72 rounded-xl overflow-hidden border border-gray-100 bg-gray-100 mb-4"
                  style={{ zIndex: 0 }}>
                  {!mapLoaded && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-sm">Loading map...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nearby Landmarks */}
                {room.location.landmarks?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <FiNavigation size={14} className="text-gold" /> Nearby Landmarks
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {room.location.landmarks.map((lm, i) => (
                        <span key={i} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                          📍 {lm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Google Maps Link */}
                <a href={`https://www.google.com/maps?q=${room.location.lat},${room.location.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gold hover:underline mt-3">
                  <FiMapPin size={14} /> Open in Google Maps →
                </a>
              </div>
            )}

            {/* Reviews */}
            {room.reviews?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-xl font-serif font-semibold text-dark mb-4">Guest Reviews</h3>
                <div className="space-y-4">
                  {room.reviews.slice(0, 5).map((r, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-dark">{r.userName}</span>
                        <div className="flex items-center gap-1">
                          <FiStar size={12} className="text-gold" />
                          <span className="text-xs text-gray-500">{r.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <span className="text-4xl font-serif font-bold text-dark">₹{room.price?.toLocaleString()}</span>
                <span className="text-gray-400 text-sm ml-1">/night</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Check In</label>
                  <input type="date" value={dates.checkIn} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setDates(d => ({ ...d, checkIn: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Check Out</label>
                  <input type="date" value={dates.checkOut} min={dates.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => setDates(d => ({ ...d, checkOut: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Guests</label>
                  <select value={guests} onChange={e => setGuests(e.target.value)} className="input-field">
                    {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {nights > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>₹{room.price?.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>₹{(room.price * nights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & fees (18%)</span>
                    <span>₹{Math.round(room.price * nights * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-dark">
                    <span>Total</span>
                    <span>₹{Math.round(room.price * nights * 1.18).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button onClick={handleBook} className="btn-primary w-full text-center">
                {token ? 'Book Now' : 'Login to Book'}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">Free cancellation up to 24 hours before check-in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}