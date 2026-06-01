import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const fetchRooms = createAsyncThunk('rooms/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString()
    const res = await api.get(`/rooms${query ? '?' + query : ''}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch rooms')
  }
})

export const fetchRoomById = createAsyncThunk('rooms/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/rooms/${id}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch room')
  }
})

const roomSlice = createSlice({
  name: 'rooms',
  initialState: { rooms: [], room: null, loading: false, error: null },
  reducers: {
    clearRoom: (state) => { state.room = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchRooms.fulfilled, (state, action) => { state.loading = false; state.rooms = action.payload.rooms })
      .addCase(fetchRooms.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchRoomById.pending, (state) => { state.loading = true; state.room = null })
      .addCase(fetchRoomById.fulfilled, (state, action) => { state.loading = false; state.room = action.payload.room })
      .addCase(fetchRoomById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  }
})

export const { clearRoom } = roomSlice.actions
export default roomSlice.reducer