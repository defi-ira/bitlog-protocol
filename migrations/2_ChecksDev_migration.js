var ChecksDev = artifacts.require("ChecksDev");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(
    ChecksDev, 
    "checks dev", 
    "CDEV", 
    "https://checks.dev/",
    0,
    0
  );
};