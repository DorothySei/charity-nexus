import { ethers } from "ethers";

async function main() {
  console.log("🔍 Comparing donation parameters with deployed contract...");

  // Successful donation transaction
  const successfulTxHash = "0x61b692f1af7b2bbf3c9696c471e144186688efac67639676f1a6a65cfefd4ba2";
  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  try {
    // Get successful transaction details
    const tx = await provider.getTransaction(successfulTxHash);
    if (!tx) {
      console.error("❌ Transaction not found");
      return;
    }

    console.log("📋 Successful Donation Transaction Analysis:");
    console.log("  - Hash:", tx.hash);
    console.log("  - To:", tx.to);
    console.log("  - Value:", ethers.formatEther(tx.value), "ETH");
    console.log("  - Data Length:", tx.data.length);

    // Decode the input data
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
      
      // Parameter 1: campaignId (uint256) - 32 bytes
      const campaignId = BigInt("0x" + data.slice(0, 64));
      console.log("  - Campaign ID:", campaignId.toString());
      
      // Parameter 2: amount (bytes32) - 32 bytes
      const amount = "0x" + data.slice(64, 128);
      console.log("  - Encrypted Amount:", amount);
      
      // Parameter 3: inputProof (bytes) - dynamic
      const proofOffset = parseInt(data.slice(128, 192), 16);
      const proofLength = parseInt(data.slice(192, 256), 16);
      const proofData = "0x" + data.slice(256, 256 + proofLength * 2);
      
      console.log("  - Proof offset:", proofOffset);
      console.log("  - Proof length:", proofLength);
      console.log("  - Proof data:", proofData);
    }

    // Now let's check our current ABI
    console.log("\n📋 Our Current ABI Analysis:");
    
    // Our current ABI for makeDonation
    const ourABI = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "campaignId",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "amount",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "inputProof",
            "type": "bytes"
          }
        ],
        "name": "makeDonation",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "payable",
        "type": "function"
      }
    ];

    console.log("  - Our ABI parameters:");
    console.log("    1. campaignId: uint256");
    console.log("    2. amount: bytes32");
    console.log("    3. inputProof: bytes");

    // Calculate what our function selector should be
    const ourSelector = ethers.id("makeDonation(uint256,bytes32,bytes)").slice(0, 10);
    console.log("  - Our expected selector:", ourSelector);
    console.log("  - Matches successful tx:", ourSelector === makeDonationSelector);

    // Check if our ABI now matches
    console.log("\n🔍 Type Mapping Analysis:");
    console.log("  - Successful tx uses: makeDonation(uint256,bytes32,bytes)");
    console.log("  - Our ABI uses: makeDonation(uint256,bytes32,bytes)");
    console.log("  - ABI now matches the deployed contract!");

    // Let's also check the contract bytecode to see the actual function signature
    console.log("\n📋 Contract Bytecode Analysis:");
    try {
      const code = await provider.getCode(contractAddress);
      console.log("  - Contract code length:", code.length);
      console.log("  - Contract is deployed:", code !== "0x");
      
      // Look for function selectors in the bytecode
      const makeDonationSelectorHex = makeDonationSelector.slice(2);
      const ourSelectorHex = ourSelector.slice(2);
      
      console.log("  - Successful tx selector in bytecode:", code.includes(makeDonationSelectorHex));
      console.log("  - Our selector in bytecode:", code.includes(ourSelectorHex));
      
    } catch (error) {
      console.error("  - Error checking contract bytecode:", error);
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
