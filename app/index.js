const HTTP_PORT = process.env.HTTP_PORT || 3001;
const express = require("express");
const Blockchain = require("../blockchain");
const bodyParser = require("body-parser");
const P2pserver = require("../p2p-server");
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');


require("dotenv").config();

const app = express();
app.use(bodyParser.json());


const blockchain = new Blockchain();
const p2pserver = new P2pserver(blockchain);
const wallet = new Wallet();
const transactionPool = new TransactionPool();


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
app.get('/transactions', (req, res) => {
    res.json(transactionPool.transactions);
})
//post end point for transactions
app.post('/create/transaction', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, transactionPool);
    p2pserver.syncChain();
    res.redirect('/transactions');
})




//listening app
app.listen(HTTP_PORT, () => {
    console.log(`listening on port ${HTTP_PORT}`);
});
// listening socket
p2pserver.listen();