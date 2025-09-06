import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, hardhat],
  [publicProvider()]
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
});

export { chains };
