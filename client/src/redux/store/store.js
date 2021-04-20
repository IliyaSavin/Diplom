import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import stationsReducer from '../features/stationsSlice';
import userReducer from '../features/userSlice';
import addStationReducer from '../features/addStationSlice';
import logs from '../features/logsSlice';

//import {reducer as formReducer} from 'redux-form';

export default configureStore({
  reducer: {
    auth: authReducer,
    stations: stationsReducer,
    user: userReducer,
    addStation: addStationReducer,
    logs,
    //form: formReducer,
  },
});
