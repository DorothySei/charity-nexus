import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Initializing test data for Charity Nexus...");

  // Get the deployed contract
  const contractAddress = "0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Contract address: ${contractAddress}`);

  // Get signers
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers available");
  }
  
  const deployer = signers[0];
  console.log(`👤 Using account: ${deployer.address}`);

  try {
    // Create test campaigns
    console.log("\n📝 Creating test campaigns...");

    // Campaign 1: Clean Water Initiative
    console.log("Creating Campaign 1: Clean Water Initiative...");
    const tx1 = await charityNexus.createCampaign(
      "Clean Water Initiative",
      "Providing clean water access to rural communities in developing countries. This campaign will fund the installation of water purification systems and wells.",
      "0x0000000000000000000000000000000000000000000000000000000000000032", // Encrypted 50 (0x32)
      30 * 24 * 60 * 60 // 30 days in seconds
    );
    await tx1.wait();
    console.log("✅ Campaign 1 created successfully");

    // Campaign 2: Education for All
    console.log("Creating Campaign 2: Education for All...");
    const tx2 = await charityNexus.createCampaign(
      "Education for All",
      "Building schools and providing educational resources for children in underserved communities. Funds will be used for school construction, books, and teacher training.",
      "0x000000000000000000000000000000000000000000000000000000000000004b", // Encrypted 75 (0x4b)
      45 * 24 * 60 * 60 // 45 days in seconds
    );
    await tx2.wait();
    console.log("✅ Campaign 2 created successfully");

    // Campaign 3: Emergency Relief Fund
    console.log("Creating Campaign 3: Emergency Relief Fund...");
    const tx3 = await charityNexus.createCampaign(
      "Emergency Relief Fund",
      "Supporting communities affected by natural disasters. This fund provides immediate relief including food, shelter, and medical supplies.",
      "0x0000000000000000000000000000000000000000000000000000000000000064", // Encrypted 100 (0x64)
      60 * 24 * 60 * 60 // 60 days in seconds
    );
    await tx3.wait();
    console.log("✅ Campaign 3 created successfully");

    // Campaign 4: Healthcare Access
    console.log("Creating Campaign 4: Healthcare Access...");
    const tx4 = await charityNexus.createCampaign(
      "Healthcare Access",
      "Improving healthcare access in remote areas by funding mobile clinics, medical equipment, and training local healthcare workers.",
      "0x0000000000000000000000000000000000000000000000000000000000000050", // Encrypted 80 (0x50)
      40 * 24 * 60 * 60 // 40 days in seconds
    );
    await tx4.wait();
    console.log("✅ Campaign 4 created successfully");

    // Campaign 5: Environmental Protection
    console.log("Creating Campaign 5: Environmental Protection...");
    const tx5 = await charityNexus.createCampaign(
      "Environmental Protection",
      "Protecting endangered ecosystems and wildlife through conservation efforts, reforestation projects, and environmental education programs.",
      "0x000000000000000000000000000000000000000000000000000000000000003c", // Encrypted 60 (0x3c)
      35 * 24 * 60 * 60 // 35 days in seconds
    );
    await tx5.wait();
    console.log("✅ Campaign 5 created successfully");

    console.log("\n💰 Skipping donations due to insufficient test ETH balance...");
    console.log("💡 Users can make donations through the frontend interface");

    // Verify the data
    console.log("\n📊 Verifying initialized data...");
    const campaignCounter = await charityNexus.campaignCounter();
    const donationCounter = await charityNexus.donationCounter();
    
    console.log(`📈 Total campaigns created: ${campaignCounter}`);
    console.log(`💰 Total donations made: ${donationCounter}`);

    console.log("\n🎉 Test data initialization completed successfully!");
    console.log("\n📋 Summary:");
    console.log("- 5 test campaigns created");
    console.log("- Campaigns ready for frontend display");
    console.log("- Users can make donations through the frontend");
    console.log("- Contract ready for frontend testing");

  } catch (error) {
    console.error("❌ Error initializing test data:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  });
