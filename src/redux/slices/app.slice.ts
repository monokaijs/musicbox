import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTrackToPlaylist, createPlaylist, removeTrackFromPlaylist} from "@/redux/actions/playlist.actions";
import {enqueueTrack} from "@/redux/actions/player.actions";

export interface AppSliceState {
  playlists: Playlist[];
  createPlaylistModal: boolean;
  addToPlaylistModal: {
    track?: YouTubeTrack;
    showModal: boolean;
  };
  searchHistory: string[];
  playHistory: YouTubeTrack[];
}

const initialState: AppSliceState = {
  playlists: [{
    id: 'FAVORITE',
    name: 'Favorite',
    tracks: [],
    systemPlaylist: true,
    artwork: '',
  }],
  createPlaylistModal: false,
  searchHistory: [],
  addToPlaylistModal: {
    showModal: false,
  },
  playHistory: [],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setApp(state, action: PayloadAction<Optional<AppSliceState>>) {
      state = {
        ...state,
        ...action.payload,
      }
      return state;
    }
  },
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
    }).addCase(enqueueTrack.fulfilled, (state, action) => {
      state.playHistory = [
        action.payload.track,
        ...state.playHistory.filter((x) => x.id !== action.payload.track.id),
      ].filter((x, i) => i < 20) // only save 20 last tracks
    });
  }
});

export const {setApp} = appSlice.actions;

export default appSlice;
