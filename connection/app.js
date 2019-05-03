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

  renderLastAccount: function() {
    var self = this;
    var iovInstance;
    //console.log(account);

    Iov.setProvider(self.web3.currentProvider);
    //console.log('the account ' + account);

    return new Promise(function(resolve, reject) {

    Iov.deployed().then((instance) => {
      //console.log(instance);
      iovInstance = instance;
      return iovInstance.vehicleCount();
      //console.log(iovInstance.vehicleCount());
      //return iovInstance.vehicleArray(vehicleCount());
    }).then((result) => {
      //console.log(result);
      return iovInstance.vehicleArray(result);
    }).then((result) => {
      resolve(result);
    }).catch((err) => {
      reject(err.message);
    })
  });
  },

  renderName: function(index) {
  var self = this;
  var iovInstance;

  Iov.setProvider(self.web3.currentProvider);
  User.setProvider(self.web3.currentProvider);

  return new Promise(function(resolve, reject) {

  Iov.deployed().then((instance) => {
    iovInstance = instance;
    return iovInstance.vehicleArray(index);
    }).then((result) => {
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


renderImmatriculation: function(index) {
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
      immatriculation = instance;
      return immatriculation.immatriculation();
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

renderAddressIP: function(index) {
    var self = this;
  var iovInstance;

  Iov.setProvider(self.web3.currentProvider);
  User.setProvider(self.web3.currentProvider);

  return new Promise(function(resolve, reject) {

  Iov.deployed().then((instance) => {
    iovInstance = instance;
    return iovInstance.getAddressIPById(index);
    }).then((result) => {
     // console.log('IP' + result);
      resolve(result);
    }).catch((err) => {
      reject(err.message);
    })
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

  addAccount: function(_IP, _name) {
    var self = this;
    var iovInstance ;
    //console.log(_admin);
    //console.log(_name);
    //console.log(_IP);

    Iov.setProvider(self.web3.currentProvider);
    //User.setProvider(self.web3.currentProvider);
    //console.log('cccccc ' + self.web3.eth.accounts[0]);

    return new Promise(function(resolve, reject) {
      Iov.deployed().then((instance) => {
        iovInstance = instance;
        return iovInstance;
      }).then((res) => {
        return iovInstance.addVehicle(self.web3.eth.accounts[0], _name,self.web3.eth.accounts[1],_IP,{from: self.web3.eth.accounts[0]});
      }).then((count) => {
        resolve(count);
      }).catch((err) => {
        reject(err);
      })
    });
  },

 addAddressTolist: function(_id,_IP) {
    var self = this;
    var iovInstance ;

    Iov.setProvider(self.web3.currentProvider);

    return new Promise(function(resolve, reject) {
      Iov.deployed().then((instance) => {
        iovInstance = instance;
        return iovInstance;
      }).then((res) => {
        return iovInstance.addAddressIPtolist(_id,_IP,{from: self.web3.eth.accounts[1]});
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

  changeName: function(index, name) {
    var self = this;
    var iovInstance;
    index++;
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
        return name.changeName(name.toString(), {from: self.web3.eth.accounts[index]});
      }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err.message);
      })
    });
  });
  },
  
  changeImmatriculation: function(index, immatriculation) {
    var self = this;
    var iovInstance;
    //console.log(account);
    index++;
    console.log("index " + index);
  
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
        immatriculation = instance;
        return immatriculation.changeImmatriculation(immatriculation.toString(), {from: self.web3.eth.accounts[index]});
      }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err.message);
      })
    });
  });
  },

 
getsendrights: function(_id,_IP) {
    var self = this;
    var iovInstance;

    Iov.setProvider(self.web3.currentProvider);

    return new Promise(function(resolve, reject) {
      Iov.deployed().then((instance) => {
        iovInstance = instance;
        return iovInstance;
      }).then((res) => {
	//var id = iovInstance.getIdbyAdd({from: self.web3.eth.accounts[0]});
	var IP=String(_IP); 
        return iovInstance.getRightCanSendById(_id,IP);
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    });
  },


changerights: function(_idx,_idy,_value) {
    var self = this;
    var iovInstance;

    Iov.setProvider(self.web3.currentProvider);

    return new Promise(function(resolve, reject) {
      Iov.deployed().then((instance) => {
        iovInstance = instance;
        return iovInstance;
      }).then((res) => {
        return iovInstance.changeRightCanSendByid(self.web3.eth.accounts[0],_idx,_value,_idy,{from: self.web3.eth.accounts[0]});
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    });
  },

/*
  function catchEvent() {
    return new Promise(function(resolve, reject) {

    });
  }*/
}



module.exports = App;
