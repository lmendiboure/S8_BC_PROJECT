var Iov = artifacts.require("./contracts/Iov.sol");
var User = artifacts.require("./contracts/User.sol");


module.exports = function(deployer) {
  deployer.deploy(Iov);
};
