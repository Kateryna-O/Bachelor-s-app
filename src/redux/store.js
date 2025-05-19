import { configureStore } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import { authReducer } from '../redux/auth/slice';
import persistStore from 'redux-persist/es/persistStore';
import { usersReducers } from '../redux/users/slice';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { setStore } from '../helpers/axios';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// const rootReducer = (state, action) => {
//   return state;
// };

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: usersReducers,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setStore(store);

export const persistor = persistStore(store);
