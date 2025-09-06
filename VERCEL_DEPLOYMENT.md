# Vercel Deployment Configuration

## Required Environment Variables

To deploy this project on Vercel, you need to configure the following environment variables in your Vercel dashboard:

### 1. Wallet Connect Configuration
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=e08e99d213c331aa0fd00f625de06e66
```

### 2. Contract Address
```
NEXT_PUBLIC_CHARITY_NEXUS_ADDRESS=0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7
```

### 3. Network Configuration
```
NEXT_PUBLIC_NETWORK=sepolia
SEPOLIA_RPC_URL=https://1rpc.io/sepolia
```

## How to Configure in Vercel

1. Go to your Vercel dashboard
2. Select your project (charity-nexus)
3. Go to Settings → Environment Variables
4. Add each environment variable:
   - **Name**: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
   - **Value**: `e08e99d213c331aa0fd00f625de06e66`
   - **Environment**: Production, Preview, Development

   - **Name**: `NEXT_PUBLIC_CHARITY_NEXUS_ADDRESS`
   - **Value**: `0xC339D8Fd330979E50D7e8D7Ce5f78F7D380668c7`
   - **Environment**: Production, Preview, Development

   - **Name**: `NEXT_PUBLIC_NETWORK`
   - **Value**: `sepolia`
   - **Environment**: Production, Preview, Development

   - **Name**: `SEPOLIA_RPC_URL`
   - **Value**: `https://1rpc.io/sepolia`
   - **Environment**: Production, Preview, Development

5. Save the configuration
6. Redeploy your project

## Important Notes

- All environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Make sure to use the correct contract address for your deployment
- The WalletConnect Project ID is required for wallet connections to work
- After adding environment variables, you need to redeploy for changes to take effect

## Troubleshooting

If wallet connection still fails after configuration:

1. Check that all environment variables are set correctly
2. Verify the contract address is deployed on Sepolia testnet
3. Make sure you're connected to Sepolia network in your wallet
4. Check browser console for any error messages
