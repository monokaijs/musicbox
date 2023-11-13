import Peer, {DataConnection, MediaConnection} from "peerjs";
import {generateUsername} from "unique-username-generator";

type OnConnectionListener = (conn: DataConnection, isIncoming: boolean) => any;
type OnDataListener = (data: any, conn: DataConnection) => any;
type OnCloseListener = (conn: DataConnection) => any;
type OnCallListener = (conn: MediaConnection) => any;

class PeerService {
  client?: Peer;
  id: string = '';
  connections: DataConnection[] = [];
  onConnection: {
    listeners: OnConnectionListener[],
    addListener: (fn: OnConnectionListener) => any
  } = {
    listeners: [],
    addListener: (fn) => {
      this.onConnection.listeners.push(fn);
    }
  }

  onData: {
    listeners: OnDataListener[],
    addListener: (fn: OnDataListener) => any,
    removeListener: (fn: OnDataListener) => any,
  } = {
    listeners: [],
    addListener: (fn) => {
      this.onData.listeners.push(fn);
    },
    removeListener: (fn) => {
      this.onData.listeners.filter(x => x !== fn);
    }
  }

  onClose: {
    listeners: OnCloseListener[],
    addListener: (fn: OnCloseListener) => any
  } = {
    listeners: [],
    addListener: (fn) => {
      this.onClose.listeners.push(fn);
    }
  }

  onCall: {
    listeners: OnCallListener[],
    addListener: (fn: OnCallListener) => any
  } = {
    listeners: [],
    addListener: (fn) => {
      this.onCall.listeners.push(fn);
    }
  }

  initialize(id?: string): Promise<string> {
    return new Promise(resolve => {
      if (!id) id = generateUsername('-');
      this.id = id;
      this.client = new Peer(id);

      this.client.on("connection", (conn) => {
        // other client connected
        conn.on('open', () => {
          this.onConnection.listeners.forEach(fn => fn(conn, true));
          this.addConnection(conn);
        });
        conn.on("data", (data) => {
          data = JSON.parse(decodeURIComponent(data as string));
          this.onData.listeners.forEach(fn => fn(data, conn));
        });
        conn.on("close", () => {
          this.onClose.listeners.forEach(fn => fn(conn));
          this.removeConnection(conn);
        });
        conn.on("error", () => {
          this.onClose.listeners.forEach(fn => fn(conn));
          this.removeConnection(conn);
        })
      });

      this.client.on("call", (call) => {
        this.onCall.listeners.forEach(fn => fn(call));
      })

      this.client.on("error", error => {
        console.log(error);
      });

      this.client.on("open", (id) => {
        resolve(id);
      });
    })
  }

  addConnection(connection: DataConnection) {
    if (!this.connections.find(x => x.connectionId === connection.connectionId)) {
      this.connections.push(connection);
    }
  }

  removeConnection(connection: DataConnection) {
    this.connections = this.connections.filter(conn => conn.connectionId !== connection.connectionId);
  }

  connect(peerId: string) {
    if (!this.client) throw new Error("Peer is not initialized");
    const conn = this.client.connect(peerId);
    return new Promise((resolve, reject) => {
      conn.on("open", () => {
        this.addConnection(conn);
        this.onConnection.listeners.forEach(fn => fn(conn, false));
        resolve(conn);
      });
      conn.on("data", (data) => {
        data = JSON.parse(decodeURIComponent(data as string));
        this.onData.listeners.forEach(fn => fn(data, conn));
      });
      conn.on("error", () => {
        this.onClose.listeners.forEach(fn => fn(conn));
        this.removeConnection(conn);
        reject(conn);
      });
      conn.on("close", () => {
        this.onClose.listeners.forEach(fn => fn(conn));
        this.removeConnection(conn);
      });
      if (!this.client) throw new Error("Peer is not initialized");
      this.client.on("error", () => {
        reject();
      })
    });
  }

  getConnections() {
    return new Promise(resolve => {
      if (!this.client) throw new Error("Peer is not initialized");
      this.client.listAllPeers(resolve);
    });
  }

  sendRawData(message: any) {
    for (let conn of this.connections) {
      conn.send(message);
    }
  }

  sendAll(message: any) {
    this.sendRawData(encodeURIComponent(JSON.stringify(message)))
  }

  send(conn: DataConnection, message: any) {
    conn.send(encodeURIComponent(JSON.stringify(message)));
  }

  disconnect() {
    if (!this.client) return;
    this.onConnection.listeners = [];
    this.onData.listeners = [];
    this.client.disconnect();
    this.client.destroy();
  }
}

export default new PeerService();
