import { ethers } from "ethers";

async function main() {
  console.log("🔍 Checking actual campaign data from contract...");

  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Create a simple contract interface to read campaign data
  const contractABI = [
    "function campaignCounter() view returns (uint256)",
    "function campaigns(uint256) view returns (string memory name, string memory description, uint256 targetAmount, uint256 currentAmount, uint256 deadline, address organizer, bool isActive)"
  ];
  
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    // Get campaign counter
    const campaignCounter = await (contract as any).campaignCounter();
    const campaignCount = Number(campaignCounter);
    console.log(`📊 Total campaigns in contract: ${campaignCount}`);
    
    if (campaignCount === 0) {
      console.log("❌ No campaigns found");
      return;
    }

    // Get ETH price for conversion
    const ethPrice = 3500; // Approximate ETH price
    
    // Check each campaign
    for (let i = 0; i < campaignCount; i++) {
      try {
        console.log(`\n📋 Campaign ${i}:`);
        const campaign = await (contract as any).campaigns(i);
        
        console.log(`  - Name: "${campaign.name}"`);
        console.log(`  - Description: "${campaign.description}"`);
        console.log(`  - Target Amount (wei): ${campaign.targetAmount.toString()}`);
        console.log(`  - Target Amount (ETH): ${ethers.formatEther(campaign.targetAmount)}`);
        console.log(`  - Target Amount (USD): $${(parseFloat(ethers.formatEther(campaign.targetAmount)) * ethPrice).toLocaleString()}`);
        console.log(`  - Current Amount (wei): ${campaign.currentAmount.toString()}`);
        console.log(`  - Current Amount (ETH): ${ethers.formatEther(campaign.currentAmount)}`);
        console.log(`  - Current Amount (USD): $${(parseFloat(ethers.formatEther(campaign.currentAmount)) * ethPrice).toLocaleString()}`);
        console.log(`  - Deadline: ${new Date(Number(campaign.deadline) * 1000).toLocaleString()}`);
        console.log(`  - Organizer: ${campaign.organizer}`);
        console.log(`  - Is Active: ${campaign.isActive}`);
        
        // Check if this matches user's campaign
        if (campaign.name.includes("Food") || campaign.name.includes("Student")) {
          console.log(`  🎯 This matches user's "Food for Student" campaign!`);
        }
        
      } catch (error: any) {
        console.error(`  ❌ Error reading campaign ${i}:`, error.message);
      }
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
