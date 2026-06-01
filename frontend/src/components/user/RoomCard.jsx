import { useNavigate } from 'react-router-dom'
import { FiUsers, FiMaximize, FiStar, FiWifi, FiWind } from 'react-icons/fi'

export default function RoomCard({ room }) {
  const navigate = useNavigate()

  const typeColors = {
    Standard: 'bg-gray-100 text-gray-600',
    Deluxe: 'bg-blue-50 text-blue-700',
    Suite: 'bg-purple-50 text-purple-700',
    Presidential: 'bg-amber-50 text-amber-700',
    Family: 'bg-green-50 text-green-700',
  }

  const handleNavigate = () => navigate(`/rooms/${room._id}`)

  return (
    <div className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image — clickable */}
      <div className="relative overflow-hidden h-56 cursor-pointer" onClick={handleNavigate}>
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' }}
        />
        <div className="absolute top-3 left-3">
          <span className={`badge ${typeColors[room.type] || 'bg-gray-100 text-gray-600'}`}>{room.type}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-2.5 py-1">
          <FiStar size={12} className="text-gold fill-gold" />
          <span className="text-xs font-semibold text-gray-800">{room.rating}</span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-semibold bg-black/40 px-4 py-2 rounded-full">View Room</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 onClick={handleNavigate} className="font-serif text-lg font-semibold text-dark mb-1 cursor-pointer hover:text-gold transition-colors">{room.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{room.description}</p>

        {/* Features */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><FiUsers size={13} /> {room.maxGuests} guests</span>
          <span className="flex items-center gap-1"><FiMaximize size={13} /> {room.size} sq ft</span>
          {room.features?.wifi && <span className="flex items-center gap-1"><FiWifi size={13} /> WiFi</span>}
          {room.features?.ac && <span className="flex items-center gap-1"><FiWind size={13} /> AC</span>}
        </div>

        {/* Amenities preview */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {room.amenities?.slice(0, 3).map((a, i) => (
            <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">{a}</span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="text-xs text-gold font-medium">+{room.amenities.length - 3} more</span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-serif font-bold text-dark">₹{room.price.toLocaleString()}</span>
            <span className="text-xs text-gray-400 ml-1">/night</span>
          </div>
          <button onClick={handleNavigate} className="btn-primary text-sm py-2 px-4">View Room</button>
        </div>
      </div>
    </div>
  )
}