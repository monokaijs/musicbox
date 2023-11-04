import {AnyAction, combineReducers} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appSlice, {AppSliceState} from "@/redux/slices/app.slice";
import {configureStore, ThunkAction} from "@reduxjs/toolkit";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const combinedReducer = combineReducers({
  app: appSlice.reducer,
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
  app: AppSliceState,
}

export type AppDispatch = typeof store.dispatch;

export type AppThunkAction<R> = ThunkAction<R, RootState, unknown, AnyAction>;
