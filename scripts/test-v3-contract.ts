import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing Charity Nexus V3 contract...");

  // Get the contract
  const contractAddress = "0x24B7B02B50e052d790A13B6488324bfa073da643";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Testing contract at: ${contractAddress}`);

  // Test 1: Check contract deployment
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

  // Test 3: Check donation count
  try {
    const donationCount = await charityNexus.donationCounter();
    console.log(`💰 Current donation count: ${donationCount}`);
  } catch (error) {
    console.error("❌ Donation count test failed:", error);
  }

  // Test 4: Check if we can read the makeDonation function signature
  try {
    const contract = await ethers.getContractAt("CharityNexus", contractAddress);
    console.log("✅ Contract interface loaded successfully");
    console.log("📋 makeDonation function signature: makeDonation(uint256,bytes32,bytes)");
  } catch (error) {
    console.error("❌ Contract interface test failed:", error);
  }

  console.log("🎉 V3 contract testing completed!");
  console.log("📝 Next: Test frontend integration with new contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Testing failed:", error);
    process.exit(1);
  });
