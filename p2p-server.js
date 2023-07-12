const ws = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
// const MESSAGE_TYPE = {
//   chain: "CHAIN",
//   transaction: "TRANSACTION",
// };
const MESSAGE_TYPE = {
  chain: "CHAIN",
  transaction: "TRANSACTION",
  clear_transactions: "CLEAR_TRANSACTIONS",
};

class P2pserver {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.sockets = [];
    this.transactionPool = transactionPool;
  }

  listen() {
    const server = new ws.Server({ port: P2P_PORT });
    server.on("connection", (socket) => this.connectSocket(socket));

    this.connectToPeers();
    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log("Socket connected");
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new ws(peer);
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  sendChain(socket) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.chain,
        chain: this.blockchain.chain,
      })
    );
  }
  messageHandler(socket) {
    socket.on("message", (message) => {
      const data = JSON.parse(message);
      // console.log("data", data);
      if (data.type === MESSAGE_TYPE.transaction) {
        // console.log("data.transaction", data.transaction);
        this.transactionPool.updateOrAddTransaction(data.transaction);
      } else if (data.type === MESSAGE_TYPE.chain) {
        // console.log("data.chain", data.chain);
        this.blockchain.replaceChain(data);
      } else if (data.type === MESSAGE_TYPE.clear_transactions) {
        this.transactionPool.clear();
      }
    });
  }

  syncChain() {
    this.sockets.forEach((socket) => {
      this.sendChain(socket);
    });
  }

  // transaction
  broadcastTransaction(transaction) {
    this.sockets.forEach((socket) => {
      this.sendTransaction(socket, transaction);
    });
  }

  broadcastClearTransactions() {
    this.sockets.forEach((socket) => {
      socket.send(
        JSON.stringify({
          type: MESSAGE_TYPE.clear_transactions,
        })
      );
    });
  }

  sendTransaction(socket, transaction) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.transaction,
        transaction: transaction,
      })
    );
  }
}

module.exports = P2pserver;