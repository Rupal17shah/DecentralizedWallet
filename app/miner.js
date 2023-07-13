const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
const { MINING_REWARD } = require("../config");

class Miner{
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }
    mine() {
        // console.log(this.transactionPool)
        const validTransactions = this.transactionPool.validTransactions();
        // console.log(validTransactions);
        if (validTransactions.length === 0) {
            return null;
        }
        else {
            validTransactions.push(
              Transaction.rewardTransaction(
                this.wallet,
                Wallet.blockchainWallet()
              )
            );
            console.log(validTransactions);
            const block = this.blockchain.addBlock(validTransactions);
            this.p2pServer.syncChain();
            this.transactionPool.clear();
            this.p2pServer.broadcastClearTransactions();
            return block;
        }
    }
}

module.exports = Miner;