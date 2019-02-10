var Iov = artifacts.require("./contracts/Iov.sol");

module.exports = function(deployer) {
  deployer.deploy(Iov);
};
