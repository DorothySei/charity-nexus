import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, hardhat],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === sepolia.id) {
          return {
            http: "https://sepolia.rpc.zama.ai",
          };
        }
        return null;
      },
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Charity Nexus",
  projectId: process.env['NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'] || "your-project-id",
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
  // Add error handling for wallet conflicts
  logger: {
    warn: (message) => {
      if (message.includes('ethereum') || message.includes('wallet')) {
        console.warn('Wallet warning:', message);
      }
    },
  },
});

export { chains };
