import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DataConnection} from "peerjs";

export interface ConnectSliceState {
  connected: boolean;
  roomConnected: boolean;
  showDrawer: boolean;
  username?: string;
  peerId?: string;
  connections: DataConnection[];
  hostId?: string;
  isHost: boolean;
  joining: boolean;
  mode?: ConnectMode;
  messages: ChatMessage[];
}

const initialState: ConnectSliceState = {
  connected: false,
  roomConnected: false,
  showDrawer: false,
  connections: [],
  isHost: false,
  joining: false,
  messages: [],
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
