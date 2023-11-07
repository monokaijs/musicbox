import {createSlice} from "@reduxjs/toolkit";
import {toggleFavoriteTrack} from "@/redux/actions/track.actions";
import {addTrackToPlaylist, createPlaylist, removeTrackFromPlaylist} from "@/redux/actions/playlist.actions";
import {enqueueTrack} from "@/redux/actions/player.actions";

export interface AppSliceState {
  favoriteTracks: YouTubeTrack[];
  playlists: Playlist[];
}

const initialState: AppSliceState = {
  favoriteTracks: [],
  playlists: [{
    id: 'FAVORITE',
    name: 'Favorite',
    tracks: [],
    systemPlaylist: true,
    artwork: '',
  }],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPlaylist.fulfilled, (state, action) => {
      state.playlists = [
        action.payload,
        ...state.playlists
      ];
    }).addCase(addTrackToPlaylist.fulfilled, (state, action) => {
      state.playlists = state.playlists.map(playlist => {
        if (playlist.id === action.payload.playlistId) {
          console.log(playlist)
          playlist.tracks.push(action.payload.track);
        }
        return playlist;
      });
    }).addCase(addTrackToPlaylist.rejected, (state, action) => {
      console.log('Error', action);
    }).addCase(removeTrackFromPlaylist.fulfilled, (state, action) => {
      state.playlists = state.playlists.map(playlist => {
        if (playlist.id === action.payload.playlistId) {
          playlist.tracks = playlist.tracks.filter(track => {
            return track.id !== action.payload.trackId;
          });
        }
        return playlist;
      })
    });
  }
});

export const {} = appSlice.actions;

export default appSlice;
