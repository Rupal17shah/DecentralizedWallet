const HTTP_PORT = process.env.HTTP_PORT || 3001;
const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pserver = require("../p2p-server");
const p2pserver = new P2pserver(Blockchain);

require('dotenv').config();

const app = express();
app.use(bodyParser.json());


const blockchain = new Blockchain();

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);


    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => {
    console.log(`listening on port ${HTTP_PORT}`);
})


p2pserver.listen();
// this starts the server

