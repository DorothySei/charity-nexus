import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing contract connection and data loading...");

  // Get the contract
  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Testing contract at: ${contractAddress}`);

  try {
    // Test 1: Check campaign counter
    const campaignCounter = await charityNexus.campaignCounter();
    console.log(`📊 Campaign counter: ${campaignCounter}`);

    // Test 2: Check donation counter
    const donationCounter = await charityNexus.donationCounter();
    console.log(`💰 Donation counter: ${donationCounter}`);

    // Test 3: Check verifier
    const verifier = await charityNexus.verifier();
    console.log(`🔍 Verifier: ${verifier}`);

    // Test 4: Try to read a campaign (if any exist)
    if (Number(campaignCounter) > 0) {
      console.log("📋 Reading campaign 0...");
      const campaign = await charityNexus.campaigns(0);
      console.log(`   - Name: ${campaign.name}`);
      console.log(`   - Description: ${campaign.description}`);
      console.log(`   - Active: ${campaign.isActive}`);
    } else {
      console.log("📋 No campaigns found in contract");
    }

    console.log("✅ Contract connection test successful!");
    console.log("💡 The frontend should be able to load this data");

  } catch (error) {
    console.error("❌ Contract connection test failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
