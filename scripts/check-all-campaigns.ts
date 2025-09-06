import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking all campaigns in contract...");

  // Get the contract
  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Contract address: ${contractAddress}`);

  try {
    // Check campaign counter
    const campaignCounter = await charityNexus.campaignCounter();
    console.log(`📊 Total campaigns: ${campaignCounter}`);

    // Read all campaigns
    for (let i = 0; i < Number(campaignCounter); i++) {
      console.log(`\n📋 Campaign ${i}:`);
      const campaign = await charityNexus.campaigns(i);
      console.log(`   - Name: "${campaign.name}"`);
      console.log(`   - Description: "${campaign.description}"`);
      console.log(`   - Creator: ${campaign.creator}`);
      console.log(`   - Active: ${campaign.isActive}`);
      console.log(`   - Verified: ${campaign.isVerified}`);
      console.log(`   - Start Time: ${new Date(Number(campaign.startTime) * 1000).toISOString()}`);
      console.log(`   - End Time: ${new Date(Number(campaign.endTime) * 1000).toISOString()}`);
    }

    console.log("\n✅ Campaign check complete!");

  } catch (error) {
    console.error("❌ Campaign check failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
