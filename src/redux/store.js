import { configureStore } from '@reduxjs/toolkit'
import messageReducer from './slices/messageReducer'
import pageReducer from './slices/pageReducer'
import availabilityReducer from './slices/availabilityReducer'

const store = configureStore({
  reducer: {
    message: messageReducer,
    page: pageReducer,
    availability: availabilityReducer,
  },
})

export default store
