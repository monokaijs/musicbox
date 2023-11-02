import {createSlice} from "@reduxjs/toolkit";
import {toggleFavoriteTrack} from "@/redux/actions/track.actions";

export interface AppSliceState {
  favoriteTracks: YouTubeTrack[];
}

const initialState: AppSliceState = {
  favoriteTracks: [],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(toggleFavoriteTrack.fulfilled, (state, action) => {
      state.favoriteTracks = action.payload;
    });
  }
});

export const {} = appSlice.actions;

export default appSlice;
