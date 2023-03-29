import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  message: null,
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessageAction: (state, action) => {
      state.message = action.payload
    },
    clearMessageAction: (state, action) => {
      state.message = ''
    },
  },
})
// The Message Reducer
export default messageSlice.reducer

// The Actions
export const { setMessageAction, clearMessageAction } = messageSlice.actions

export const setMessage = (message) => (dispatch) =>
  dispatch(setMessageAction(message))
export const clearMessage = () => (dispatch) => dispatch(clearMessageAction())
// Selector
export const messageSelector = (state) => state.message.message
