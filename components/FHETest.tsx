"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
// Dynamic import will be used instead of static import
import { CHARITY_NEXUS_ADDRESS } from "../lib/contracts";

export default function FHETest() {
  const { address } = useAccount();
  const [testResult, setTestResult] = useState<string>("");
  const [isTesting, setIsTesting] = useState(false);

  const testFHEVM = async () => {
    if (!address) {
      setTestResult("Please connect your wallet first");
      return;
    }

    setIsTesting(true);
    setTestResult("Testing FHEVM SDK...");

    try {
      // Dynamic import FHEVM SDK
      const { initSDK, createInstance, SepoliaConfig } = await import("@zama-fhe/relayer-sdk/bundle");
      
      // Initialize FHEVM SDK
      await initSDK(); // Loads WASM
      
      // Create FHEVM instance using SepoliaConfig with proper configuration
      const config = { 
        ...SepoliaConfig, 
        network: (window as any).ethereum,
        // Add explicit configuration for Sepolia
        chainId: 11155111,
        gatewayChainId: 11155111,
      };
      const fhevm = await createInstance(config);

      setTestResult("✅ FHEVM instance created successfully!");

      // Test creating encrypted input
      const encryptedInput = await fhevm
        .createEncryptedInput(CHARITY_NEXUS_ADDRESS, address)
        .add8(1)
        .encrypt();

      setTestResult("✅ FHEVM encryption test successful! Encrypted data created.");
      console.log("Encrypted input:", encryptedInput);

    } catch (error: any) {
      setTestResult(`❌ FHEVM test failed: ${error.message}`);
      console.error("FHEVM test error:", error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">FHEVM SDK Test</h3>
      <button
        onClick={testFHEVM}
        disabled={isTesting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isTesting ? "Testing..." : "Test FHEVM SDK"}
      </button>
      {testResult && (
        <div className="mt-4 p-3 bg-white border rounded">
          <pre className="text-sm">{testResult}</pre>
        </div>
      )}
    </div>
  );
}
