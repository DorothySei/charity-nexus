"use client";

import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import { CHARITY_NEXUS_ADDRESS, CHARITY_NEXUS_ABI } from "../lib/contracts";

export default function CampaignList() {
  const { address } = useAccount();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Read campaign counter from contract
  const { data: campaignCounter } = useContractRead({
    address: CHARITY_NEXUS_ADDRESS,
    abi: CHARITY_NEXUS_ABI,
    functionName: "campaignCounter",
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockCampaigns = [
      {
        id: 1,
        name: "Clean Water Initiative",
        description: "Providing clean water access to rural communities",
        targetAmount: 50000,
        currentAmount: 32500,
        donorCount: 156,
        isActive: true,
        isVerified: true,
        organizer: "0x1234...5678",
        startTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
        endTime: Date.now() + 23 * 24 * 60 * 60 * 1000,
      },
      {
        id: 2,
        name: "Education for All",
        description: "Building schools and providing educational resources",
        targetAmount: 75000,
        currentAmount: 45000,
        donorCount: 89,
        isActive: true,
        isVerified: true,
        organizer: "0x9876...5432",
        startTime: Date.now() - 14 * 24 * 60 * 60 * 1000,
        endTime: Date.now() + 16 * 24 * 60 * 60 * 1000,
      },
      {
        id: 3,
        name: "Emergency Relief Fund",
        description: "Supporting communities affected by natural disasters",
        targetAmount: 100000,
        currentAmount: 78000,
        donorCount: 234,
        isActive: true,
        isVerified: false,
        organizer: "0xabcd...efgh",
        startTime: Date.now() - 3 * 24 * 60 * 60 * 1000,
        endTime: Date.now() + 27 * 24 * 60 * 60 * 1000,
      },
    ];
    
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setLoading(false);
    }, 1000);
  }, []);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const getTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return "Ended";
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    return `${days}d ${hours}h`;
  };

  const getStatusColor = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return "bg-gray-100 text-gray-600";
    if (isVerified) return "bg-green-100 text-green-600";
    return "bg-yellow-100 text-yellow-600";
  };

  const getStatusText = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return "Ended";
    if (isVerified) return "Verified";
    return "Pending Verification";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="charity-card rounded-xl p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="charity-card rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🎯 Active Charity Campaigns
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
              {/* Campaign Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {campaign.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.isActive, campaign.isVerified)}`}>
                  {getStatusText(campaign.isActive, campaign.isVerified)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{getProgressPercentage(campaign.currentAmount, campaign.targetAmount).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(campaign.currentAmount, campaign.targetAmount)}%` }}
                  ></div>
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    ${campaign.currentAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">Raised</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {campaign.donorCount}
                  </div>
                  <p className="text-xs text-gray-500">Donors</p>
                </div>
              </div>

              {/* Target and Time */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-700">
                    ${campaign.targetAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">Target</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {getTimeRemaining(campaign.endTime)}
                  </div>
                  <p className="text-xs text-gray-500">Remaining</p>
                </div>
              </div>

              {/* Organizer Info */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Organized by</p>
                    <p className="text-sm font-medium text-gray-700">
                      {campaign.organizer}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200">
                    💝 Donate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Campaigns</h3>
            <p className="text-gray-500">Check back later for new charity campaigns.</p>
          </div>
        )}

        {/* Campaign Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {campaigns.length}
            </div>
            <p className="text-sm text-gray-600">Active Campaigns</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${campaigns.reduce((sum, c) => sum + c.currentAmount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Raised</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {campaigns.reduce((sum, c) => sum + c.donorCount, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Donors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
