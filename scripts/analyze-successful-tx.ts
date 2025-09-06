import { ethers } from "ethers";

async function main() {
  console.log("🔍 Analyzing successful donation transaction...");

  const txHash = "0x61b692f1af7b2bbf3c9696c471e144186688efac67639676f1a6a65cfefd4ba2";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  try {
    // Get transaction details
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      console.error("❌ Transaction not found");
      return;
    }

    console.log("📋 Transaction Details:");
    console.log("  - Hash:", tx.hash);
    console.log("  - From:", tx.from);
    console.log("  - To:", tx.to);
    console.log("  - Value:", ethers.formatEther(tx.value), "ETH");
    console.log("  - Gas Limit:", tx.gasLimit.toString());
    console.log("  - Gas Price:", tx.gasPrice?.toString());
    console.log("  - Nonce:", tx.nonce);
    console.log("  - Data Length:", tx.data.length);

    // Decode the input data
    console.log("\n🔍 Input Data Analysis:");
    console.log("  - Raw Data:", tx.data);
    
    // The first 4 bytes are the function selector
    const functionSelector = tx.data.slice(0, 10);
    console.log("  - Function Selector:", functionSelector);
    
    // Check if this matches makeDonation
    const makeDonationSelector = ethers.id("makeDonation(uint256,bytes32,bytes)").slice(0, 10);
    console.log("  - Expected makeDonation selector:", makeDonationSelector);
    console.log("  - Selector matches:", functionSelector === makeDonationSelector);

    if (functionSelector === makeDonationSelector) {
      console.log("\n✅ This is a makeDonation call");
      
      // Decode the parameters
      const data = tx.data.slice(10); // Remove function selector
      console.log("  - Parameter data:", data);
      
      // Parse the parameters manually
      // Parameter 1: campaignId (uint256) - 32 bytes
      const campaignId = BigInt("0x" + data.slice(0, 64));
      console.log("  - Campaign ID:", campaignId.toString());
      
      // Parameter 2: amount (bytes32) - 32 bytes
      const amount = "0x" + data.slice(64, 128);
      console.log("  - Encrypted Amount:", amount);
      
      // Parameter 3: inputProof (bytes) - dynamic
      // First 32 bytes are offset to data
      const proofOffset = parseInt(data.slice(128, 192), 16);
      console.log("  - Proof offset:", proofOffset);
      
      // Next 32 bytes are length
      const proofLength = parseInt(data.slice(192, 256), 16);
      console.log("  - Proof length:", proofLength);
      
      // The actual proof data
      const proofData = "0x" + data.slice(256, 256 + proofLength * 2);
      console.log("  - Proof data:", proofData);
      
      console.log("\n🔍 Comparison with current error:");
      console.log("  - Current error data: 0xbf18af43000000000000000000000000ccf3bd421d9eb200ac2bceb855d42a07b1e304cb");
      console.log("  - This suggests FHE validation is failing");
      
      // Get transaction receipt to see if it was successful
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt) {
        console.log("\n📊 Transaction Receipt:");
        console.log("  - Status:", receipt.status === 1 ? "Success" : "Failed");
        console.log("  - Gas Used:", receipt.gasUsed.toString());
        console.log("  - Block Number:", receipt.blockNumber);
        console.log("  - Logs Count:", receipt.logs.length);
        
        if (receipt.logs.length > 0) {
          console.log("  - Events:");
          receipt.logs.forEach((log, index) => {
            console.log(`    ${index + 1}. Address: ${log.address}`);
            console.log(`       Data: ${log.data}`);
            console.log(`       Topics: ${log.topics.join(", ")}`);
          });
        }
      }
    }

  } catch (error: any) {
    console.error("❌ Error analyzing transaction:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
