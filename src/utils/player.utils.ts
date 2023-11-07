export const getTrackThumbnail = (track: YouTubeTrack) => {
  return (track.thumbnails || track.thumbnail)[0].url
}

export const getPlaylistThumbnail = (playlist?: Playlist) => {
  const defaultThumbnail = 'https://hdwallsource.com/img/2014/11/music-wallpaper-41678-42656-hd-wallpapers.jpg';
  if (!playlist?.tracks || playlist.tracks.length === 0) return defaultThumbnail;
  return getTrackThumbnail(playlist.tracks[0]);
}
