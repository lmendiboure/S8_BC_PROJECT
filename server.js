const http = require('http');
const app = require('./app');
var Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const truffleContract = require('./connection/app.js');

const port = 3001;

const server = http.createServer(app);

server.listen(port, () => {
    truffleContract.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
});
