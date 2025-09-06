import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Creating test campaign in V3 contract...");

  // Get the contract
  const contractAddress = "0x24B7B02B50e052d790A13B6488324bfa073da643";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Creating campaign in contract: ${contractAddress}`);

  // Get signers
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  console.log(`👤 Using account: ${deployer.address}`);

  try {
    // Create a test campaign using the correct function signature
    console.log("📝 Creating test campaign...");
    const tx = await charityNexus.createCampaign(
      "Test Campaign for FHE V3", // _name
      "This is a test campaign to verify FHE V3 functionality", // _description
      ethers.parseEther("10.0"), // _targetAmount (10 ETH)
      86400 * 30 // _duration (30 days in seconds)
    );

    console.log("⏳ Waiting for transaction confirmation...");
    await tx.wait();
    console.log("✅ Test campaign created successfully!");

    // Check campaign count
    const campaignCount = await charityNexus.campaignCounter();
    console.log(`📊 Campaign count after creation: ${campaignCount}`);

    // Verify campaign details
    const campaign = await charityNexus.campaigns(0);
    console.log(`📋 Campaign 0 details:`);
    console.log(`   - Name: ${campaign.name}`);
    console.log(`   - Description: ${campaign.description}`);
    console.log(`   - Target: ${ethers.formatEther(campaign.targetAmount)} ETH`);
    console.log(`   - Active: ${campaign.isActive}`);

  } catch (error) {
    console.error("❌ Campaign creation failed:", error);
  }

  console.log("🎉 Test campaign creation completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
