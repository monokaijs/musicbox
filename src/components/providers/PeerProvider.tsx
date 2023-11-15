import {ReactNode, useEffect} from "react";
import peerService from "@/services/peer.service";
import {generateUsername} from "unique-username-generator";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setConnectSlice} from "@/redux/slices/connect.slice";
import {RootState, store} from "@/redux/store";
import {DataConnection} from "peerjs";
import {message, notification} from "antd";
import {PlayerSliceState, setPlayer} from "@/redux/slices/player.slice";
import {playerEl} from "@/components/providers/PlayerProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMessage} from "@fortawesome/free-solid-svg-icons";
import {usePrevious} from "@/redux/hooks/usePrevious";

interface PeerProviderProps {
}

export default function PeerProvider({}: PeerProviderProps) {
  const dispatch = useAppDispatch();
  const {connections, isHost, roomConnected, mode} = useAppSelector(state => state.connect);
  const {queue, playingIndex, currentTime, paused} = useAppSelector(state => state.player);
  const prevQueue = usePrevious(queue);

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
        if (data.data.isHost === true) {
          dispatch(setConnectSlice({
            roomConnected: true,
            hostId: conn.peer,
            mode: data.data.mode,
          }));
          return message.success("Connected!");
        } else if (!state.connect.isHost) {
          if (!state.connect.roomConnected) {
            // when user is trying to connect to a non-host client when not in the room
            // then disconnect that connection since it's useless
            conn.close();
            return message.error("Peer seems not a valid room.");
          }
        }
      }
      if (data.action === 'syncPlayer') {
        dispatch(setPlayer({
          queue: data.data.queue || state.player.queue,
          playingIndex: data.data.playingIndex || state.player.playingIndex,
          paused: data.data.paused || state.player.paused,
        }));
      }
      if (data.action === 'seek' && playerEl) {
        playerEl.currentTime = data.data;
      }
      if (data.action === 'requestPeers') {
        peerService.send(conn, {
          action: 'peersUpdate',
          data: state.connect.connections.map(conn => conn.peer)
        });
      }
      if (data.action === 'peersUpdate') {
        // list of peers' username
        const peersList = data.data;
        for (let peer of peersList) {
          if (!state.connect.connections.find(x => x.peer === peer)) {
            // connect to peer since he is not in our list
            peerService.connect(peer).then(() => null);
          }
        }
      }
      if (data.action === 'newMessage') {
        dispatch(setConnectSlice({
          messages: [
            ...state.connect.messages,
            data.data,
          ],
        }));
        if (!state.connect.showDrawer) {
          notification.info({
            icon: <FontAwesomeIcon icon={faMessage}/>,
            message: (data.data as ChatMessage).author,
            description: (data.data as ChatMessage).message,
            placement: 'bottomRight'
          });
        }
      }
    })
    peerService.onConnection.addListener(conn => {
      const state = store.getState() as RootState;
      peerService.send(conn, {
        action: 'hostCheck',
        data: {
          isHost: state.connect.isHost,
          mode: state.connect.mode,
        },
      });
      dispatch(setConnectSlice({
        connections: [
          conn,
          ...state.connect.connections,
        ]
      }));
      if (!state.connect.isHost) {
        // request peers update
        peerService.send(conn, {
          action: 'requestPeers',
        });
      } else {
        // notice other peers that someone has just joined
      }
    });

    peerService.onClose.addListener(conn => {
      const state = store.getState() as RootState;
      dispatch(setConnectSlice({
        connections: state.connect.connections.filter(x => x.connectionId !== conn.connectionId),
      }));
    });

    return () => {
      dispatch(setConnectSlice({
        roomConnected: false,
        connections: [],
      }));
      peerService.disconnect();
    }
  }, []);

  useEffect(() => {
    if (roomConnected && ((mode === 'broadcast' && isHost) || mode === 'group')) {
      const syncData: Optional<PlayerSliceState> = {
        playingIndex: playingIndex,
        paused: paused,
      };
      let difference = queue.map(t => t.id).filter(x => !prevQueue?.map(t => t.id).includes(x));
      if (difference.length > 0) syncData.queue = queue;
      peerService.sendAll({
        action: 'syncPlayer',
        data: syncData,
      });
    }
  }, [queue, playingIndex, paused]);

  return <></>
}
