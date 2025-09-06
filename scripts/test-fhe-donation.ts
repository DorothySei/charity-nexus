import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing FHE donation with correct format...");
  
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
    
    if (!isActive || currentTime > endTime) {
      console.log("❌ Campaign is not available for donations");
      return;
    }
    
    // Try to make a donation with FHE format
    console.log("💝 Attempting FHE donation...");
    const donationAmount = 1; // Small amount for testing
    const weiAmount = ethers.parseEther("0.001"); // 0.001 ETH
    
    // Create FHE data format (bytes32)
    const fheAmountBytes = "0x" + donationAmount.toString(16).padStart(64, '0');
    console.log("FHE amount bytes:", fheAmountBytes);
    
    try {
      const tx = await contract.makeDonation(0, fheAmountBytes, { value: weiAmount });
      console.log("✅ FHE Donation transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("✅ FHE Donation confirmed in block:", receipt?.blockNumber);
      
    } catch (error: any) {
      console.error("❌ FHE Donation failed:", error.message);
      
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
