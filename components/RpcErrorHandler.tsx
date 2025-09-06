"use client";

import { useEffect, useState } from "react";

export default function RpcErrorHandler() {
  const [rpcStatus, setRpcStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    // Check RPC connectivity
    const checkRpcStatus = async () => {
      try {
        const response = await fetch('https://sepolia.rpc.zama.ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
        });

        if (response.ok) {
          setRpcStatus('connected');
        } else {
          setRpcStatus('error');
        }
      } catch (error) {
        console.warn('RPC connection check failed:', error);
        setRpcStatus('error');
      }
    };

    checkRpcStatus();
  }, []);

  if (rpcStatus === 'error') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Network Connection Warning:</strong> There may be temporary connectivity issues with the Sepolia network. 
              Please try refreshing the page or check your internet connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
