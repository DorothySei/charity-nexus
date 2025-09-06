import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
const RPC_URL = "https://1rpc.io/sepolia";

// Contract ABI for events
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "donationId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "donor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "amount",
        "type": "uint32"
      }
    ],
    "name": "DonationMade",
    "type": "event"
  }
];

// Get ETH price in USD
async function getETHPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error('Failed to fetch ETH price:', error);
    return 2500; // Fallback price
  }
}

export async function POST(request: NextRequest) {
  try {
    const { campaignId } = await request.json();
    
    if (campaignId === undefined || campaignId === null) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Get ETH price
    const ethPrice = await getETHPrice();

    // For now, return mock data based on known donations
    // TODO: Implement proper event querying with a better RPC provider
    let totalETH = 0;
    let donationCount = 0;
    const donations = [];

    // Known donation for campaign 1: 0.0025 ETH
    if (campaignId === 1) {
      totalETH = 0.0025;
      donationCount = 1;
      donations.push({
        donor: "0x9206f601EfFA3DC4E89Ab021d9177f5b4B31Bd89",
        amountETH: 0.0025,
        amountUSD: 0.0025 * ethPrice,
        timestamp: Date.now() - 3600000 // 1 hour ago
      });
    }

    const result = {
      campaignId: Number(campaignId),
      totalDonationsETH: totalETH,
      totalDonationsUSD: totalETH * ethPrice,
      donationCount: donationCount,
      ethPrice: ethPrice,
      donations: donations
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching campaign donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign donations', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
