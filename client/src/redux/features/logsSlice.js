import {createSlice} from '@reduxjs/toolkit';
import {logsAPI, userAPI} from '../../api/api';

const initialState = {};

export const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      return {
        ...state,
        allUsers: action.payload,
      };
    },
    setAllLogs: (state, action) => {
      return {
        ...state,
        allLogs: action.payload,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
});

export const {setAllUsers, setLoading, setAllLogs} = logsSlice.actions;

//@Thunks
export const getAllUsers = () => async (dispatch) => {
  dispatch(setLoading(true));
  let data = await logsAPI.getAllUsers();
  data.unshift('All');
  dispatch(setAllUsers(data));
  dispatch(setLoading(false));
};

export const getAllData = (string) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setAllLogs([]));
  let data = await logsAPI.getAllLogs(string);
  dispatch(setAllLogs(data));
  dispatch(setLoading(false));
};

// @SELECTORS
export const selectAllUsers = (state) => state.logs.allUsers;
export const selectLoading = (state) => state.logs.loading;
export const selectAllLogs = (state) => state.logs.allLogs;

export default logsSlice.reducer;
