import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F";
const RPC_URL = "https://1rpc.io/sepolia";

// Contract ABI for getCampaignInfo function
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      }
    ],
    "name": "getCampaignInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint32",
        "name": "targetAmount",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "currentAmount",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "donorCount",
        "type": "uint32"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "organizer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export async function POST(request: NextRequest) {
  try {
    const { campaignId } = await request.json();
    
    if (campaignId === undefined || campaignId === null) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Create provider and contract instance
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    // Get campaign info from contract
    const campaignInfo = await contract.getCampaignInfo(campaignId);

    // Parse the response
    const result = {
      name: campaignInfo[0],
      description: campaignInfo[1],
      targetAmount: campaignInfo[2].toString(),
      currentAmount: campaignInfo[3].toString(),
      donorCount: campaignInfo[4].toString(),
      isActive: campaignInfo[5],
      isVerified: campaignInfo[6],
      organizer: campaignInfo[7],
      startTime: campaignInfo[8].toString(),
      endTime: campaignInfo[9].toString()
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching campaign info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign info' }, 
      { status: 500 }
    );
  }
}
