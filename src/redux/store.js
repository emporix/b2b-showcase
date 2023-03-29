import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authReducer'
import messageReducer from './slices/messageReducer'
import pageReducer from './slices/pageReducer'
import availabilityReducer from './slices/availabilityReducer'

const store = configureStore({
  reducer: {
    message: messageReducer,
    auth: authReducer,
    page: pageReducer,
    availability: availabilityReducer,
  },
})

export default store
