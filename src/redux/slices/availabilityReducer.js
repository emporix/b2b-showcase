import { createSlice } from '@reduxjs/toolkit'
import AvailabilityService from '../../services/product/availability.service'

export const initialState = {
  loading: true,
  data: [],
}

const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    setAvailability: (state, action) => {
      // set category while loading...
      if (state.loading === true) state.data = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})
// The Availability Reduce
export default availabilitySlice.reducer

// The Availability Actions
export const { setAvailability, setLoading } = availabilitySlice.actions

export const GetAvailability = () => async (dispatch) => {
  const availability = await AvailabilityService.getAllAvailability()
  dispatch(setAvailability(availability))
  dispatch(setLoading(false))
}

// Selector
export const availabilityLoadingSelector = (state) => state.availability.loading
export const availabilityDataSelector = (state) => state.availability.data
