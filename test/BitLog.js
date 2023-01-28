const { assert } = require("chai");
const { BN } = require('bn.js');

const BitLog = artifacts.require('BitLog');

contract('BitLot', (accounts) => {
    const [owner, user1, user2, user3, user4] = accounts;

    it('should accept new commits', async() => {
        const contractInstance = await BitLog.deployed();
        const commit = await contractInstance.addCommit(0xAD312, {from: user1});
        assert.equal(commit.receipt.status, true);
    });

    it('should get the commit id from the hash', async() => {
        const contractInstance = await BitLog.deployed();
        const commit = await contractInstance.addCommit(0xAD312, {from: user1});
        const hash = calculateHash(0, user1);
        const getCommitId = await contractInstance.getCommitId(hash);
        assert.equal(getCommitId, 0xAD312);
    });

    it('should get the commit time from the commit id', async() => {
        const contractInstance = await BitLog.deployed();

        const block = await web3.eth.getBlock("latest");
        const blockTimestamp = block.timestamp;

        const commit = await contractInstance.addCommit(0xAD312, {from: user1});
        const hash = calculateHash(0, user1);
        const getCommitId = await contractInstance.getCommitId(hash);
        const getCommitTime = await contractInstance.getCommitTime(getCommitId);
        assert.isAtLeast(
            parseInt(getCommitTime), 
            parseInt(blockTimestamp), 
            'commit time is greater than block before commit'
        );
    });

    it('should get the correct number of commits', async() => {
        const contractInstance = await BitLog.deployed();
        const commit1 = await contractInstance.addCommit(0xAD312, {from: user3});
        const commit2 = await contractInstance.addCommit(0xFF34A, {from: user3});
        const commit3 = await contractInstance.addCommit(0x32B51, {from: user4});
        const user3NumCommits = await contractInstance.getNumCommits(user3);
        assert.equal(user3NumCommits, 2);
        const user4NumCommits = await contractInstance.getNumCommits(user4);
        assert.equal(user4NumCommits, 1);
    });

    function calculateHash(commitNumber, address) {
        return web3.utils.soliditySha3(
            {t: 'address', v: address},
            {t: 'uint256', v: new BN(commitNumber)},
        );
    }

});