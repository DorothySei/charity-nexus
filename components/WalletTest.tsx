"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletTest() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Wallet Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Connection Status:</h3>
          <p className={`px-3 py-2 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected ? `Connected: ${address}` : 'Not Connected'}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Connect Wallet:</h3>
          <ConnectButton />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Connection Error:</p>
            <p>{error.message}</p>
          </div>
        )}

        {isLoading && pendingConnector && (
          <div className="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <p>Connecting to {pendingConnector.name}...</p>
          </div>
        )}

        {isConnected && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Available Actions:</h3>
            <button
              onClick={() => disconnect()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
