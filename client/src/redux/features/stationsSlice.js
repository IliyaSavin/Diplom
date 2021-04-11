import {createSlice} from '@reduxjs/toolkit';
import {stationsAPI} from '../../api/api';
import {formatChartObject, parseCommonUnits} from '../../util/util';

const initialState = {
  allStations: [],
  currentStation: {},
  loading: false,
  currentPageIndex: ['1'],
  loadingStatus: false,
  page: 1,
};

export const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setStations: (state, action) => {
      state.allStations = action.payload;
    },
    changeStationStatus: (state, action) => {
      state.allStations = state.allStations.map((s) => {
        if (s.ID_Station === action.payload.id) {
          return {
            ...s,
            Status: action.payload.status,
          };
        } else return {...s};
      });
    },
    setStationsUnit: (state, action) => {
      state.allStations = state.allStations.map((s) => {
        if (s.ID_Station === action.payload.id) {
          return {
            ...s,
            units: [...action.payload.units],
          };
        } else return {...s};
      });
    },
    setCurrentPageIndex: (state, action) => {
      return {
        ...state,
        currentPageIndex: action.payload,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
    setAdminConfig: (state, action) => {
      return {
        ...state,
        config: action.payload,
      };
    },
    setGlobalStatus: (state, action) => {
      return {
        ...state,
        config: {
          ...state.config,
          Working_Status: action.payload,
        },
      };
    },
    setLoadingStatus: (state, action) => {
      return {
        ...state,
        loadingStatus: action.payload,
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

export const {
  setStations,
  setStationsUnit,
  setLoading,
  setCurrentPageIndex,
  changeStationStatus,
  setAdminConfig,
  setGlobalStatus,
  setLoadingStatus,
  setPage,
} = stationsSlice.actions;

//@Thunks
export const getStations = (string) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const data = await stationsAPI.getAllStations(string);
  await dispatch(setStations(data));
  const state = getState();
  state.stations.allStations.map(async (s) => {
    let unitData = await stationsAPI.getStationsUnit(s.ID_Station);
    dispatch(setStationsUnit({id: s.ID_Station, units: unitData}));
  });
  dispatch(setLoading(false));
};

export const changeStatusStation = (id, status) => async (
  dispatch,
  getState
) => {
  const data = await stationsAPI.changeStatus(id, status);
  dispatch(changeStationStatus(data));
};

export const deleteStation = (id, string) => async (dispatch) => {
  setLoading(true);
  const data = await stationsAPI.deleteStation(id);
  if (data.message === 'Station deleted') {
    await dispatch(getStations('?order=idUp'));
  }
  setLoading(false);
};
export const getAdminConfig = () => async (dispatch) => {
  const data = await stationsAPI.getAdminConfig();
  dispatch(setAdminConfig(data));
};

export const setGlobalStatusThunk = (status) => async (dispatch) => {
  dispatch(setLoadingStatus(true));
  const data = await stationsAPI.setGlobalStatus(status);
  await dispatch(setGlobalStatus(data.status));
  dispatch(setLoadingStatus(false));
};
// @SELECTORS
export const selectAllStations = (state) => state.stations.allStations;
export const selectCurrentPageIndex = (state) =>
  state.stations.currentPageIndex;
export const selectLoading = (state) => state.stations.loading;
export const selectConfig = (state) => state.stations.config;
export const selectLoadingStaus = (state) => state.stations.loadingStatus;
export const selectPage = (state) => state.stations.page;

export default stationsSlice.reducer;
