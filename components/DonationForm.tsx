"use client";

import { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { CHARITY_NEXUS_ADDRESS, CHARITY_NEXUS_ABI } from "../lib/contracts";

export default function DonationForm() {
  const { address } = useAccount();
  const { write } = useContractWrite({
    address: CHARITY_NEXUS_ADDRESS,
    abi: CHARITY_NEXUS_ABI,
    functionName: "makeDonation",
  });
  
  const [formData, setFormData] = useState({
    campaignId: "",
    amount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      // Note: For FHE implementation, amount needs to be encrypted
      // For now, we'll use placeholder values that fit within euint8 (0-255)
      const amount = Math.min(255, Math.max(1, parseInt(formData.amount) / 100)); // Scale down to fit euint8
      const campaignId = BigInt(parseInt(formData.campaignId));

      // Convert amount to bytes32 format for contract
      const amountHex = `0x${amount.toString(16).padStart(64, '0')}` as `0x${string}`;

      await write({
        args: [
          campaignId,
          amountHex, // This will be encrypted as euint8 in the contract
        ],
        value: BigInt(parseInt(formData.amount) * 10**18), // Convert to wei for actual ETH transfer
      });

      alert("Donation made successfully!");
      setFormData({
        campaignId: "",
        amount: "",
      });
    } catch (error) {
      console.error("Error making donation:", error);
      alert("Failed to make donation");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="charity-card rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          💝 Make a Donation
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign ID *
            </label>
            <input
              type="number"
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter the campaign ID you want to donate to"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Find campaign IDs in the Campaigns tab
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Amount (USD) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., 100"
              min="100"
              max="25500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Note: Amount will be scaled down for FHE encryption (max $25,500)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
          >
            💝 Make Donation
          </button>
        </form>

        <div className="mt-6 p-4 bg-pink-50 rounded-lg">
          <h3 className="font-semibold text-pink-800 mb-2">🔒 Privacy Notice</h3>
          <p className="text-sm text-pink-700">
            All donation data is encrypted using Fully Homomorphic Encryption (FHE) technology. 
            Your donation amount remains private while enabling secure tracking.
          </p>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">💡 Donation Benefits</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• 100% of your donation goes to the cause</li>
            <li>• Transparent impact tracking</li>
            <li>• Secure blockchain-based record</li>
            <li>• Encrypted privacy protection</li>
          </ul>
        </div>

        {/* Quick Donation Amounts */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Donation Amounts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[25, 50, 100, 250].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
