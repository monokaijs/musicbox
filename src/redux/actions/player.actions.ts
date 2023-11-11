import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@/redux/store";

interface EnqueueTrackArgs {
  track: YouTubeTrack;
  playNow: boolean;
}

export const enqueueTrack = createAsyncThunk('app/enqueue-track', (data: EnqueueTrackArgs, thunkAPI) => {
  const queue = (thunkAPI.getState() as RootState).player.queue;
  if (queue.find(x => x.id === data.track.id)) throw new Error("This track is already in queue...");
  return {
    track: data.track,
    playNow: data.playNow,
  }
});
