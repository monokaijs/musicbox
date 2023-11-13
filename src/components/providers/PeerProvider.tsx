import {ReactNode, useEffect} from "react";
import peerService from "@/services/peer.service";
import {generateUsername} from "unique-username-generator";
import {useAppDispatch} from "@/redux/hooks";
import {setConnectSlice} from "@/redux/slices/connect.slice";

interface PeerProviderProps {
}

export default function PeerProvider({}: PeerProviderProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const username = generateUsername('-');
    const peer = peerService.initialize(username);
    peer.on('open', (id) => {
      console.log('connected to peer server');
      dispatch(setConnectSlice({
        connected: true,
        username,
        peerId: id,
      }));
    })
  }, []);
  return <></>
}
