import { ethers } from "ethers";

async function main() {
  console.log("🧪 Testing donation to Campaign 1 (successful campaign)...");

  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Create a simple contract interface
  const contractABI = [
    "function makeDonation(uint256 campaignId, bytes32 amount, bytes calldata inputProof) public payable returns (uint256)"
  ];
  
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    // Test with the exact same encrypted data from the successful transaction
    const encryptedData = "0x58a2cdfc03fb80d500f8287c52970aa1c09f4eefeb000000000000aa36a70400";
    const inputProof = "0x010158a2cdfc03fb80d500f8287c52970aa1c09f4eefeb000000000000aa36a70400d922ec9af123f2276375068a9ffcb0930c49d596636acb844c1de2d887f688c41ba774b7c19d321cde4b77baf3333f6dd066548573548afb9283dc39ae3f57621b";
    
    console.log("\n🧪 Testing makeDonation with successful transaction data...");
    console.log("Encrypted data:", encryptedData);
    console.log("Input proof:", inputProof);
    
    // Try to estimate gas first
    console.log("\n⛽ Estimating gas for Campaign 1...");
    try {
      const gasEstimate = await (contract as any)['makeDonation'].estimateGas(
        1, // campaignId (Campaign 1 - the successful one)
        encryptedData, // amount (externalEuint32)
        inputProof, // inputProof
        { value: ethers.parseEther("0.0025") } // 0.0025 ETH
      );
      console.log("✅ Gas estimate successful for Campaign 1:", gasEstimate.toString());
    } catch (gasError: any) {
      console.error("❌ Gas estimation failed for Campaign 1:", gasError.message);
      console.log("Error data:", gasError.data);
    }
    
    // Now test with Campaign 0
    console.log("\n⛽ Estimating gas for Campaign 0...");
    try {
      const gasEstimate = await (contract as any)['makeDonation'].estimateGas(
        0, // campaignId (Campaign 0 - the failing one)
        encryptedData, // amount (externalEuint32)
        inputProof, // inputProof
        { value: ethers.parseEther("0.0025") } // 0.0025 ETH
      );
      console.log("✅ Gas estimate successful for Campaign 0:", gasEstimate.toString());
    } catch (gasError: any) {
      console.error("❌ Gas estimation failed for Campaign 0:", gasError.message);
      console.log("Error data:", gasError.data);
      
      if (gasError.data === "0xbf18af43") {
        console.log("🔍 This is the same FHE validation error!");
        console.log("The issue is likely that Campaign 0 is not active or has expired");
      }
    }
    
  } catch (error: any) {
    console.error("❌ makeDonation function failed:", error.message);
    
    // Try to decode the error
    if (error.data) {
      console.log("Error data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
