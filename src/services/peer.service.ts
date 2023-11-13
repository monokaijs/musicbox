import Peer from "peerjs";

class PeerService {
  peer: Peer = new Peer();
  initialize(username: string) {
    this.peer = new Peer(username);
    this.peer.on('open', (id) => {
      console.log('connection opened', id);
    });
    return this.peer;
  }
  connect() {

  }
}

export default new PeerService();
