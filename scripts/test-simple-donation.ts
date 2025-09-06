import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing simple donation...");
  
  const contractAddress = "0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F";
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
    
    // Check campaign 0 info
    console.log("📋 Checking campaign 0...");
    const campaignInfo = await contract.getCampaignInfo(0);
    console.log("Campaign 0 info:", {
      name: campaignInfo[0],
      isActive: campaignInfo[5],
      endTime: new Date(Number(campaignInfo[9]) * 1000).toISOString()
    });
    
    // Check if campaign is active and not ended
    const isActive = campaignInfo[5];
    const endTime = Number(campaignInfo[9]);
    const currentTime = Math.floor(Date.now() / 1000);
    
    console.log(`Campaign active: ${isActive}`);
    console.log(`End time: ${endTime}, Current time: ${currentTime}`);
    console.log(`Campaign ended: ${currentTime > endTime}`);
    
    if (!isActive) {
      console.log("❌ Campaign is not active");
      return;
    }
    
    if (currentTime > endTime) {
      console.log("❌ Campaign has ended");
      return;
    }
    
    // Try to make a small donation
    console.log("💝 Attempting donation...");
    const donationAmount = 1; // Small amount for testing
    const weiAmount = ethers.parseEther("0.001"); // 0.001 ETH
    
    try {
      const tx = await contract.makeDonation(0, donationAmount, { value: weiAmount });
      console.log("✅ Donation transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("✅ Donation confirmed in block:", receipt?.blockNumber);
      
    } catch (error: any) {
      console.error("❌ Donation failed:", error.message);
      
      // Try to get more details about the error
      if (error.data) {
        console.log("Error data:", error.data);
      }
      if (error.reason) {
        console.log("Error reason:", error.reason);
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
