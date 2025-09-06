import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Debugging campaign 0...");
  
  const contractAddress = "0x24B7B02B50e052d790A13B6488324bfa073da643";
  const provider = ethers.provider;
  const signers = await ethers.getSigners();
  
  if (signers.length === 0) {
    console.log("❌ No signers available");
    return;
  }
  
  const signer = signers[0];
  console.log(`👤 Using account: ${signer.address}`);
  
  try {
    // Get contract instance
    const contract = await ethers.getContractAt("CharityNexus", contractAddress, signer);
    
    // Check campaign 0 info in detail
    console.log("📋 Checking campaign 0 in detail...");
    const campaignInfo = await contract.getCampaignInfo(0);
    
    console.log("Campaign 0 details:", {
      name: campaignInfo[0],
      description: campaignInfo[1],
      targetAmount: campaignInfo[2].toString(),
      currentAmount: campaignInfo[3].toString(),
      donorCount: campaignInfo[4].toString(),
      isActive: campaignInfo[5],
      isVerified: campaignInfo[6],
      organizer: campaignInfo[7],
      startTime: new Date(Number(campaignInfo[8]) * 1000).toISOString(),
      endTime: new Date(Number(campaignInfo[9]) * 1000).toISOString()
    });
    
    // Check current time
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = Number(campaignInfo[9]);
    console.log(`Current time: ${currentTime}`);
    console.log(`End time: ${endTime}`);
    console.log(`Time remaining: ${endTime - currentTime} seconds`);
    console.log(`Campaign ended: ${currentTime > endTime}`);
    
    // Check if organizer is zero address
    console.log(`Organizer is zero address: ${campaignInfo[7] === "0x0000000000000000000000000000000000000000"}`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Debug failed:", error);
    process.exit(1);
  });
