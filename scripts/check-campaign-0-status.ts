import { ethers } from "ethers";

async function main() {
  console.log("🔍 Checking Campaign 0 status...");

  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Create a simple contract interface to read campaign data
  const contractABI = [
    "function campaigns(uint256) view returns (string memory name, string memory description, uint32 targetAmount, uint256 currentAmount, uint256 deadline, address organizer, bool isActive)"
  ];
  
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    console.log("📋 Checking Campaign 0...");
    const campaign0 = await (contract as any)['campaigns'](0);
    console.log("  - Name:", campaign0.name);
    console.log("  - Description:", campaign0.description);
    console.log("  - Target Amount:", campaign0.targetAmount.toString(), "cents");
    console.log("  - Current Amount:", ethers.formatEther(campaign0.currentAmount), "ETH");
    console.log("  - Deadline:", new Date(Number(campaign0.deadline) * 1000).toLocaleString());
    console.log("  - Organizer:", campaign0.organizer);
    console.log("  - Is Active:", campaign0.isActive);
    
    const now = Math.floor(Date.now() / 1000);
    const isExpired = Number(campaign0.deadline) < now;
    console.log("  - Is Expired:", isExpired);
    
    console.log("\n📋 Checking Campaign 1...");
    const campaign1 = await (contract as any)['campaigns'](1);
    console.log("  - Name:", campaign1.name);
    console.log("  - Description:", campaign1.description);
    console.log("  - Target Amount:", campaign1.targetAmount.toString(), "cents");
    console.log("  - Current Amount:", ethers.formatEther(campaign1.currentAmount), "ETH");
    console.log("  - Deadline:", new Date(Number(campaign1.deadline) * 1000).toLocaleString());
    console.log("  - Organizer:", campaign1.organizer);
    console.log("  - Is Active:", campaign1.isActive);
    
    const isExpired1 = Number(campaign1.deadline) < now;
    console.log("  - Is Expired:", isExpired1);
    
    console.log("\n🔍 Analysis:");
    if (!campaign0.isActive) {
      console.log("❌ Campaign 0 is not active - this could be the issue!");
    } else if (isExpired) {
      console.log("❌ Campaign 0 has expired - this could be the issue!");
    } else {
      console.log("✅ Campaign 0 is active and not expired");
    }
    
    if (!campaign1.isActive) {
      console.log("❌ Campaign 1 is not active");
    } else if (isExpired1) {
      console.log("❌ Campaign 1 has expired");
    } else {
      console.log("✅ Campaign 1 is active and not expired");
    }
    
  } catch (error: any) {
    console.error("❌ Error checking campaigns:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
