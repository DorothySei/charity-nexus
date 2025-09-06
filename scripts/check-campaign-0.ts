import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking Campaign 0 details...");

  const contractAddress = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
  const CharityNexus = await ethers.getContractFactory("CharityNexus");
  const charityNexus = CharityNexus.attach(contractAddress);

  console.log(`📋 Contract address: ${contractAddress}`);

  try {
    // Check campaign counter
    const campaignCounter = await charityNexus.campaignCounter();
    console.log(`📊 Campaign count: ${campaignCounter}`);

    if (Number(campaignCounter) === 0) {
      console.log("❌ No campaigns found");
      return;
    }

    // Check campaign 0 details
    const campaign = await charityNexus.campaigns(0);
    console.log(`📋 Campaign 0 details:`);
    console.log(`   - Name: ${campaign.name}`);
    console.log(`   - Description: ${campaign.description}`);
    console.log(`   - Organizer: ${campaign.organizer}`);
    console.log(`   - Is Active: ${campaign.isActive}`);
    console.log(`   - Start Time: ${new Date(Number(campaign.startTime) * 1000)}`);
    console.log(`   - End Time: ${new Date(Number(campaign.endTime) * 1000)}`);
    console.log(`   - Current Time: ${new Date()}`);
    console.log(`   - Time Remaining: ${Number(campaign.endTime) - Math.floor(Date.now() / 1000)} seconds`);

    // Check if campaign is still active
    const currentTime = Math.floor(Date.now() / 1000);
    const isActive = campaign.isActive && currentTime <= Number(campaign.endTime);
    console.log(`   - Campaign is active: ${isActive}`);

  } catch (error) {
    console.error("❌ Check failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });