// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract CharityNexusV2 is SepoliaConfig {
    using FHE for *;

    struct CharityCampaign {
        euint32 campaignId;
        euint32 targetAmount;
        euint32 currentAmount;
        euint32 donorCount;
        bool isActive;
        bool isVerified;
        string name;
        string description;
        address organizer;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Donation {
        euint32 donationId;
        euint32 amount;
        address donor;
        uint256 timestamp;
    }
    
    mapping(uint256 => CharityCampaign) public campaigns;
    mapping(uint256 => Donation) public donations;
    
    uint256 public campaignCounter;
    uint256 public donationCounter;
    
    address public owner;
    
    event CampaignCreated(uint256 indexed campaignId, address indexed organizer, string name);
    event DonationMade(uint256 indexed donationId, uint256 indexed campaignId, address indexed donor, uint32 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    function createCampaign(
        string memory _name,
        string memory _description,
        euint32 _targetAmount,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Campaign name cannot be empty");
        require(_duration > 0, "Duration must be positive");
        
        uint256 campaignId = campaignCounter++;
        
        campaigns[campaignId] = CharityCampaign({
            campaignId: FHE.asEuint32(0),
            targetAmount: _targetAmount,
            currentAmount: FHE.asEuint32(0),
            donorCount: FHE.asEuint32(0),
            isActive: true,
            isVerified: false,
            name: _name,
            description: _description,
            organizer: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration
        });
        
        emit CampaignCreated(campaignId, msg.sender, _name);
        return campaignId;
    }
    
    function makeDonation(
        uint256 campaignId,
        euint32 amount
    ) public payable returns (uint256) {
        require(campaigns[campaignId].organizer != address(0), "Campaign does not exist");
        require(campaigns[campaignId].isActive, "Campaign is not active");
        require(block.timestamp <= campaigns[campaignId].endTime, "Campaign has ended");
        
        uint256 donationId = donationCounter++;
        
        donations[donationId] = Donation({
            donationId: FHE.asEuint32(0),
            amount: amount,
            donor: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update campaign totals
        campaigns[campaignId].currentAmount = FHE.add(campaigns[campaignId].currentAmount, amount);
        campaigns[campaignId].donorCount = FHE.add(campaigns[campaignId].donorCount, FHE.asEuint32(1));
        
        emit DonationMade(donationId, campaignId, msg.sender, 0);
        return donationId;
    }
    
    function getCampaignCount() public view returns (uint256) {
        return campaignCounter;
    }
}
