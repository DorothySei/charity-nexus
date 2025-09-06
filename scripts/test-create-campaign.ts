import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing campaign creation in new contract...");

  // Get the contract
  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Testing contract at: ${contractAddress}`);

  // Get signers
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  console.log(`👤 Using account: ${deployer.address}`);

  try {
    // Create a test campaign
    console.log("📝 Creating test campaign...");
    const tx = await charityNexus.createCampaign(
      "Test Campaign V4", // _name
      "This is a test campaign to verify V4 functionality", // _description
      ethers.parseEther("10.0"), // _targetAmount (10 ETH in wei)
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
