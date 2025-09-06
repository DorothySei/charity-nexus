"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { createInstance } from "@fhevm/sdk";
import { CHARITY_NEXUS_ADDRESS } from "../lib/contracts";

interface FHEDonationHandlerProps {
  campaignId: number;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function FHEDonationHandler({ 
  campaignId, 
  amount, 
  onSuccess, 
  onError 
}: FHEDonationHandlerProps) {
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFHEDonation = async () => {
    if (!address) {
      onError("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);

    try {
      // Create FHEVM instance
      const fhevm = await createInstance({
        chainId: 11155111, // Sepolia
        publicKey: {
          name: "FHEVM",
          version: "1.0.0",
        },
      });

      // Create encrypted input
      const encryptedInput = await fhevm
        .createEncryptedInput(CHARITY_NEXUS_ADDRESS, address)
        .add8(amount)
        .encrypt();

      // Get the encrypted data and proof
      const { data: encryptedData, proof } = encryptedInput;

      // Call the contract with encrypted data
      // This would be called from the parent component
      onSuccess();
      
    } catch (error: any) {
      console.error("FHE donation error:", error);
      onError(error.message || "Failed to create encrypted donation");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleFHEDonation}
      disabled={isProcessing}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isProcessing ? "Processing..." : "Donate with FHE"}
    </button>
  );
}
