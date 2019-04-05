const contract = require('truffle-contract');
var _ = require('lodash');
const ethers = require('ethers');
const iov = require('../build/contracts/Iov.json');
const user = require('../build/contracts/User.json');
var Iov = contract(iov);
var User = contract(user);

//var provider = new Web3.providers.HttpProvider("http://localhost:7545");
//console.log(iov);

App = {
  renderAdmin: function() {
    var self = this;
    Iov.setProvider(self.web3.currentProvider);

    // Load account data
    return new Promise(function(resolve, reject) {
      resolve(self.web3.eth.accounts[0]);
    });
  },

 renderAccount: function(index) {
    var self = this;
    var iovInstance;
    //console.log(account);

    Iov.setProvider(self.web3.currentProvider);
    //console.log('the account ' + account);

    return new Promise(function(resolve, reject) {

    Iov.deployed().then((instance) => {
      //console.log(instance);
      iovInstance = instance;
      //console.log(iovInstance.vehicleCount());
      return iovInstance.vehicleArray(index);
    }).then((result) => {
      //console.log(result);
      resolve(result);
    }).catch((err) => {
      reject(err.message);
    })
  });
  },

  renderName: function(index) {
  var self = this;
  var iovInstance;
  //console.log(account);

  Iov.setProvider(self.web3.currentProvider);
  User.setProvider(self.web3.currentProvider);
  //console.log('the account ' + account);

  return new Promise(function(resolve, reject) {

  Iov.deployed().then((instance) => {
    //console.log(instance);
    iovInstance = instance;
    //console.log(iovInstance.vehicleCount());
    return iovInstance.vehicleArray(index);
    }).then((result) => {
      //console.log(result);
      User.at(result).then((instance) => {
      name = instance;
      return name.name();
    }).then((result) => {
      resolve(result);
    }).catch((err) => {
      reject(err.message);
    })
  });
});
},

renderTrustIndex: function(index) {
  var self = this;
  var iovInstance;
  //console.log(account);

  Iov.setProvider(self.web3.currentProvider);
  User.setProvider(self.web3.currentProvider);
  //console.log('the account ' + account);

  return new Promise(function(resolve, reject) {

  Iov.deployed().then((instance) => {
    //console.log(instance);
    iovInstance = instance;
    //console.log(iovInstance.vehicleCount());
    return iovInstance.vehicleArray(index);
    }).then((result) => {
      //console.log(result);
      User.at(result).then((instance) => {
      name = instance;
      return name.trustIndex();
    }).then((result) => {
      //console.log('trust Index ' + result);
      resolve(result);
    }).catch((err) => {
      reject(err.message);
    })
  });
});
},

  renderAllAccounts: function() {
    var self = this;
    var iovInstance;

    Iov.setProvider(self.web3.currentProvider);

    return new Promise(function(resolve, reject) {
    Iov.deployed().then((instance) => {
      iovInstance = instance;
      //console.log(iovInstance.vehicleCount());
      return iovInstance.vehicleCount();
    }).then((result) => {
      //console.log(result);
      resolve(result);
    }).catch((err) => {
      reject(err.message);
    })
  });
},



  addAccount: function(_IP,_name) {
    var self = this;
    var iovInstance ;
    //console.log(_admin);
    //console.log(_name);
    console.log(_IP);

    Iov.setProvider(self.web3.currentProvider);
    //User.setProvider(self.web3.currentProvider);
    console.log('cccccc ' + self.web3.eth.accounts[0]);

    return new Promise(function(resolve, reject) {
      Iov.deployed().then((instance) => {
        iovInstance = instance;
        return iovInstance;
        //return await iovInstance.addVehicle("0xf364689b868471726ACd0005F82e9f3fd10d2f4",_name);
      }).then((res) => {
        return iovInstance.addVehicle(self.web3.eth.accounts[0], _name, {from: self.web3.eth.accounts[0]});
      }).then((count) => {
        resolve(count);
      }).catch((err) => {
        reject(err);
      })
    });
  },

  deleteAccount: function(_id) {
    var self = this;
    var iovInstance;

    Iov.setProvider(self.web3.currentProvider);

    return new Promise(function(resolve, reject) {
      Iov.deployed().then((instance) => {
        iovInstance = instance;
        return iovInstance;
      }).then((res) => {
        return iovInstance.deleteVehicle(_id, {from: self.web3.eth.accounts[0]});
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    });
  },

  /*function catchEvent() {
    return new Promise(function(resolve, reject) {

    });
  }*/
}



module.exports = App;