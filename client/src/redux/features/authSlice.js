import {createSlice} from '@reduxjs/toolkit';
import {userAPI} from '../../api/api';

const initialState = {
  isAuth: false,
  loginString: '',
  passString: '',
  errorLog: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setLogString: (state, action) => {
      state.loginString = action.payload;
    },
    setPassString: (state, action) => {
      state.passString = action.payload;
    },
    setErrorLog: (state, action) => {
      state.errorLog = action.payload;
    },
  },
});

export const {
  setAuth,
  setLogString,
  setPassString,
  setErrorLog,
} = authSlice.actions;

//@Thunks
export const loginUser = (login, password) => async (dispatch) => {
  console.log(login, password);
  const data = await userAPI.login(login, password);

  if (data.errors) {
    console.log(data.errors);
    dispatch(setErrorLog(data.errors[0].msg));
  } else {
    sessionStorage.setItem('token', data.token);
    await dispatch(setAuth(true));
    dispatch(setErrorLog(''));
  }
};

// @SELECTORS
export const selectIsAuth = (state) => state.auth.isAuth;
export const selectLoginString = (state) => state.auth.loginString;
export const selectPasswordString = (state) => state.auth.passString;
export const selectErrorLog = (state) => state.auth.errorLog;

export default authSlice.reducer;
