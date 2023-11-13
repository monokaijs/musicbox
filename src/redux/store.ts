import {AnyAction, combineReducers} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appSlice, {AppSliceState} from "@/redux/slices/app.slice";
import {configureStore, ThunkAction} from "@reduxjs/toolkit";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import playerSlice, {PlayerSliceState} from "@/redux/slices/player.slice";
import connectSlice, {ConnectSliceState} from "@/redux/slices/connect.slice";

const combinedReducer = combineReducers({
  app: appSlice.reducer,
  connect: connectSlice.reducer,
  player: persistReducer<any>({
    key: 'music-box:player',
    storage,
    whitelist: ['repeatMode'],
    stateReconciler: autoMergeLevel2,
  }, playerSlice.reducer),
});

export const store = configureStore({
  reducer: persistReducer<any>({
    key: 'music-box',
    storage,
    whitelist: ['app'],
    stateReconciler: autoMergeLevel2,
  }, combinedReducer),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})
export const persistor = persistStore(store);

export interface RootState {
  app: AppSliceState;
  player: PlayerSliceState;
  connect: ConnectSliceState;
}

export type AppDispatch = typeof store.dispatch;

export type AppThunkAction<R> = ThunkAction<R, RootState, unknown, AnyAction>;
