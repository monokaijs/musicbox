import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {toggleFavoriteTrack} from "@/redux/actions/track.actions";
import {addTrackToPlaylist, createPlaylist, removeTrackFromPlaylist} from "@/redux/actions/playlist.actions";
import {enqueueTrack} from "@/redux/actions/player.actions";

export enum PlayerState {
  STOPPED = 0,
  PAUSED = 1,
  PLAYING = 2,
}

export interface PlayerSliceState {
  playerState: PlayerState
  queue: YouTubeTrack[];
  playingIndex: number;
  openModal: boolean;
  paused: boolean;
  currentTime: number;
  shouldUpdateBySeek: boolean;
}

const initialState: PlayerSliceState = {
  playerState: PlayerState.STOPPED,
  queue: [],
  playingIndex: 0,
  openModal: false,
  paused: false,
  currentTime: 0,
  shouldUpdateBySeek: false,
}

type SetPlayerArgs<T> = {
  [K in keyof T]?: T[K];
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    openPlayerModal: (state) => {
      state.openModal = true;
      return state;
    },
    closePlayerModal: (state) => {
      state.openModal = false;
      return state;
    },
    setPlayer(state, action: PayloadAction<SetPlayerArgs<PlayerSliceState>>) {
      return {
        ...state,
        ...action.payload,
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(enqueueTrack.fulfilled, (state, action) => {
      const existingIndex = state.queue.findIndex(x => x.id === action.payload.track.id);
      if (existingIndex >= 0) {
        state.playingIndex = existingIndex;
      } else {
        state.queue.push(action.payload.track);
        if (action.payload.playNow) {
          state.playerState = PlayerState.PLAYING;
          state.playingIndex = state.queue.length - 1;
        }
      }
    });
  }
});

export const {openPlayerModal, closePlayerModal, setPlayer} = playerSlice.actions;

export default playerSlice;
