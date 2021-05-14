import {createSlice} from '@reduxjs/toolkit';
import {mqttAPI} from '../../api/api';

const initialState = {
  isLoading: false,
  pageFirstTable: 1,
  pageSecondTable: 1,
};

export const mqttSlice = createSlice({
  name: 'mqtt',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    setPageFirst: (state, action) => {
      return {
        ...state,
        pageFirstTable: action.payload,
      };
    },
    setPageSecond: (state, action) => {
      return {
        ...state,
        pageSecondTable: action.payload,
      };
    },
    setAllMessages: (state, action) => {
      return {
        ...state,
        messages: action.payload,
      };
    },
  },
});

export const {setLoading, setPageFirst, setPageSecond, setAllMessages} =
  mqttSlice.actions;

//@Thunks

export const getAllMessages = () => async (dispatch) => {
  dispatch(setLoading('monitoring'));
  let data = await mqttAPI.getMessages();
  dispatch(setAllMessages(data));
  dispatch(setLoading(undefined));
};

// @SELECTORS

export const selectIsLoading = (state) => state.mqtt.isLoading;
export const selectPageFirst = (state) => state.mqtt.pageFirstTable;
export const selectPageSecond = (state) => state.mqtt.pageSecondTable;
export const selectAllMessages = (state) => state.mqtt.messages;

export default mqttSlice.reducer;
