import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking contract status...");

  // Get the deployed contract
  const contractAddress = "0x24B7B02B50e052d790A13B6488324bfa073da643";
  
  // Get provider and signer
  const provider = ethers.provider;
  const signers = await ethers.getSigners();
  
  if (signers.length === 0) {
    console.log("❌ No signers available");
    return;
  }
  
  const signer = signers[0];

  console.log(`📋 Contract address: ${contractAddress}`);
  console.log(`👤 Using account: ${signer.address}`);

  try {
    // Check if contract exists by calling a simple function
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("❌ Contract not found at address");
      return;
    }
    
    console.log("✅ Contract found at address");

    // Try to read basic contract data using direct calls
    const campaignCounterData = await provider.call({
      to: contractAddress,
      data: "0xfca604d7" // campaignCounter() function selector
    });
    
    if (campaignCounterData && campaignCounterData !== "0x") {
      const campaignCount = parseInt(campaignCounterData, 16);
      console.log(`📈 Campaign counter: ${campaignCount}`);
      console.log("✅ Contract is working and has data!");
      console.log(`🎯 Found ${campaignCount} campaigns in the contract`);
    } else {
      console.log("⚠️  Could not read campaign counter (may be FHE encrypted)");
    }

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
