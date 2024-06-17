// store.js
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;