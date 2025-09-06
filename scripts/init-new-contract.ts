import { ethers } from "hardhat";
import { FHE } from "@fhevm/solidity/lib/FHE.sol";

async function main() {
  console.log("🚀 Initializing new Charity Nexus contract with test data...");

  // Get the contract
  const contractAddress = "0x24B7B02B50e052d790A13B6488324bfa073da643";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Initializing contract at: ${contractAddress}`);

  // Get signers
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  console.log(`👤 Using account: ${deployer.address}`);

  try {
    // Create a test campaign
    console.log("📝 Creating test campaign...");
    const tx = await charityNexus.createCampaign(
      "Test Campaign for FHE", // _name
      "This is a test campaign to verify FHE functionality", // _description
      FHE.asEuint32(10000000), // _targetAmount (10 ETH in wei, but as euint32)
      86400 * 30 // _duration (30 days in seconds)
    );

    await tx.wait();
    console.log("✅ Test campaign created successfully!");

    // Check campaign count
    const campaignCount = await charityNexus.campaignCounter();
    console.log(`📊 Campaign count after creation: ${campaignCount}`);

    // Verify campaign details
    const campaign = await charityNexus.campaigns(0);
    console.log(`📋 Campaign 0 details:`);
    console.log(`   - Title: ${campaign.title}`);
    console.log(`   - Charity: ${campaign.charityName}`);
    console.log(`   - Target: ${ethers.formatEther(campaign.targetAmount)} ETH`);
    console.log(`   - Active: ${campaign.isActive}`);

  } catch (error) {
    console.error("❌ Campaign creation failed:", error);
  }

  console.log("🎉 Contract initialization completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  });
