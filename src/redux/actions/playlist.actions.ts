import {createAsyncThunk} from "@reduxjs/toolkit";
import {v4} from "uuid";
import {RootState} from "@/redux/store";

interface CreatePlaylistArgs {
  id?: string;
  name: string;
  tracks?: YouTubeTrack[];
  systemPlaylist?: boolean;
  artwork?: string;
}

export const createPlaylist = createAsyncThunk('app/create-playlist', (opts: CreatePlaylistArgs) => {
  const newPlaylist: Playlist = {
    name: opts.name,
    tracks: [],
    id: opts.id || v4(),
    systemPlaylist: opts.systemPlaylist || false,
    artwork: opts.artwork || '',
  };
  return newPlaylist;
});

interface AddTrackToPlaylistArgs {
  track: YouTubeTrack;
  playlistId: string;
}

export const addTrackToPlaylist = createAsyncThunk('app/addToPlaylist', (args: AddTrackToPlaylistArgs, thunkAPI) => {
  const playlists = (thunkAPI.getState() as RootState).app.playlists;
  const addingPlaylist = playlists.find(p => p.id ===  args.playlistId);
  if (!addingPlaylist) throw new Error("This playlist does not exist");
  if (addingPlaylist.tracks.find(track => track.id === args.track.id))
    throw new Error("This track is already in this playlist");
  return args;
});

interface RemoveTrackFromPlaylistArgs {
  trackId: string;
  playlistId: string;
}

export const removeTrackFromPlaylist = createAsyncThunk('app/removeFromPlaylist', (args: RemoveTrackFromPlaylistArgs, thunkAPI) => {
  const playlists = (thunkAPI.getState() as RootState).app.playlists;
  const removingPlaylist = playlists.find(p => p.id ===  args.playlistId);
  if (!removingPlaylist) throw new Error("This playlist does not exist");
  if (!removingPlaylist.tracks.find(track => track.id === args.trackId))
    throw new Error("This track does not exist in playlist");
  return args;
});
