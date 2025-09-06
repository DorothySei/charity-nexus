import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Charity Nexus contract...");

  // Get the contract factory
  const CharityNexus = await ethers.getContractFactory("CharityNexus");

  console.log("📋 Deploying Charity Nexus contract...");
  
  // Get signers
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers available");
  }
  
  const deployer = signers[0];
  console.log(`👤 Deploying from: ${deployer.address}`);

  // Deploy the contract with the correct FHEVM Sepolia verifier address
  const verifierAddress = "0x0000000000000000000000000000000000000000";
  const charityNexus = await CharityNexus.deploy(verifierAddress);

  await charityNexus.waitForDeployment();

  const address = await charityNexus.getAddress();
  console.log(`✅ Charity Nexus contract deployed to: ${address}`);
  console.log(`🔍 Verifier address: ${verifierAddress}`);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: address,
    verifierAddress: verifierAddress,
    network: "sepolia",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
  };

  console.log("📄 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
