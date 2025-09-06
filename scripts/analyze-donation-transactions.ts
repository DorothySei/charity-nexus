import { ethers } from "ethers";

async function main() {
  console.log("🔍 Analyzing donation transactions from blockchain...");

  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Get ETH price for conversion
  const ethPrice = 3500; // Approximate ETH price
  
  try {
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log(`📊 Latest block: ${latestBlock}`);
    
    // Look for transactions to our contract in the last 1000 blocks
    const startBlock = Math.max(0, latestBlock - 1000);
    console.log(`🔍 Searching blocks ${startBlock} to ${latestBlock}...`);
    
    let totalDonations = 0;
    const campaignDonations: { [key: number]: { amount: number, count: number } } = {};
    
    // Search through blocks for transactions to our contract
    for (let blockNum = latestBlock; blockNum >= startBlock; blockNum--) {
      try {
        const block = await provider.getBlock(blockNum, true);
        if (!block || !block.transactions) continue;
        
        for (const tx of block.transactions) {
          if (typeof tx === 'string') continue;
          
          const txObj = tx as any; // Type assertion for transaction object
          
          // Check if transaction is to our contract
          if (txObj.to?.toLowerCase() === contractAddress.toLowerCase()) {
            // Check if it's a donation transaction (has value > 0)
            if (txObj.value && txObj.value > 0) {
              const amountETH = parseFloat(ethers.formatEther(txObj.value));
              const amountUSD = amountETH * ethPrice;
              
              console.log(`\n💰 Donation found:`);
              console.log(`  - Block: ${blockNum}`);
              console.log(`  - Hash: ${txObj.hash}`);
              console.log(`  - From: ${txObj.from}`);
              console.log(`  - Amount: ${amountETH} ETH ($${amountUSD.toFixed(2)})`);
              console.log(`  - Gas: ${txObj.gasLimit?.toString()}`);
              
              totalDonations += amountUSD;
              
              // Try to decode the transaction data to get campaign ID
              try {
                if (txObj.data && txObj.data.length > 10) {
                  // Function selector for makeDonation: 0x1c15a2d1
                  if (txObj.data.startsWith('0x1c15a2d1')) {
                    const campaignId = parseInt(txObj.data.slice(10, 74), 16);
                    console.log(`  - Campaign ID: ${campaignId}`);
                    
                    if (!campaignDonations[campaignId]) {
                      campaignDonations[campaignId] = { amount: 0, count: 0 };
                    }
                    campaignDonations[campaignId].amount += amountUSD;
                    campaignDonations[campaignId].count += 1;
                  }
                }
              } catch (error) {
                console.log(`  - Could not decode campaign ID`);
              }
            }
          }
        }
      } catch (error) {
        // Skip blocks that can't be read
        continue;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Total donations found: $${totalDonations.toFixed(2)}`);
    console.log(`  - Campaign breakdown:`);
    
    for (const [campaignId, data] of Object.entries(campaignDonations)) {
      console.log(`    Campaign ${campaignId}: $${data.amount.toFixed(2)} (${data.count} donations)`);
    }
    
  } catch (error: any) {
    console.error("❌ Error analyzing transactions:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
