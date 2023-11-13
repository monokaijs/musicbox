
const defaultThumbnail = 'https://hdwallsource.com/img/2014/11/music-wallpaper-41678-42656-hd-wallpapers.jpg';

export const getTrackThumbnail = (track: YouTubeTrack) => {
  if (!track) return defaultThumbnail;
  return (track.thumbnails || track.thumbnail)[0].url
}

export const getPlaylistThumbnail = (playlist?: Playlist) => {
  if (!playlist?.tracks || playlist.tracks.length === 0) return defaultThumbnail;
  return getTrackThumbnail(playlist.tracks[0]);
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Ensure the minutes and seconds are displayed with two digits (e.g., 02:05)
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export const getPlaylistDescription = (playlist: Playlist) => {
  return playlist.tracks.filter((x, i) => i < 2).map(t => t.author.name).join(', ');
}
