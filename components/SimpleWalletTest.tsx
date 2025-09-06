"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork } from "wagmi";

export default function SimpleWalletTest() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">钱包连接测试</h2>
      
      <div className="mb-4">
        <ConnectButton />
      </div>
      
      <div className="space-y-2 text-sm">
        <p><strong>连接状态:</strong> {isConnected ? "✅ 已连接" : "❌ 未连接"}</p>
        {isConnected && (
          <>
            <p><strong>地址:</strong> {address}</p>
            <p><strong>网络:</strong> {chain?.name} (ID: {chain?.id})</p>
          </>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>说明:</strong> 如果你看不到钱包连接按钮，请确保：
        </p>
        <ul className="text-sm text-blue-700 mt-2 space-y-1">
          <li>• 安装了MetaMask或其他Web3钱包</li>
          <li>• 钱包已解锁</li>
          <li>• 浏览器支持Web3</li>
        </ul>
      </div>
    </div>
  );
}
