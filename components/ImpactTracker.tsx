"use client";

import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";

export default function ImpactTracker() {
  const { address } = useAccount();
  const [campaignId, setCampaignId] = useState("");
  const [impactData, setImpactData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockImpactData = {
    campaignId: 1,
    campaignName: "Clean Water Initiative",
    totalDonations: 32500,
    beneficiariesReached: 1250,
    fundsUtilized: 28000,
    impactReports: [
      {
        id: 1,
        beneficiariesReached: 500,
        fundsUtilized: 12000,
        isVerified: true,
        reportHash: "QmWaterReport1",
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
      },
      {
        id: 2,
        beneficiariesReached: 750,
        fundsUtilized: 16000,
        isVerified: true,
        reportHash: "QmWaterReport2",
        timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
      },
    ],
  };

  const handleLookup = () => {
    if (!campaignId) return;
    
    setLoading(true);
    setTimeout(() => {
      setImpactData(mockImpactData);
      setLoading(false);
    }, 1000);
  };

  const getVerificationStatus = (isVerified: boolean) => {
    return isVerified ? (
      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
        ✅ Verified
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">
        ⏳ Pending
      </span>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="charity-card rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📊 Impact Tracker
        </h2>

        {/* Campaign Lookup */}
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="number"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Enter Campaign ID"
            />
            <button
              onClick={handleLookup}
              disabled={loading}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "🔍 Track Impact"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading impact data...</p>
          </div>
        )}

        {/* Impact Data */}
        {impactData && !loading && (
          <div className="space-y-8">
            {/* Campaign Overview */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📈 Campaign Impact Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">
                    ${impactData.totalDonations.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Total Donations</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {impactData.beneficiariesReached.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Beneficiaries Reached</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ${impactData.fundsUtilized.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Funds Utilized</p>
                </div>
              </div>
            </div>

            {/* Impact Reports */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📋 Impact Reports
              </h3>
              <div className="space-y-4">
                {impactData.impactReports.map((report: any) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">
                        Impact Report #{report.id}
                      </h4>
                      {getVerificationStatus(report.isVerified)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Beneficiaries Reached</p>
                        <p className="text-lg font-semibold text-green-600">
                          {report.beneficiariesReached}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Funds Utilized</p>
                        <p className="text-lg font-semibold text-blue-600">
                          ${report.fundsUtilized.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Report Date</p>
                        <p className="text-lg font-semibold text-gray-700">
                          {formatDate(report.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Report Hash:</strong> {report.reportHash}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h4 className="font-semibold text-gray-800 mb-4">💰 Fund Utilization</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Donations</span>
                    <span className="font-medium">${impactData.totalDonations.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Funds Utilized</span>
                    <span className="font-medium">${impactData.fundsUtilized.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Utilization Rate</span>
                    <span className="font-medium text-green-600">
                      {((impactData.fundsUtilized / impactData.totalDonations) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h4 className="font-semibold text-gray-800 mb-4">👥 Beneficiary Impact</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Beneficiaries</span>
                    <span className="font-medium">{impactData.beneficiariesReached.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cost per Beneficiary</span>
                    <span className="font-medium">
                      ${(impactData.fundsUtilized / impactData.beneficiariesReached).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Impact Efficiency</span>
                    <span className="font-medium text-blue-600">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Visualization */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h4 className="font-semibold text-gray-800 mb-4">📊 Impact Timeline</h4>
              <div className="space-y-4">
                {impactData.impactReports.map((report: any, index: number) => (
                  <div key={report.id} className="flex items-center">
                    <div className="w-4 h-4 bg-pink-500 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Report #{report.id}</span>
                        <span className="text-sm text-gray-600">{formatDate(report.timestamp)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {report.beneficiariesReached} beneficiaries reached, ${report.fundsUtilized.toLocaleString()} utilized
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!impactData && !loading && campaignId && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Impact Data Found</h3>
            <p className="text-gray-500">Please check the campaign ID and try again.</p>
          </div>
        )}

        {/* Initial State */}
        {!campaignId && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Track Campaign Impact</h3>
            <p className="text-gray-500">Enter a campaign ID above to view impact data and reports.</p>
          </div>
        )}
      </div>
    </div>
  );
}
