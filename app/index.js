const HTTP_PORT = process.env.HTTP_PORT || 3001;
const express = require("express");
const Blockchain = require("../blockchain");
const bodyParser = require("body-parser");
const P2pserver = require("../p2p-server");
const Wallet = require("../wallet");
const Miner = require("./miner");
const TransactionPool = require("../wallet/transaction-pool");
const {
  signupUser,
  loginUser,
  logoutUser,
} = require("../controller/userController");

// class instances
const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2pserver = new P2pserver(blockchain, transactionPool);
const miner = new Miner(blockchain, transactionPool, wallet, p2pserver);
const app = express();
connectDB = require("../database/db");
app.use(bodyParser.json());
require("dotenv").config();
connectDB();

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
  console.log("blockchain", blockchain.chain);
});

app.post("/mine", (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  res.redirect("/blocks");
  p2pserver.syncChain();
});

//get end point for transactions
app.get("/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});
//post end point for transactions
app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  console.log("recipient", recipient);
  const transaction = wallet.createTransaction(
    recipient,
    amount,
    transactionPool,
    blockchain
  );
  p2pserver.broadcastTransaction(transaction);
  console.log("transaction", transaction);
  res.redirect("/transactions");
});

app.get("/publicKey", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.get("/mineTransactions", (req, res) => {
  const block = miner.mine();
  if (block == null) res.json({ message: "No transactions to mine" });
  else {
    console.log(`New block added: ${block.toString()}`);
    // res.redirect("/blocks");
    res.redirect("/balance");
  }
});

app.get("/balance", (req, res) => {
  const balance = wallet.calculateBalance(blockchain);
  console.log("balance", wallet.balance);
  res.send({ balance: balance });
});

// signup and login api

app.post("/signup", signupUser);
app.post("/login", loginUser);
app.get("/logout", logoutUser);

//listening app
app.listen(HTTP_PORT, () => {
  console.log(`listening on port ${HTTP_PORT}`);
});
// listening socket
p2pserver.listen();
