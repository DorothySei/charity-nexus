import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing donation function...");
  
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
    
    // Check campaign info
    console.log("📋 Checking campaign 0...");
    const campaignInfo = await contract.getCampaignInfo(0);
    console.log("Campaign info:", {
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
