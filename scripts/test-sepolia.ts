import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing Sepolia deployment...");

  // Get the deployed contract
  const contractAddress = "0x24B7B02B50e052d790A13B6488324bfa073da643";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Contract address: ${contractAddress}`);

  // Test basic contract functions
  try {
    // Get owner
    const owner = await charityNexus.owner();
    console.log(`👤 Owner: ${owner}`);

    // Get verifier
    const verifier = await charityNexus.verifier();
    console.log(`🔍 Verifier: ${verifier}`);

    // Get counters
    const campaignCounter = await charityNexus.campaignCounter();
    const donationCounter = await charityNexus.donationCounter();
    const reportCounter = await charityNexus.reportCounter();

    console.log(`📊 Campaign Counter: ${campaignCounter}`);
    console.log(`💰 Donation Counter: ${donationCounter}`);
    console.log(`📈 Report Counter: ${reportCounter}`);

    console.log("✅ Contract is working correctly on Sepolia!");
  } catch (error) {
    console.error("❌ Error testing contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
