import {AnyAction, combineReducers} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appSlice, {AppSliceState} from "@/redux/slices/app.slice";
import {configureStore, ThunkAction} from "@reduxjs/toolkit"; // defaults to localStorage for web

const combinedReducer = combineReducers({
  app: appSlice.reducer,
});

let store = configureStore({
  reducer: persistReducer({
    key: 'music-box',
    storage,
    whitelist: ['app']
  }, combinedReducer),
})
export const persistor = persistStore(store);

export interface RootState {
  app: AppSliceState,
}

export type AppDispatch = typeof store.dispatch;

export type AppThunkAction<R> = ThunkAction<R, RootState, unknown, AnyAction>;
