
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, createStore } from 'redux';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
  TypedUseSelectorHook,
} from 'react-redux';

import storage from 'redux-persist/lib/storage';

//Reducers Class=
import UserDataReducer from './UserDataRedux/UserDataSlice';
import PengaduanDataReducer from './PengaduanDataRedux/PengaduanDataSlice'
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  userDataReducer: UserDataReducer,
  pengaduanDataReducer: PengaduanDataReducer,
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const { dispatch } = store;
export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<AppState> = useAppSelector;

export default store;
