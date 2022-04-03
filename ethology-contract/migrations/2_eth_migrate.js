const Ethology = artifacts.require("Ethology");

module.exports = function (deployer) {
  deployer.deploy(Ethology);
};