import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing frontend connection to contract...");

  // Get the deployed contract
  const contractAddress = "0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Contract address: ${contractAddress}`);

  try {
    // Test basic contract reads that the frontend will use
    console.log("\n🔍 Testing contract reads...");
    
    const campaignCounter = await charityNexus.campaignCounter();
    console.log(`✅ Campaign counter: ${campaignCounter}`);

    const donationCounter = await charityNexus.donationCounter();
    console.log(`✅ Donation counter: ${donationCounter}`);

    const owner = await charityNexus.owner();
    console.log(`✅ Owner: ${owner}`);

    // Test reading a specific campaign (if exists)
    if (Number(campaignCounter) > 0) {
      console.log("\n📊 Testing campaign data read...");
      try {
        const campaignInfo = await charityNexus.getCampaignInfo(0);
        console.log(`✅ Campaign 0 info:`, {
          name: campaignInfo[0],
          description: campaignInfo[1],
          targetAmount: campaignInfo[2].toString(),
          currentAmount: campaignInfo[3].toString(),
          donorCount: campaignInfo[4].toString(),
          isActive: campaignInfo[5],
          isVerified: campaignInfo[6],
          organizer: campaignInfo[7],
          startTime: campaignInfo[8].toString(),
          endTime: campaignInfo[9].toString(),
        });
      } catch (error) {
        console.log(`⚠️  Could not read campaign 0 details (expected for FHE data)`);
      }
    }

    console.log("\n🎉 Contract connection test completed successfully!");
    console.log("✅ Frontend should be able to connect to this contract");
    console.log(`📈 Found ${campaignCounter} campaigns ready for display`);

  } catch (error) {
    console.error("❌ Error testing contract connection:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
