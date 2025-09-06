import { ethers } from "ethers";

async function main() {
  console.log("🔍 Analyzing actual transaction amounts for donations...");

  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Known donation transaction hashes from events
  const donationTxHashes = [
    "0x61b692f1af7b2bbf3c9696c471e144186688efac67639676f1a6a65cfefd4ba2", // Campaign 1
    "0x6d9b0c9f3bdc9c638b96a5e443d995ff019ef6bcf1c1597128ce4f30af400797"  // Campaign 0
  ];
  
  try {
    // Get ETH price for conversion
    const ethPrice = 3500; // Approximate ETH price
    
    const campaignDonations: { [key: number]: { amount: number, count: number } } = {};
    let totalDonations = 0;
    
    for (const txHash of donationTxHashes) {
      try {
        console.log(`\n🔍 Analyzing transaction: ${txHash}`);
        
        // Get transaction details
        const tx = await provider.getTransaction(txHash);
        if (!tx) {
          console.log(`  ❌ Transaction not found`);
          continue;
        }
        
        // Get transaction receipt to get events
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
          console.log(`  ❌ Transaction receipt not found`);
          continue;
        }
        
        // Get actual ETH amount from transaction value
        const amountETH = parseFloat(ethers.formatEther(tx.value));
        const amountUSD = amountETH * ethPrice;
        
        console.log(`  - From: ${tx.from}`);
        console.log(`  - To: ${tx.to}`);
        console.log(`  - Value: ${amountETH} ETH ($${amountUSD.toFixed(2)})`);
        console.log(`  - Block: ${tx.blockNumber}`);
        console.log(`  - Gas Used: ${receipt.gasUsed.toString()}`);
        
        // Find DonationMade event in logs
        const contractABI = [
          "event DonationMade(uint256 indexed donationId, uint256 indexed campaignId, address indexed donor, uint32 amount)"
        ];
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
        for (const log of receipt.logs) {
          try {
            const parsedLog = contract.interface.parseLog(log);
            if (parsedLog && parsedLog.name === 'DonationMade') {
              const campaignId = Number(parsedLog.args['campaignId']);
              const donor = parsedLog.args['donor'];
              const donationId = Number(parsedLog.args['donationId']);
              
              console.log(`  - Event: DonationMade`);
              console.log(`  - Campaign ID: ${campaignId}`);
              console.log(`  - Donor: ${donor}`);
              console.log(`  - Donation ID: ${donationId}`);
              
              // Add to campaign donations
              if (!campaignDonations[campaignId]) {
                campaignDonations[campaignId] = { amount: 0, count: 0 };
              }
              campaignDonations[campaignId].amount += amountUSD;
              campaignDonations[campaignId].count += 1;
              totalDonations += amountUSD;
              
              break;
            }
          } catch (error) {
            // Not a DonationMade event, continue
          }
        }
        
      } catch (error: any) {
        console.error(`  ❌ Error analyzing transaction ${txHash}:`, error.message);
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
