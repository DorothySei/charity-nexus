"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
// Dynamic import will be used instead of static import
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
      // Use CDN version instead of npm package
      throw new Error("FHE SDK not available - use CDN version");
      
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
