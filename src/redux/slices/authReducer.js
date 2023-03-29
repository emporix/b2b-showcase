import { createSlice } from '@reduxjs/toolkit'
import AuthService from '../../services/user/auth.service'
import { setMessage } from './messageReducer'
import { SESSION_ID } from '../../constants/localstorage'
import CartService from 'services/cart.service'

const user = JSON.parse(localStorage.getItem('user'))
const sessionId = localStorage.getItem(SESSION_ID)

export const initialState = user
  ? {
      isLoggedIn: true,
      user: user,
      sessionId: sessionId,
    }
  : {
      isLoggedIn: false,
      user: null,
      sessionId: sessionId,
    }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      state.isLoggedIn = false
    },
    registerFail: (state, action) => {
      state.isLoggedIn = false
    },
    loginSuccess: (state, action) => {
      state.isLoggedIn = true
      state.user = action.payload.user
    },
    loginFail: (state, action) => {
      state.isLoggedIn = false
      state.user = null
    },
    logoutSuccess: (state, action) => {
      state.isLoggedIn = false
      state.user = null
    },
  },
})
// The reducer
export default authSlice.reducer
// The Actions
export const {
  registerSuccess,
  registerFail,
  loginSuccess,
  loginFail,
  logoutSuccess,
} = authSlice.actions

export const register =
  (email, password, firstName, lastName, tenantName, company, phoneNumber) =>
  (dispatch) => {
    return AuthService.register(
      email,
      password,
      firstName,
      lastName,
      tenantName,
      company,
      phoneNumber
    ).then(
      (response) => {
        if (response.status === 201) {
          dispatch(registerSuccess())
          dispatch(setMessage('Signup success ! '))
        }
        return Promise.resolve()
      },
      (error) => {
        if (error.response.status === 409) {
          dispatch(registerFail())
          dispatch(setMessage('This email alrady exists'))
        } else {
          dispatch(registerFail())
          dispatch(setMessage('Singup failed!'))
        }

        return Promise.reject()
      }
    )
  }

export const login = (username, password, userTenant) => (dispatch) => {
  return AuthService.login(username, password, userTenant).then(
    async (data) => {
      if (data) {
        let userdata = {
          ...data,
          userTenant: userTenant,
          username: data.firstName + ' ' + data.lastName,
        }
        const { data: anonymousCart } = await CartService.getAnnonymousCart()
        // save anonymous cart to merge
        localStorage.setItem('anonymousCart', JSON.stringify(anonymousCart))
        localStorage.setItem('user', JSON.stringify(userdata))
        dispatch(loginSuccess({ user: userdata }))
        dispatch(setMessage('Login successed'))
      } else {
        dispatch(setMessage('Login failed'))
      }

      return Promise.resolve()
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      dispatch(loginFail())
      dispatch(setMessage('Login failed'))
      return Promise.reject()
    }
  )
}

export const logout = () => (dispatch) => {
  AuthService.logout()
  // clearCart()
  dispatch(logoutSuccess())
}
// Selector
export const sessionIdSelector = (state) => state.auth.sessionId
export const isLoggedInSelector = (state) => state.auth.isLoggedIn
export const userSelector = (state) => state.auth.user
