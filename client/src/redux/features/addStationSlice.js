import {createSlice} from '@reduxjs/toolkit';
import {stationsAPI} from '../../api/api';

const initialState = {
  page: 1,
};

export const addStationSlice = createSlice({
  name: 'addStation',
  initialState,
  reducers: {
    setAllStationsEco: (state, action) => {
      return {
        ...state,
        allStations: action.payload,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    setPage: (state, action) => {
      return {
        ...state,
        page: action.payload,
      };
    },
  },
});

export const {setAllStationsEco, setLoading, setPage} = addStationSlice.actions;

//@Thunks
export const getEcoBotStations = (string) => async (dispatch) => {
  dispatch(setLoading(true));
  const data = await stationsAPI.getAllStationsEcoBot(string);
  dispatch(setAllStationsEco(data));
  dispatch(setLoading(false));
};

// @SELECTORS

export const selectAllStationEcoBot = (state) => state.addStation.allStations;
export const selectIsLoading = (state) => state.addStation.isLoading;
export const selectPage = (state) => state.addStation.page;

export default addStationSlice.reducer;
