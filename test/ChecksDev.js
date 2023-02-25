const { assert } = require("chai");
const { BN } = require('bn.js');
const web3 = require('web3');

const ChecksDev = artifacts.require('ChecksDev');

contract('ChecksDev', (accounts) => {
    const [owner, user1, user2, user3, user4, user5] = accounts;

    it('should mint new checks', async() => {
        const contractInstance = await ChecksDev.deployed();
        const mintedChecks = await contractInstance.mintChecks(
            "0xE9eAf0FD93B77AEE1c012E91B4a7653553949b7B", 
            "0x010001.json", 
            { from: user1 }
        );
        assert.equal(mintedChecks.receipt.status, true);
        const balance = await contractInstance.balanceOf(user1);
        assert.equal(balance, 1);
    });

    it('should mint new checks with protocol fee', async() => {
        const contractInstance = await ChecksDev.deployed();
        const markUpProtocolFee = await contractInstance.setProtocolFee(web3.utils.toWei(web3.utils.toBN(1), 'ether'));
        const mintedChecks = await contractInstance.mintChecks(
            "0xE9eAf0FD93B77AEE1c012E91B4a7653553949b7B", 
            "0x010001.json", 
            { from: user2, value: web3.utils.toBN(web3.utils.toWei(web3.utils.toBN(1), 'ether')) }
        );
        assert.equal(mintedChecks.receipt.status, true);
        const balance = await contractInstance.balanceOf(user2);
        assert.equal(balance, 1);
    });



});