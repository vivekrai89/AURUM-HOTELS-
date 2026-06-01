import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'

const emptyRoom = { name: '', type: 'Standard', description: '', price: '', maxGuests: 2, size: '', floor: '', amenities: '', images: '', isAvailable: true }

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyRoom)
  const [saving, setSaving] = useState(false)

  const load = () => {
    api.get('/rooms').then(res => setRooms(res.data.rooms)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(emptyRoom); setEditing(null); setShowModal(true) }
  const openEdit = (room) => {
    setForm({ ...room, amenities: room.amenities?.join(', '), images: room.images?.join(', ') })
    setEditing(room._id)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setSaving(true)
    const payload = {
      ...form,
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
      size: Number(form.size),
      floor: Number(form.floor),
      amenities: form.amenities?.split(',').map(a => a.trim()).filter(Boolean),
      images: form.images?.split(',').map(i => i.trim()).filter(Boolean),
    }
    try {
      if (editing) {
        await api.put(`/rooms/${editing}`, payload)
        toast.success('Room updated')
      } else {
        await api.post('/rooms', payload)
        toast.success('Room created')
      }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save room')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await api.delete(`/rooms/${id}`)
      toast.success('Room deleted')
      load()
    } catch { toast.error('Failed to delete room') }
  }

  const typeColors = { Standard: 'bg-gray-100 text-gray-600', Deluxe: 'bg-blue-50 text-blue-700', Suite: 'bg-purple-50 text-purple-700', Presidential: 'bg-amber-50 text-amber-700', Family: 'bg-green-50 text-green-700' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-dark">Rooms</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rooms.length} rooms in inventory</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> Add Room
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  {['Room', 'Type', 'Price', 'Guests', 'Rating', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rooms.map(room => (
                  <tr key={room._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={room.images?.[0]} alt={room.name} className="w-12 h-9 rounded-lg object-cover" />
                        <span className="font-medium text-dark">{room.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`badge ${typeColors[room.type]}`}>{room.type}</span></td>
                    <td className="px-6 py-4 font-semibold">₹{room.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">Up to {room.maxGuests}</td>
                    <td className="px-6 py-4 text-gray-600">⭐ {room.rating}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {room.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(room)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 size={15} /></button>
                        <button onClick={() => handleDelete(room._id, room.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-serif font-semibold text-dark">{editing ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Room Name</label>
                  <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Deluxe Garden View" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Type</label>
                  <select className="input-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {['Standard','Deluxe','Suite','Presidential','Family'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Price (₹/night)</label>
                  <input type="number" className="input-field" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Max Guests</label>
                  <input type="number" className="input-field" value={form.maxGuests} onChange={e => setForm(f => ({ ...f, maxGuests: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Size (sq ft)</label>
                  <input type="number" className="input-field" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Floor</label>
                  <input type="number" className="input-field" value={form.floor} onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Availability</label>
                  <select className="input-field" value={form.isAvailable} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.value === 'true' }))}>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea rows={3} className="input-field resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Amenities (comma separated)</label>
                <input className="input-field" value={form.amenities} onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))} placeholder="Free WiFi, AC, TV, Minibar" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Image URLs (comma separated)</label>
                <input className="input-field" value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
