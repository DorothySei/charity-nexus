import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7";
const RPC_URL = "https://1rpc.io/sepolia";

// Contract ABI for campaigns mapping (from compiled artifact)
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "campaigns",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "campaignId",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "targetAmount",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "currentAmount",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "donorCount",
        "type": "bytes32"
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
    if (!contract['campaigns']) {
      return NextResponse.json({ error: 'Contract method not available' }, { status: 500 });
    }
    const campaignInfo = await contract['campaigns'](campaignId);

    // Parse the response (note: euint32 fields are encrypted, so we'll use default values for now)
    const result = {
      name: campaignInfo[6], // name (string)
      description: campaignInfo[7], // description (string)
      targetAmount: "0", // targetAmount (euint32 - encrypted, use default)
      currentAmount: "0", // currentAmount (euint32 - encrypted, use default)
      donorCount: "0", // donorCount (euint32 - encrypted, use default)
      isActive: campaignInfo[4], // isActive (bool)
      isVerified: campaignInfo[5], // isVerified (bool)
      organizer: campaignInfo[8], // creator (address)
      startTime: campaignInfo[9].toString(), // startTime (uint256)
      endTime: campaignInfo[10].toString() // endTime (uint256)
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
