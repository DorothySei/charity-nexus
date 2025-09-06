import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hardhat } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Charity Nexus",
  projectId: process.env['NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'] || "your-project-id",
  chains: [sepolia, hardhat],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export const chains = [sepolia, hardhat];
