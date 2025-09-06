import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking all donations in contract...");

  // Get the contract
  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Contract address: ${contractAddress}`);

  try {
    // Check donation counter
    const donationCounter = await charityNexus.donationCounter();
    console.log(`💰 Total donations: ${donationCounter}`);

    // Read all donations
    for (let i = 0; i < Number(donationCounter); i++) {
      console.log(`\n💰 Donation ${i}:`);
      const donation = await charityNexus.donations(i);
      console.log(`   - Donor: ${donation.donor}`);
      console.log(`   - Timestamp: ${new Date(Number(donation.timestamp) * 1000).toISOString()}`);
      console.log(`   - Amount (encrypted): ${donation.amount}`);
    }

    console.log("\n✅ Donation check complete!");

  } catch (error) {
    console.error("❌ Donation check failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
