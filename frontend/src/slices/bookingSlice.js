import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/bookings', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchMyBookings = createAsyncThunk('bookings/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/bookings/my')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id, { rejectWithValue }) => {
  try {
    const res = await api.put(`/bookings/${id}/cancel`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: { bookings: [], currentBooking: null, loading: false, error: null },
  reducers: { setCurrentBooking: (state, action) => { state.currentBooking = action.payload } },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => { state.loading = true })
      .addCase(createBooking.fulfilled, (state, action) => { state.loading = false; state.currentBooking = action.payload.booking })
      .addCase(createBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true })
      .addCase(fetchMyBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload.bookings })
      .addCase(fetchMyBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex(b => b.id === action.payload.booking.id)
        if (idx !== -1) state.bookings[idx] = action.payload.booking
      })
  }
})

export const { setCurrentBooking } = bookingSlice.actions
export default bookingSlice.reducer
