import { ethers } from "hardhat";
import { createInstance } from "@fhevm/sdk/node";
import { JsonRpcProvider } from "ethers";

async function main() {
  console.log("🧪 Testing FHE encryption with SDK...");
  
  const contractAddress = "0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F";
  const provider = new JsonRpcProvider("https://1rpc.io/sepolia");
  const signers = await ethers.getSigners();
  
  if (signers.length === 0) {
    console.log("❌ No signers available");
    return;
  }
  
  const signer = signers[0];
  console.log(`👤 Using account: ${signer.address}`);
  
  try {
    // Create FHEVM instance
    console.log("🔐 Creating FHEVM instance...");
    const fhevm = await createInstance({
      verifyingContractAddress: "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4", // Sepolia InputVerifier
      kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC", // Sepolia KMS
      aclContractAddress: "0x687820221192C5B662b25367F70076A37bc79b6c", // Sepolia ACL
      gatewayChainId: 11155111, // Sepolia
      chainId: 11155111,
      network: "https://1rpc.io/sepolia",
      publicKey: {
        data: null,
        id: null,
      },
    });
    
    // Create encrypted input
    console.log("🔒 Creating encrypted input...");
    const donationAmount = 1; // Small amount for testing
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signer.address)
      .add8(donationAmount)
      .encrypt();
    
    console.log("✅ Encrypted input created:", {
      data: encryptedInput.data,
      proof: encryptedInput.proof ? "Present" : "Not present"
    });
    
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
    
    // Try to make a donation with encrypted data
    console.log("💝 Attempting FHE donation...");
    const weiAmount = ethers.parseEther("0.001"); // 0.001 ETH
    
    try {
      const tx = await contract.makeDonation(0, encryptedInput.data, { value: weiAmount });
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
