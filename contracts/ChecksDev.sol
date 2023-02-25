// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ChecksDev is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public baseUrl;

    mapping(address => uint256) private lastMint;
    mapping(uint256 => bool) private verified;
    mapping(uint256 => address) private viewing;
    mapping(uint256 => uint256) private mintTime;

    mapping(address => uint256) private commission;
    mapping(uint256 => string) private tokenUri;

    uint256 private protocolBalance;
    
    uint256 private protocolFee;
    uint256 private commissionFee;

    constructor(
        string memory name_, 
        string memory symbol_,
        string memory baseUrl_,
        uint256 protocolFee_,
        uint256 commissionFee_
        ) ERC721(name_, symbol_) {
            protocolFee = protocolFee_;
            commissionFee = commissionFee_;
            baseUrl = baseUrl_;
            protocolFee = 0;
    }

    function mintChecks(address viewing_, string calldata metadataUri_) payable public {
        if (msg.sender == viewing_ && lastMint[msg.sender] < block.timestamp - 1 days) {
        } else {
            require(msg.value >= (protocolFee + commissionFee), "insufficient ether");
        }
        uint256 earnedCommission = commissionFee + (msg.value - (protocolFee + commissionFee));
        commission[viewing_] += earnedCommission;
        protocolFee += (msg.value - earnedCommission);

        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        viewing[id] = viewing_;
        verified[id] = (viewing_ == msg.sender);
        mintTime[id] = block.timestamp;
        lastMint[msg.sender] = block.timestamp;
 
        _mint(msg.sender, id);
        _setTokenURI(id, metadataUri_);
    }

    function withhdrawCommission(address payable _to) external {
        _to.transfer(commission[_to]);
        protocolBalance = 0;
    }

    function withhdrawProtocolFees(address payable _to) external onlyOwner {
        _to.transfer(protocolBalance);
        protocolBalance = 0;
    }

    function setBaseUrl(string memory baseUrl_) external onlyOwner {
        baseUrl = baseUrl_;
    }

    function setProtocolFee(uint256 protocolFee_) external onlyOwner {
        protocolFee = protocolFee_;
    }

    function setCommissionFee(uint256 comissionFee_) external onlyOwner {
        commissionFee = comissionFee_;
    }

}