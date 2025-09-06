// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CharityNexus is SepoliaConfig {
    using FHE for *;
    
    struct CharityCampaign {
        euint8 campaignId;
        euint8 targetAmount;
        euint8 currentAmount;
        euint8 donorCount;
        bool isActive;
        bool isVerified;
        string name;
        string description;
        address organizer;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Donation {
        euint8 donationId;
        euint8 amount;
        address donor;
        uint256 timestamp;
    }
    
    struct ImpactReport {
        euint8 reportId;
        euint8 beneficiariesReached;
        euint8 fundsUtilized;
        bool isVerified;
        string reportHash;
        address reporter;
        uint256 timestamp;
    }
    
    mapping(uint256 => CharityCampaign) public campaigns;
    mapping(uint256 => Donation) public donations;
    mapping(uint256 => ImpactReport) public impactReports;
    mapping(address => euint8) public donorReputation;
    mapping(address => euint8) public charityReputation;
    
    uint256 public campaignCounter;
    uint256 public donationCounter;
    uint256 public reportCounter;
    
    address public owner;
    address public verifier;
    
    event CampaignCreated(uint256 indexed campaignId, address indexed organizer, string name);
    event DonationMade(uint256 indexed donationId, uint256 indexed campaignId, address indexed donor, uint8 amount);
    event ImpactReported(uint256 indexed reportId, uint256 indexed campaignId, address indexed reporter);
    event CampaignVerified(uint256 indexed campaignId, bool isVerified);
    event ReputationUpdated(address indexed user, uint8 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createCampaign(
        string memory _name,
        string memory _description,
        euint8 _targetAmount,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Campaign name cannot be empty");
        require(_duration > 0, "Duration must be positive");
        
        uint256 campaignId = campaignCounter++;
        
        campaigns[campaignId] = CharityCampaign({
            campaignId: FHE.asEuint8(0), // Will be set properly later
            targetAmount: _targetAmount,
            currentAmount: FHE.asEuint8(0),
            donorCount: FHE.asEuint8(0),
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
        euint8 amount
    ) public payable returns (uint256) {
        require(campaigns[campaignId].organizer != address(0), "Campaign does not exist");
        require(campaigns[campaignId].isActive, "Campaign is not active");
        require(block.timestamp <= campaigns[campaignId].endTime, "Campaign has ended");
        
        uint256 donationId = donationCounter++;
        
        donations[donationId] = Donation({
            donationId: FHE.asEuint8(0), // Will be set properly later
            amount: amount,
            donor: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update campaign totals
        campaigns[campaignId].currentAmount = FHE.add(campaigns[campaignId].currentAmount, amount);
        campaigns[campaignId].donorCount = FHE.add(campaigns[campaignId].donorCount, FHE.asEuint8(1));
        
        emit DonationMade(donationId, campaignId, msg.sender, 0); // Amount will be decrypted off-chain
        return donationId;
    }
    
    function submitImpactReport(
        uint256 campaignId,
        euint8 beneficiariesReached,
        euint8 fundsUtilized,
        string memory reportHash
    ) public returns (uint256) {
        require(campaigns[campaignId].organizer == msg.sender, "Only organizer can submit report");
        require(campaigns[campaignId].isActive, "Campaign must be active");
        
        uint256 reportId = reportCounter++;
        
        impactReports[reportId] = ImpactReport({
            reportId: FHE.asEuint8(0), // Will be set properly later
            beneficiariesReached: beneficiariesReached,
            fundsUtilized: fundsUtilized,
            isVerified: false,
            reportHash: reportHash,
            reporter: msg.sender,
            timestamp: block.timestamp
        });
        
        emit ImpactReported(reportId, campaignId, msg.sender);
        return reportId;
    }
    
    function verifyCampaign(uint256 campaignId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify campaigns");
        require(campaigns[campaignId].organizer != address(0), "Campaign does not exist");
        
        campaigns[campaignId].isVerified = isVerified;
        emit CampaignVerified(campaignId, isVerified);
    }
    
    function updateReputation(address user, euint8 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Determine if user is donor or charity based on context
        if (donations[donationCounter - 1].donor == user) {
            donorReputation[user] = reputation;
        } else {
            charityReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getCampaignInfo(uint256 campaignId) public view returns (
        string memory name,
        string memory description,
        uint8 targetAmount,
        uint8 currentAmount,
        uint8 donorCount,
        bool isActive,
        bool isVerified,
        address organizer,
        uint256 startTime,
        uint256 endTime
    ) {
        CharityCampaign storage campaign = campaigns[campaignId];
        return (
            campaign.name,
            campaign.description,
            0, // FHE.decrypt(campaign.targetAmount) - will be decrypted off-chain
            0, // FHE.decrypt(campaign.currentAmount) - will be decrypted off-chain
            0, // FHE.decrypt(campaign.donorCount) - will be decrypted off-chain
            campaign.isActive,
            campaign.isVerified,
            campaign.organizer,
            campaign.startTime,
            campaign.endTime
        );
    }
    
    function getDonationInfo(uint256 donationId) public view returns (
        uint8 amount,
        address donor,
        uint256 timestamp
    ) {
        Donation storage donation = donations[donationId];
        return (
            0, // FHE.decrypt(donation.amount) - will be decrypted off-chain
            donation.donor,
            donation.timestamp
        );
    }
    
    function getImpactReportInfo(uint256 reportId) public view returns (
        uint8 beneficiariesReached,
        uint8 fundsUtilized,
        bool isVerified,
        string memory reportHash,
        address reporter,
        uint256 timestamp
    ) {
        ImpactReport storage report = impactReports[reportId];
        return (
            0, // FHE.decrypt(report.beneficiariesReached) - will be decrypted off-chain
            0, // FHE.decrypt(report.fundsUtilized) - will be decrypted off-chain
            report.isVerified,
            report.reportHash,
            report.reporter,
            report.timestamp
        );
    }
    
    function getDonorReputation(address donor) public view returns (uint8) {
        return 0; // FHE.decrypt(donorReputation[donor]) - will be decrypted off-chain
    }
    
    function getCharityReputation(address charity) public view returns (uint8) {
        return 0; // FHE.decrypt(charityReputation[charity]) - will be decrypted off-chain
    }
    
    function withdrawFunds(uint256 campaignId) public {
        require(campaigns[campaignId].organizer == msg.sender, "Only organizer can withdraw");
        require(campaigns[campaignId].isVerified, "Campaign must be verified");
        require(block.timestamp > campaigns[campaignId].endTime, "Campaign must be ended");
        
        // Transfer funds to organizer
        // Note: In a real implementation, funds would be transferred based on decrypted amount
        campaigns[campaignId].isActive = false;
        
        // For now, we'll transfer a placeholder amount
        // payable(msg.sender).transfer(amount);
    }
}
