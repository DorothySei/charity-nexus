import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking contract status...");

  // Get the deployed contract
  const contractAddress = "0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Contract address: ${contractAddress}`);

  try {
    // Check contract counters
    const campaignCounter = await charityNexus.campaignCounter();
    const donationCounter = await charityNexus.donationCounter();
    const reportCounter = await charityNexus.reportCounter();
    
    console.log(`📈 Campaign counter: ${campaignCounter}`);
    console.log(`💰 Donation counter: ${donationCounter}`);
    console.log(`📊 Report counter: ${reportCounter}`);

    // Check owner and verifier
    const owner = await charityNexus.owner();
    const verifier = await charityNexus.verifier();
    
    console.log(`👤 Owner: ${owner}`);
    console.log(`✅ Verifier: ${verifier}`);

    console.log("\n✅ Contract is working and has data!");
    console.log(`🎯 Found ${campaignCounter} campaigns in the contract`);

  } catch (error) {
    console.error("❌ Error checking contract:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Check failed:", error);
    process.exit(1);
  });
