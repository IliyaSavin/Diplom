import {createSlice} from '@reduxjs/toolkit';
import {userAPI} from '../../api/api';

const initialState = {
  login: '',
  password: '',
  errors: '',
  success: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      return {
        ...state,
        login: action.payload,
      };
    },
    setPassword: (state, action) => {
      return {
        ...state,
        password: action.payload,
      };
    },
    setErrors: (state, action) => {
      return {
        ...state,
        errors: action.payload,
      };
    },
    setSuccess: (state, action) => {
      return {
        ...state,
        success: action.payload,
      };
    },
  },
});

export const {setLogin, setPassword, setErrors, setSuccess} = userSlice.actions;

//@Thunks
export const addUser = (login, password) => async (dispatch) => {
  const data = await userAPI.addUser(login, password);
  if (data.login && data.password) {
    dispatch(setSuccess(true));
    dispatch(setLogin(''));
    dispatch(setPassword(''));
  }
};

// @SELECTORS
export const selectLogin = (state) => state.user.login;
export const selectPassword = (state) => state.user.password;
export const selectErrors = (state) => state.user.errors;
export const selectSuccess = (state) => state.user.success;

export default userSlice.reducer;
