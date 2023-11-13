import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DataConnection} from "peerjs";

export interface ConnectSliceState {
  connected: boolean;
  roomConnected: boolean;
  showDrawer: boolean;
  username?: string;
  peerId?: string;
  connections: DataConnection[];
  isHost: boolean;
  joining: boolean;
}

const initialState: ConnectSliceState = {
  connected: false,
  roomConnected: false,
  showDrawer: false,
  connections: [],
  isHost: false,
  joining: false,
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
