import { ethers } from "ethers";

async function main() {
  console.log("🔍 Analyzing donation events from contract...");

  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Contract ABI for events
  const contractABI = [
    "event DonationMade(uint256 indexed donationId, uint256 indexed campaignId, address indexed donor, uint32 amount)",
    "event CampaignCreated(uint256 indexed campaignId, address indexed organizer, string name)"
  ];
  
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    // Get ETH price for conversion
    const ethPrice = 3500; // Approximate ETH price
    
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log(`📊 Latest block: ${latestBlock}`);
    
    // Look for donation events in batches (max 10,000 blocks per request)
    const batchSize = 10000;
    const totalBlocks = 50000; // Search last 50,000 blocks
    const startBlock = Math.max(0, latestBlock - totalBlocks);
    console.log(`🔍 Searching for donation events from block ${startBlock} to ${latestBlock} in batches...`);
    
    // Get all DonationMade events in batches
    const donationFilter = (contract as any).filters['DonationMade']();
    let allDonationEvents: any[] = [];
    
    for (let fromBlock = startBlock; fromBlock < latestBlock; fromBlock += batchSize) {
      const toBlock = Math.min(fromBlock + batchSize - 1, latestBlock);
      console.log(`  Searching blocks ${fromBlock} to ${toBlock}...`);
      
      try {
        const batchEvents = await contract.queryFilter(donationFilter, fromBlock, toBlock);
        allDonationEvents = allDonationEvents.concat(batchEvents);
        console.log(`    Found ${batchEvents.length} events in this batch`);
      } catch (error: any) {
        console.log(`    Error in batch ${fromBlock}-${toBlock}: ${error.message}`);
      }
    }
    
    const donationEvents = allDonationEvents;
    
    console.log(`\n💰 Found ${donationEvents.length} donation events:`);
    
    const campaignDonations: { [key: number]: { amount: number, count: number, donors: Set<string> } } = {};
    let totalDonations = 0;
    
    for (const event of donationEvents) {
      const eventLog = event as any; // Type assertion for event log
      const donationId = Number(eventLog.args?.donationId || 0);
      const campaignId = Number(eventLog.args?.campaignId || 0);
      const donor = eventLog.args?.donor || '';
      const amount = eventLog.args?.amount || 0;
      
      // Convert amount from wei to ETH to USD (amount is in wei)
      const amountETH = parseFloat(ethers.formatEther(amount));
      const amountUSD = amountETH * ethPrice;
      
      console.log(`\n📋 Donation Event:`);
      console.log(`  - Donation ID: ${donationId}`);
      console.log(`  - Campaign ID: ${campaignId}`);
      console.log(`  - Donor: ${donor}`);
      console.log(`  - Amount: ${amountETH} ETH ($${amountUSD.toFixed(2)})`);
      console.log(`  - Block: ${eventLog.blockNumber}`);
      console.log(`  - Transaction: ${eventLog.transactionHash}`);
      
      totalDonations += amountUSD;
      
      if (!campaignDonations[campaignId]) {
        campaignDonations[campaignId] = { amount: 0, count: 0, donors: new Set() };
      }
      campaignDonations[campaignId].amount += amountUSD;
      campaignDonations[campaignId].count += 1;
      campaignDonations[campaignId].donors.add(donor);
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Total donations found: $${totalDonations.toFixed(2)}`);
    console.log(`  - Campaign breakdown:`);
    
    for (const [campaignId, data] of Object.entries(campaignDonations)) {
      console.log(`    Campaign ${campaignId}: $${data.amount.toFixed(2)} (${data.count} donations, ${data.donors.size} unique donors)`);
    }
    
    // Also get campaign creation events to understand the campaigns
    console.log(`\n📋 Campaign Creation Events:`);
    const campaignFilter = (contract as any).filters['CampaignCreated']();
    let allCampaignEvents: any[] = [];
    
    for (let fromBlock = startBlock; fromBlock < latestBlock; fromBlock += batchSize) {
      const toBlock = Math.min(fromBlock + batchSize - 1, latestBlock);
      
      try {
        const batchEvents = await contract.queryFilter(campaignFilter, fromBlock, toBlock);
        allCampaignEvents = allCampaignEvents.concat(batchEvents);
      } catch (error: any) {
        console.log(`    Error in campaign batch ${fromBlock}-${toBlock}: ${error.message}`);
      }
    }
    
    const campaignEvents = allCampaignEvents;
    
    for (const event of campaignEvents) {
      const eventLog = event as any; // Type assertion for event log
      const campaignId = Number(eventLog.args?.campaignId || 0);
      const organizer = eventLog.args?.organizer || '';
      const name = eventLog.args?.name || '';
      
      console.log(`\n📋 Campaign ${campaignId}:`);
      console.log(`  - Name: "${name}"`);
      console.log(`  - Organizer: ${organizer}`);
      console.log(`  - Block: ${eventLog.blockNumber}`);
    }
    
  } catch (error: any) {
    console.error("❌ Error analyzing events:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
