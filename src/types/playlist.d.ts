interface Playlist {
  id: string;
  name: string;
  artwork: string;
  tracks: YouTubeTrack[];
  systemPlaylist: boolean; // prevent this playlist from being deleted
}
