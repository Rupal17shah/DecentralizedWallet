# BlockStream: Earn Infinity, Trade Infinity

### Description
This application is a Public Blockchain wallet. It ensures safe and secure trade and transactions of the coin infinity between the nodes. This app also includes the formation of multiple nodes and peers over the p2p network. 
It has the following features:
### Features
1) It allows the creation of blocks in the blockchain.
2) Any data can be securely stored in the blocks.
3) The chain is broadcasted across all the nodes through the creation of p2p network using `ws`. 
4) Any change in the blockchain like adding a new block would be verified first as to whether after the change the chain is valid or not.
5) We have implemented proof of consensus alorithm for the same. The miner can mine the data in the blockchain after performing some rigorous computational power exercise. On adding the data, the minor will receive a reward too.
6) For the wallet, the blocks carry transactions.
7) It also has a transaction pool where the transactions are kept on hold and verified by the miners to mine in the chain periodically.


### Instructions to use the backend
1) git clone the repo.
2) npm install all the modules.
3) navigate to app->index.js
4) Now, to create the first user, on the first terminal type in `npm run dev`. This will create the first node.
5) open a new terminal, and type in `HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5002` npm run dev. This will be node 2.
6) open a new terminal, and type in `HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001 ws://localhost:5002 npm run dev`
