# Charity Nexus - Privacy-Preserving Charity Platform

Charity Nexus is a blockchain-based charity platform that uses FHEVM (Fully Homomorphic Encryption for EVM) technology to enable privacy-preserving donations and impact tracking.

## 🚀 Features

- **Privacy-Preserving Donations**: Uses FHE technology to protect donation amounts and anonymity
- **Smart Contract Management**: Transparent and secure fund management based on Ethereum
- **Impact Tracking**: Encrypted impact reports and beneficiary data
- **Reputation System**: Encrypted reputation scoring for donors and charities
- **Campaign Management**: Create, verify, and manage charity campaigns

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity**: Smart contract development language
- **FHEVM**: Fully Homomorphic Encryption Virtual Machine
- **Hardhat**: Development framework
- **Ethers.js**: Ethereum interaction library

### Frontend
- **Next.js**: React framework
- **Wagmi**: Ethereum React Hooks
- **RainbowKit**: Wallet connection
- **Tailwind CSS**: Styling framework
- **TypeScript**: Type safety

## 📋 Project Structure

```
charity-nexus/
├── contracts/           # Smart contracts
│   └── CharityNexus.sol
├── app/                # Next.js application
│   ├── page.tsx        # Main page
│   ├── layout.tsx      # Layout
│   ├── providers.tsx   # Providers
│   └── wagmi.ts        # Wagmi configuration
├── components/         # React components
│   ├── CampaignList.tsx
│   ├── CreateCampaign.tsx
│   ├── DonationForm.tsx
│   └── ImpactTracker.tsx
├── lib/               # Utility libraries
│   └── contracts.ts   # Contract configuration
├── scripts/           # Deployment scripts
│   └── deploy.ts
└── test/              # Test files
    └── CharityNexus.test.ts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Install Dependencies
```bash
npm install
```

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm test
```

### Local Deployment
```bash
npm run deploy:local
```

### Start Frontend
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file and configure the following variables:

```env
# Wallet Connect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id

# Contract address (update after deployment)
NEXT_PUBLIC_CHARITY_NEXUS_ADDRESS=0x...

# Network configuration
SEPOLIA_RPC_URL=https://sepolia.rpc.zama.ai
PRIVATE_KEY=your-private-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

## 📝 Contract Functions

### Main Functions
- `createCampaign()`: Create charity campaigns
- `makeDonation()`: Make donations
- `submitImpactReport()`: Submit impact reports
- `verifyCampaign()`: Verify campaigns
- `updateReputation()`: Update reputation

### FHE Features
- Encrypted donation amounts
- Privacy-protected beneficiary data
- Homomorphically encrypted reputation scores

## 🧪 Testing

The project includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run specific tests
npx hardhat test --grep "Campaign Management"
```

## 🚀 Deployment

### Local Network
```bash
npm run deploy:local
```

### Sepolia Testnet
```bash
npm run deploy:sepolia
```

## 📊 Project Status

✅ **Completed**:
- FHE smart contract development
- Frontend interface integration
- Local deployment and testing
- Sepolia testnet deployment
- Build configuration optimization

🔄 **In Progress**:
- Vercel deployment

## 🌐 Deployment Information

### Sepolia Testnet
- **Contract Address**: `0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F`
- **Network**: Sepolia (Chain ID: 11155111)
- **Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0x4630b088E2a6013527Bd9A68aB2c0ceb1a06F18F)
- **Deployment Time**: 2025-09-06T01:58:58.087Z

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 🔗 Related Links

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)

---

**Note**: This is a demonstration project showcasing FHEVM applications in charity platforms. Please conduct thorough security audits and testing before using in production environments.