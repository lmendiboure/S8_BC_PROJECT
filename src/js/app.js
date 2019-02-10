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

  addApplication : function() {
    
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

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
