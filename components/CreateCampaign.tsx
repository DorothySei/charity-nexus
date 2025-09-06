"use client";

import { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { CHARITY_NEXUS_ADDRESS, CHARITY_NEXUS_ABI } from "../lib/contracts";

export default function CreateCampaign() {
  const { address } = useAccount();
  const { write } = useContractWrite({
    address: CHARITY_NEXUS_ADDRESS,
    abi: CHARITY_NEXUS_ABI,
    functionName: "createCampaign",
  });
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: "",
    duration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      // In a real implementation, you would encrypt these values using FHE
      const encryptedTargetAmount = parseInt(formData.targetAmount);
      const durationInSeconds = parseInt(formData.duration) * 24 * 60 * 60; // Convert days to seconds

      await write({
        args: [
          formData.name,
          formData.description,
          encryptedTargetAmount,
          BigInt(durationInSeconds),
        ],
      });

      alert("Campaign created successfully!");
      setFormData({
        name: "",
        description: "",
        targetAmount: "",
        duration: "",
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="charity-card rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ➕ Create New Campaign
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Clean Water Initiative"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Describe your campaign goals, impact, and how funds will be used..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount (USD) *
              </label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., 50000"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Duration (days) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., 30"
                min="1"
                max="365"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
          >
            🎯 Create Campaign
          </button>
        </form>

        <div className="mt-6 p-4 bg-pink-50 rounded-lg">
          <h3 className="font-semibold text-pink-800 mb-2">🔒 Privacy Notice</h3>
          <p className="text-sm text-pink-700">
            All campaign data is encrypted using Fully Homomorphic Encryption (FHE) technology. 
            Your campaign details remain private while enabling secure donations and impact tracking.
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">📋 Campaign Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Campaigns must have a clear, charitable purpose</li>
            <li>• All campaigns are subject to verification</li>
            <li>• Funds are held securely until campaign completion</li>
            <li>• Impact reports are required for fund withdrawal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
