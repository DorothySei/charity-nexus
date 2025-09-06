import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing new Charity Nexus contract with externalEuint32 support...");

  // Get the contract
  const contractAddress = "0x24B7B02B50e052d790A13B6488324bfa073da643";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Testing contract at: ${contractAddress}`);

  // Test 1: Check if contract is deployed correctly
  try {
    const verifier = await charityNexus.verifier();
    console.log(`✅ Contract deployed successfully. Verifier: ${verifier}`);
  } catch (error) {
    console.error("❌ Contract deployment test failed:", error);
    return;
  }

  // Test 2: Check campaign count
  try {
    const campaignCount = await charityNexus.campaignCounter();
    console.log(`📊 Current campaign count: ${campaignCount}`);
  } catch (error) {
    console.error("❌ Campaign count test failed:", error);
  }

  // Test 3: Check if we can read campaigns
  try {
    const campaign = await charityNexus.campaigns(0);
    console.log(`📋 Campaign 0 exists: ${campaign.isActive}`);
  } catch (error) {
    console.error("❌ Campaign read test failed:", error);
  }

  console.log("🎉 Contract testing completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Testing failed:", error);
    process.exit(1);
  });
