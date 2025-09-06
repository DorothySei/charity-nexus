import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Testing FHE encryption with real data...");

  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Contract address: ${contractAddress}`);

  try {
    // Test with the exact same encrypted data from the frontend
    const encryptedData = "0x1cb0f03e3a3df225ad18525fecb7df3111c4ebaa91000000000000aa36a70400";
    const inputProof = "0x01011cb0f03e3a3df225ad18525fecb7df3111c4ebaa91000000000000aa36a704000fe820db44c262f1024733f685e88ff85712bf5c3ea9e15a766d1eb716a52c4c585845d4166c8a0fc15812070aa98a19009f839a156c7f111431456f435e14481b";
    
    console.log("\n🧪 Testing makeDonation with real FHE data...");
    console.log("Encrypted data:", encryptedData);
    console.log("Input proof:", inputProof);
    
    const tx = await charityNexus.makeDonation(
      0, // campaignId
      encryptedData, // amount (externalEuint32)
      inputProof, // inputProof
      { value: ethers.parseEther("0.01") } // 0.01 ETH
    );

    console.log("✅ makeDonation function call successful!");
    console.log("Transaction hash:", tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt?.blockNumber);
    
  } catch (error: any) {
    console.error("❌ makeDonation function failed:", error.message);
    
    // Try to decode the error
    if (error.data) {
      console.log("Error data:", error.data);
    }
    
    // Check if it's the same error
    if (error.data === "0x9de3392c") {
      console.log("🔍 This is the same FHE validation error from the frontend");
      console.log("The issue is likely with FHE verification in the contract");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });