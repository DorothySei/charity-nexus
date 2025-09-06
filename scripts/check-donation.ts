import { ethers } from "ethers";

const CHARITY_NEXUS_ADDRESS = "0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F";
const SEPOLIA_RPC = "https://1rpc.io/sepolia";

async function checkContract() {
  try {
    console.log("🔍 Checking contract status...");
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    
    // Check if contract exists
    const code = await provider.getCode(CHARITY_NEXUS_ADDRESS);
    if (code === "0x") {
      console.error("❌ Contract not found at address:", CHARITY_NEXUS_ADDRESS);
      return;
    }
    
    console.log("✅ Contract found at address:", CHARITY_NEXUS_ADDRESS);
    
    // Check campaign counter
    const campaignCounterData = "0x" + ethers.id("campaignCounter()").slice(2);
    const campaignCounterResult = await provider.call({
      to: CHARITY_NEXUS_ADDRESS,
      data: campaignCounterData,
    });
    
    const campaignCount = parseInt(campaignCounterResult, 16);
    console.log("📊 Campaign count:", campaignCount);
    
    // Check donation counter
    const donationCounterData = "0x" + ethers.id("donationCounter()").slice(2);
    const donationCounterResult = await provider.call({
      to: CHARITY_NEXUS_ADDRESS,
      data: donationCounterData,
    });
    
    const donationCount = parseInt(donationCounterResult, 16);
    console.log("💝 Donation count:", donationCount);
    
    // Check network
    const network = await provider.getNetwork();
    console.log("🌐 Network:", network.name, "Chain ID:", network.chainId);
    
  } catch (error) {
    console.error("❌ Error checking contract:", error);
  }
}

checkContract();
