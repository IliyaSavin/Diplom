import { createSlice } from '@reduxjs/toolkit'
import { userAPI } from '../../api/api'

const initialState = {
  isAuth: false,
  isLoadingAuth: false,
  loginString: '',
  passString: '',
  errorLog: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuth = action.payload
    },
    setLoadingAuth: (state) => {
      state.isLoadingAuth = !state.isLoadingAuth
    },
    setLogString: (state, action) => {
      state.loginString = action.payload
    },
    setPassString: (state, action) => {
      state.passString = action.payload
    },
    setErrorLog: (state, action) => {
      state.errorLog = action.payload
    },
  },
})

export const {
  setAuth,
  setLogString,
  setPassString,
  setErrorLog,
  setLoadingAuth,
} = authSlice.actions

//@Thunks
export const loginUser = (login, password) => async (dispatch) => {
  dispatch(setLoadingAuth())
  const data = await userAPI.login(login, password)

  if (data.errors) {
    dispatch(setErrorLog(data.errors[0].msg))
  } else {
    sessionStorage.setItem('token', data.token)
    dispatch(setAuth(true))
    dispatch(setErrorLog(''))
  }
  dispatch(setLoadingAuth())
}

// @SELECTORS
export const selectIsAuth = (state) => state.auth.isAuth
export const selectLoginString = (state) => state.auth.loginString
export const selectPasswordString = (state) => state.auth.passString
export const selectErrorLog = (state) => state.auth.errorLog

export default authSlice.reducer
