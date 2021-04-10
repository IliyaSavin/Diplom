import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import stationsReducer from '../features/stationsSlice';
//import {reducer as formReducer} from 'redux-form';

export default configureStore({
  reducer: {
    auth: authReducer,
    stations: stationsReducer,
    //form: formReducer,
  },
});
