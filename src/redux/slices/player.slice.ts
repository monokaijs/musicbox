import {createSlice} from "@reduxjs/toolkit";
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
}

const initialState: PlayerSliceState = {
  playerState: PlayerState.STOPPED,
  queue: [],
  playingIndex: 0,
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(enqueueTrack.fulfilled, (state, action) => {
      const existing = state.queue.find(x => x.id === action.payload.track.id);
      if (existing) {
        // error
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

export const {} = playerSlice.actions;

export default playerSlice;
