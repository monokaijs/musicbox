import {createAsyncThunk} from "@reduxjs/toolkit";

interface EnqueueTrackArgs {
  track: YouTubeTrack;
  playNow: boolean;
}

export const enqueueTrack = createAsyncThunk('app/enqueue-track', (data: EnqueueTrackArgs) => {
  return {
    track: data.track,
    playNow: data.playNow,
  }
});
