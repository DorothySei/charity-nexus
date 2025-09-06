import { ethers } from "ethers";

const CHARITY_NEXUS_ADDRESS = "0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F";
const SEPOLIA_RPC = "https://1rpc.io/sepolia";

async function checkCampaign0() {
  try {
    console.log("🔍 Checking campaign 0 status...");
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    
    // Function selector for getCampaignInfo(uint256)
    const functionSelector = ethers.id("getCampaignInfo(uint256)").slice(0, 10);
    
    // Encode campaign ID 0
    const campaignId = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [0]);
    
    // Create call data
    const callData = functionSelector + campaignId.slice(2);
    
    console.log("📞 Calling getCampaignInfo(0)...");
    const result = await provider.call({
      to: CHARITY_NEXUS_ADDRESS,
      data: callData,
    });
    
    if (result === "0x") {
      console.log("❌ Campaign 0 does not exist or call failed");
      return;
    }
    
    // Decode the result
    // getCampaignInfo returns: (string name, string description, uint32 targetAmount, uint32 currentAmount, uint32 donorCount, bool isActive, bool isVerified, address organizer, uint256 startTime, uint256 endTime)
    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
      ["string", "string", "uint32", "uint32", "uint32", "bool", "bool", "address", "uint256", "uint256"],
      result
    );
    
    const [name, description, targetAmount, currentAmount, donorCount, isActive, isVerified, organizer, startTime, endTime] = decoded;
    
    console.log("📊 Campaign 0 Info:");
    console.log("  - Name:", name);
    console.log("  - Description:", description);
    console.log("  - Target Amount:", targetAmount.toString());
    console.log("  - Current Amount:", currentAmount.toString());
    console.log("  - Donor Count:", donorCount.toString());
    console.log("  - Is Active:", isActive);
    console.log("  - Is Verified:", isVerified);
    console.log("  - Organizer:", organizer);
    console.log("  - Start Time:", new Date(Number(startTime) * 1000).toISOString());
    console.log("  - End Time:", new Date(Number(endTime) * 1000).toISOString());
    
    // Check if campaign is valid for donations
    const now = Math.floor(Date.now() / 1000);
    console.log("  - Current Time:", new Date(now * 1000).toISOString());
    console.log("  - Campaign Ended:", Number(endTime) < now);
    
    if (organizer === "0x0000000000000000000000000000000000000000") {
      console.log("❌ Campaign 0 does not exist (organizer is zero address)");
    } else if (!isActive) {
      console.log("❌ Campaign 0 is not active");
    } else if (Number(endTime) < now) {
      console.log("❌ Campaign 0 has ended");
    } else {
      console.log("✅ Campaign 0 is valid for donations");
    }
    
  } catch (error) {
    console.error("❌ Error checking campaign 0:", error);
  }
}

checkCampaign0();
