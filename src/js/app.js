App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by metamask
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Iov.json", function(iov) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Iov = TruffleContract(iov);
      // Connect provider to interact with contract
      App.contracts.Iov.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render : function() {
    var iovInstance;

     // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Iov.deployed().then(function(instance) {
      iovInstance = instance;
      return iovInstance.vehicleCount();
    }).then(function(vehicleCount) {
      for(var i = 1; i <= vehicleCount; i++) {
        iovInstance.vehicleArray(i).then(function(vehicle) {
          var id = vehicle[0];
          var name = vehicle[1];
          var trustIndex = vehicle[2];
          $('#vehiclesList').append('<li>' + id + " " + name + " " + trustIndex + '</li>');
        });
      }
    });

  },

  addVehicle : function() {
  	    // Add a vehicle
    App.contracts.Iov.deployed().then(function(instance) {
    	i = instance;
    	return i.addVehicle($('#inputName').val());
    }).then(function(variable) {
    	return i.vehicleCount();
    }).then(function(vehicleCount) {
        i.vehicleArray(vehicleCount).then(function(vehicle) {
          var id = vehicle[0];
          var name = vehicle[1];
          var trustIndex = vehicle[2];
          $('#vehiclesList').append('<li>' + id + " " + name + " " + trustIndex + '</li>');
        });    
  	});
  },

};


$(function() {
  $(window).load(function() {
    App.init();
  });
});