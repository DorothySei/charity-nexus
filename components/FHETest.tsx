"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { createInstance } from "@fhevm/sdk/web";
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
      // Create FHEVM instance
      const fhevm = await createInstance({
        verifyingContractAddress: "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4",
        kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
        aclContractAddress: "0x687820221192C5B662b25367F70076A37bc79b6c",
        gatewayChainId: 11155111,
        chainId: 11155111,
        network: window.ethereum,
        relayerUrl: "https://api.zama.ai/relayer",
      });

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
