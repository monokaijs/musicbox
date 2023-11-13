import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@/redux/store";

// export const toggleFavoriteTrack = createAsyncThunk('app/favorite', (track: YouTubeTrack, thunkAPI) => {
//   const state = thunkAPI.getState() as RootState;
//   const prevFavTracks = state.app.favoriteTracks || [];
//   const prevFavIndex = prevFavTracks.findIndex(x => x.id === track.id);
//   if (prevFavIndex >= 0) {
//     // remove from favorite list
//     return [...prevFavTracks.filter((x) => x.id !== track.id)]
//   } else {
//     return [track, ...prevFavTracks];
//   }
// });
