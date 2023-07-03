const ws = require('ws');

// defining p2p port for the server
const P2P_PORT = process.env.P2P_PORT || 5001;
// PEERS = ["ws://localhost:5002 P2P_PORT=5001 HTTP_PORT=3001"];
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pserver {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }


    listen() {
        // creating a new p2p server with the port as argument
        const server = new WebSocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    // connecting to the sockets
    // we will store the sockets that we connect to in the sockets array
    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');
        // this.messageHandler(socket);
        // this.sendChain(socket);
    }

    connectToPeers() {
        // now we will connect to all the peers 
        peers.forEach(peer => {
            const socket = new WebSocket(peer);

            // open event is fired when the connection is established
            socket.on('open',()=> this.connectSocket(socket))
        });
    }

}

module.exports = P2pserver;