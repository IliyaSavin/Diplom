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
    setCityList: (state, action) => {
      return {
        ...state,
        cityList: action.payload,
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

export const {
  setAllStationsEco,
  setLoading,
  setPage,
  setCityList,
  setSuccess,
} = addStationSlice.actions;

//@Thunks
export const getEcoBotStations = (string) => async (dispatch) => {
  dispatch(setLoading(true));
  const data = await stationsAPI.getAllStationsEcoBot(string);
  dispatch(setAllStationsEco(data));
  dispatch(setLoading(false));
};

export const getCityList = () => async (dispatch) => {
  dispatch(setLoading(true));
  const city = await stationsAPI.getCityListEcoBot();
  dispatch(setCityList(city));
  dispatch(setLoading(false));
};

export const addStation = (id) => async (dispatch) => {
  const data = await stationsAPI.addStation(id);
  if (data.msg === 'Station added') {
    dispatch(setSuccess(true));
  }
};

// @SELECTORS

export const selectAllStationEcoBot = (state) => state.addStation.allStations;
export const selectIsLoading = (state) => state.addStation.isLoading;
export const selectPage = (state) => state.addStation.page;
export const selectSuccsess = (state) => state.addStation.success;
export const selectCityList = (state) => state.addStation.cityList;

export default addStationSlice.reducer;
