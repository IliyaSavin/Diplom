import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import stationsReducer from '../features/stationsSlice';
import userReducer from '../features/userSlice';

//import {reducer as formReducer} from 'redux-form';

export default configureStore({
  reducer: {
    auth: authReducer,
    stations: stationsReducer,
    user: userReducer,
    //form: formReducer,
  },
});
