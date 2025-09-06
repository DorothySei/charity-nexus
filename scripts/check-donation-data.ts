import { ethers } from "ethers";

async function main() {
  console.log("🔍 Checking actual donation data from contract...");

  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Create a simple contract interface to read donation data
  const contractABI = [
    "function campaignCounter() view returns (uint256)",
    "function campaigns(uint256) view returns (string memory name, string memory description, uint256 targetAmount, uint256 currentAmount, uint256 deadline, address organizer, bool isActive)",
    "function getCampaignDonations(uint256 campaignId) view returns (address[] memory donors, uint256[] memory amounts, uint256[] memory timestamps)"
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
    
    // Check each campaign's donation data
    for (let i = 0; i < campaignCount; i++) {
      try {
        console.log(`\n📋 Campaign ${i} Donations:`);
        
        // Try to get donation data
        try {
          const donations = await (contract as any).getCampaignDonations(i);
          console.log(`  - Donors: ${donations.donors.length}`);
          console.log(`  - Amounts: ${donations.amounts.length}`);
          console.log(`  - Timestamps: ${donations.timestamps.length}`);
          
          if (donations.donors.length > 0) {
            let totalDonated = BigInt(0);
            for (let j = 0; j < donations.amounts.length; j++) {
              const amount = donations.amounts[j];
              totalDonated += amount;
              console.log(`    Donation ${j + 1}: ${ethers.formatEther(amount)} ETH ($${(parseFloat(ethers.formatEther(amount)) * ethPrice).toFixed(2)})`);
            }
            console.log(`  - Total Donated: ${ethers.formatEther(totalDonated)} ETH ($${(parseFloat(ethers.formatEther(totalDonated)) * ethPrice).toFixed(2)})`);
          }
        } catch (error: any) {
          console.log(`  ❌ Could not get donation data: ${error.message}`);
        }
        
        // Also try to get campaign data
        try {
          const campaign = await (contract as any).campaigns(i);
          console.log(`  - Campaign Name: "${campaign.name}"`);
          console.log(`  - Current Amount (wei): ${campaign.currentAmount.toString()}`);
          console.log(`  - Current Amount (ETH): ${ethers.formatEther(campaign.currentAmount)}`);
          console.log(`  - Current Amount (USD): $${(parseFloat(ethers.formatEther(campaign.currentAmount)) * ethPrice).toFixed(2)}`);
        } catch (error: any) {
          console.log(`  ❌ Could not get campaign data: ${error.message}`);
        }
        
      } catch (error: any) {
        console.error(`  ❌ Error reading campaign ${i}:`, error.message);
      }
    }
    
  } catch (error: any) {
    console.error("❌ Error checking donations:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
