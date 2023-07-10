const chainUtil = require('../chain-util');

class Transaction {
    constructor() {
        this.id = chainUtil.id();
        this.input = null;
        //outputs is a list because we can have multiple outputs
        this.outputs = [];
    }

    static newTransaction(senderWallet, recipient, amount) {
        if (amount > senderWallet.balance) {
            //return/ faild the transaction
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        return transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },// to self
            { amount: amount, address: recipient }// to recipient
        ]);
    }
    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }
}
module.exports = Transaction;