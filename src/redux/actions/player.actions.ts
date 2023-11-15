import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState, store} from "@/redux/store";
import {message} from "antd";

interface EnqueueTrackArgs {
  track: YouTubeTrack;
  playNow: boolean;
  clearQueue?: boolean;
}

export const enqueueTrack = createAsyncThunk('app/enqueue-track', (data: EnqueueTrackArgs, thunkAPI) => {
  const {connect, player: {queue}} = thunkAPI.getState() as RootState;
  if (connect.roomConnected && (!connect.isHost && connect.mode === 'broadcast')) {
    message.error(`You're in a broadcast room so you cannot modify the queue`).then(() => null);
    throw new Error("Broadcast enqueue prohibited");
  }
  if (queue.find(x => x.id === data.track.id)) throw new Error("This track is already in queue...");
  return data;
});
