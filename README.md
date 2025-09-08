# Charity Nexus - Privacy-Preserving Charity Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-charity--nexus.vercel.app-blue?style=for-the-badge&logo=vercel)](https://charity-nexus.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-DorothySei%2Fcharity--nexus-black?style=for-the-badge&logo=github)](https://github.com/DorothySei/charity-nexus)

Charity Nexus is a blockchain-based charity platform that uses FHEVM (Fully Homomorphic Encryption for EVM) technology to enable privacy-preserving donations and impact tracking.

🌐 **Live Demo**: [https://charity-nexus.vercel.app/](https://charity-nexus.vercel.app/)
   **Video**:[https://github.com/DorothySei/charity-nexus/blob/main/charity-nexus.mov](https://github.com/DorothySei/charity-nexus/blob/main/charity-nexus.mov)

## 🚀 Features

- **Privacy-Preserving Donations**: Uses FHE technology to protect donation amounts and anonymity
- **Smart Contract Management**: Transparent and secure fund management based on Ethereum
- **Impact Tracking**: Encrypted impact reports and beneficiary data
- **Reputation System**: Encrypted reputation scoring for donors and charities
- **Campaign Management**: Create, verify, and manage charity campaigns
- **Real-time Data**: Live campaign progress and donation tracking
- **Optimized Performance**: Fast loading with parallel API calls and caching
- **User-friendly Interface**: Intuitive design with improved accessibility

## 🎯 Key Capabilities

### For Donors
- 🔒 **Anonymous Donations**: Donate without revealing your identity
- 💰 **Flexible Amounts**: Support campaigns with any amount
- 📊 **Real-time Progress**: See campaign progress and impact
- 🏆 **Reputation Building**: Build encrypted reputation through donations

### For Campaign Organizers
- ➕ **Easy Campaign Creation**: Simple form to create new campaigns
- 📈 **Progress Tracking**: Monitor donations and campaign success
- 🔍 **Verification System**: Get campaigns verified for trust
- 📋 **Impact Reporting**: Submit encrypted impact reports

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
│   ├── wagmi.ts        # Wagmi configuration
│   └── api/            # API routes
│       ├── all-campaigns/
│       ├── campaign-info/
│       ├── campaign-donations/
│       └── contract-donations/
├── components/         # React components
│   ├── RealCampaignList.tsx
│   ├── CreateCampaign.tsx
│   ├── DonationForm.tsx
│   ├── CampaignList.tsx
│   ├── ImpactTracker.tsx
│   └── SuccessModal.tsx
├── lib/               # Utility libraries
│   ├── contracts.ts   # Contract configuration
│   ├── fhe-utils.ts   # FHE utility functions
│   └── ethereum-provider.ts
├── scripts/           # Deployment and utility scripts
│   ├── deploy.ts
│   ├── check-all-campaigns.ts
│   ├── check-donations.ts
│   └── test-contract-connection.ts
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

## 🎮 How to Use

### 1. Connect Wallet
- Visit [https://charity-nexus.vercel.app/](https://charity-nexus.vercel.app/)
- Click "Connect Wallet" to connect your Ethereum wallet
- Make sure you're on Sepolia testnet

### 2. Browse Campaigns
- View all active charity campaigns
- See real-time progress and donation amounts
- Check campaign details and impact

### 3. Make Donations
- Select a campaign to donate to
- Choose donation amount (ETH or USD)
- Your donation will be encrypted using FHE technology
- Track your donation on the blockchain

### 4. Create Campaigns
- Click "Create Campaign" to start a new charity campaign
- Fill in campaign details and target amount
- Set campaign duration
- Your campaign will be live on the platform

### 5. Track Impact
- Use the Impact Tracker to monitor campaign progress
- View encrypted impact reports
- See how your donations are making a difference

## 🔧 Configuration

### Environment Variables
Create a `.env` file and configure the following variables:

```env
# Wallet Connect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id

# Contract address (Sepolia testnet)
NEXT_PUBLIC_CHARITY_NEXUS_ADDRESS=0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7

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
- Encrypted donation amounts using `euint32` and `externalEuint32`
- Privacy-protected beneficiary data
- Homomorphically encrypted reputation scores
- Input proof verification for secure donations
- Real-time encryption/decryption with FHEVM SDK

## 🔐 Security Features

- **Fully Homomorphic Encryption**: All sensitive data is encrypted on-chain
- **Zero-Knowledge Proofs**: Donation amounts remain private
- **Smart Contract Security**: Audited and tested contract functions
- **Wallet Integration**: Secure wallet connection with multiple providers
- **Input Validation**: Comprehensive validation for all user inputs

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
- Vercel deployment
- Performance optimization
- UI/UX improvements
- Data loading optimization

## 🌐 Deployment Information

### Vercel (Frontend)
- **Live URL**: [https://charity-nexus.vercel.app/](https://charity-nexus.vercel.app/)
- **Platform**: Vercel
- **Framework**: Next.js
- **Status**: ✅ Live

### Sepolia Testnet (Smart Contract)
- **Contract Address**: `0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7`
- **Network**: Sepolia (Chain ID: 11155111)
- **Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7)
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
