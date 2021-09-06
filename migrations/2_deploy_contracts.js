/* eslint-disable no-undef */
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
await deployer.deploy(Token); //Deploy token//
 const token = await Token.deployed();

await deployer.deploy(EthSwap, token.address);//Deploy EthSwap//
 const ethSwap = await EthSwap.deployed();
 //Transfer all the tokens to the smart contrat address//
 await token.transfer(ethSwap.address,'1000000000000000000000000');
};
