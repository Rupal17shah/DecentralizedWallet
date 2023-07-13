
const Transaction = require('./transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(
      (t) => t.id === transaction.id
    );
    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] =
        transaction;
    } else {
      console.log("Transaction added to the pool");
      this.transactions.push(transaction);
      console.log(this.transactions[0].outputs);
    }
  }
  
  existingTransaction(address) {
    return this.transactions.find((t) => t.input.address === address);
  }

  // validates transactions

  validTransactions() {
    return this.transactions.filter((transaction) => {
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      // console.log(output.amount);
      // console.log(outputTotal);
      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}`);
        return;
      }
      return transaction;
    });
  }

  clear() {
    this.transactions = [];
  }
}
module.exports = TransactionPool;
