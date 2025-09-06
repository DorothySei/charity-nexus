"use client";

import { useEffect } from "react";

export default function WalletErrorHandler() {
  useEffect(() => {
    // Handle wallet extension conflicts gracefully
    const handleWalletError = (event: ErrorEvent) => {
      if (event.message?.includes("Cannot redefine property: ethereum")) {
        console.warn("Multiple wallet extensions detected. This is normal and won't affect functionality.");
        event.preventDefault();
        return false;
      }
      return true;
    };

    // Add error listener
    window.addEventListener("error", handleWalletError);

    // Cleanup
    return () => {
      window.removeEventListener("error", handleWalletError);
    };
  }, []);

  return null; // This component doesn't render anything
}
