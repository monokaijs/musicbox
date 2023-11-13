import {ReactNode, useEffect} from "react";
import peerService from "@/services/peer.service";
import {generateUsername} from "unique-username-generator";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setConnectSlice} from "@/redux/slices/connect.slice";
import {RootState, store} from "@/redux/store";
import {DataConnection} from "peerjs";
import {message} from "antd";
import {setPlayer} from "@/redux/slices/player.slice";

interface PeerProviderProps {
}

export default function PeerProvider({}: PeerProviderProps) {
  const dispatch = useAppDispatch();
  const {connections, isHost} = useAppSelector(state => state.connect);
  const {queue, playingIndex, currentTime, paused} = useAppSelector(state => state.player);

  useEffect(() => {
    const username = generateUsername('-');
    peerService.initialize(username).then((id) => {
      dispatch(setConnectSlice({
        connected: true,
        username,
        peerId: id,
      }));
    });
    peerService.onData.addListener((data, conn) => {
      const state = store.getState() as RootState;
      if (data.action === 'hostCheck' && state.connect.joining) {
        if (data.data === true) {
          dispatch(setConnectSlice({
            roomConnected: true,
          }));
          return message.success("Connected!");
        } else if (!state.connect.isHost) {
          conn.close();
          return message.error("Peer seems not a valid room.");
        }
      }
      if (data.action === 'syncPlayer') {
        dispatch(setPlayer({
          queue: data.data.queue,
          playingIndex: data.data.playingIndex,
          paused: data.data.paused,
        }));
      }
    })
    peerService.onConnection.addListener(conn => {
      const state = store.getState() as RootState;
      peerService.send(conn, {
        action: 'hostCheck',
        data: state.connect.isHost,
      });
      if (state.connect.isHost) {
        dispatch(setConnectSlice({
          connections: [
            conn,
            ...connections,
          ]
        }));
      }
    });
  }, []);

  useEffect(() => {
    if (isHost) {
      peerService.sendAll({
        action: 'syncPlayer',
        data: {
          queue,
          playingIndex,
          paused,
        },
      });
    }
  }, [queue, playingIndex, paused]);

  return <></>
}
