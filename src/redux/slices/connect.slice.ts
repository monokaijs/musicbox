import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ConnectSliceState {
  connected: boolean;
  roomConnected: boolean;
  showDrawer: boolean;
  username?: string;
  peerId?: string;
}

const initialState: ConnectSliceState = {
  connected: false,
  roomConnected: false,
  showDrawer: false,
}

const connectSlice = createSlice({
  name: 'connect',
  initialState,
  reducers: {
    setConnectSlice(state, action: PayloadAction<Optional<ConnectSliceState>>) {
      state = {
        ...state,
        ...action.payload,
      }
      return state;
    }
  },
  extraReducers: (builder) => {
  }
});

export const {setConnectSlice} = connectSlice.actions;

export default connectSlice;
