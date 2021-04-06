import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
//import {reducer as formReducer} from 'redux-form';

export default configureStore({
  reducer: {
    auth: authReducer,
    //form: formReducer,
  },
});
