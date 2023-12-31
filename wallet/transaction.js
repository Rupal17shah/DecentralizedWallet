const chainUtil = require("../chain-util");
const {MINING_REWARD} = require("../config"); 
class Transaction {
  constructor() {
    this.id = chainUtil.id();
    this.input = null;
    //outputs is a list because we can have multiple outputs
    this.outputs = [];
  }
  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      (output) => output.address === senderWallet.publicKey
    );

    if (amount > senderWallet.amount) {
      console.log(`Amount ${amount} exceeds balance`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount: amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }
  // static newTransaction(senderWallet, recipient, amount) {
  //   if (amount > senderWallet.balance) {
  //     //return/ faild the transaction
  //     console.log(`Amount: ${amount} exceeds balance.`);
  //     return;
  //   }
  //   const transaction = new this();
  //   transaction.outputs.push(
  //     ...[
  //       {
  //         amount: senderWallet.balance - amount,
  //         address: senderWallet.publicKey,
  //       },
  //       { amount: amount, address: recipient },
  //     ]
  //   );
  //   Transaction.signTransaction(transaction, senderWallet);
  //   return transaction;
  // }

  static newTransaction(senderWallet, recipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`Amount : ${amount} exceeds the balance`);
      return;
    }
    return Transaction.transactionWithOutputs(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey,
      },
      { amount: amount, address: recipient },
    ]);
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(chainUtil.hash(transaction.outputs)),
    };
  }

  static verifyTransaction(transaction) {
    return chainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      chainUtil.hash(transaction.outputs)
    );
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey,
      },
    ]);
  }
}


module.exports = Transaction;
