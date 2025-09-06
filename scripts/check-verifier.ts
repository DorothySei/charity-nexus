import { ethers } from "ethers";

const CHARITY_NEXUS_ADDRESS = "0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F";
const SEPOLIA_RPC = "https://1rpc.io/sepolia";

async function checkVerifier() {
  try {
    console.log("🔍 Checking verifier address...");
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    
    // Function selector for verifier()
    const functionSelector = ethers.id("verifier()").slice(0, 10);
    
    console.log("📞 Calling verifier()...");
    const result = await provider.call({
      to: CHARITY_NEXUS_ADDRESS,
      data: functionSelector,
    });
    
    if (result === "0x") {
      console.log("❌ Verifier call failed");
      return;
    }
    
    // Decode the result (address)
    const verifier = ethers.AbiCoder.defaultAbiCoder().decode(["address"], result)[0];
    
    console.log("🔐 Verifier Address:", verifier);
    
    // Check if verifier is zero address
    if (verifier === "0x0000000000000000000000000000000000000000") {
      console.log("❌ Verifier is zero address - this might be the problem!");
    } else {
      console.log("✅ Verifier address is set");
    }
    
  } catch (error) {
    console.error("❌ Error checking verifier:", error);
  }
}

checkVerifier();
