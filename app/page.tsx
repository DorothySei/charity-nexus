"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import RealCampaignList from "../components/RealCampaignList";
import FHETest from "../components/FHETest";
import CreateCampaign from "../components/CreateCampaign";
import DonationForm from "../components/DonationForm";
import ImpactTracker from "../components/ImpactTracker";
import RpcErrorHandler from "../components/RpcErrorHandler";

export default function Home() {
  const [activeTab, setActiveTab] = useState("campaigns");

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">❤️</span>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  Charity Nexus
                </h1>
                <p className="text-sm text-gray-500">Secure Giving Platform</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="charity-gradient text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Charity Nexus Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Privacy-preserving charitable giving and impact tracking using FHE technology
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-3 py-1 bg-white/20 rounded-full">🔒 FHE Encrypted</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">💝 Anonymous Donations</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">📊 Impact Tracking</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">⭐ Reputation System</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RpcErrorHandler />
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "campaigns"
                  ? "bg-pink-500 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🎯 Campaigns
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "create"
                  ? "bg-pink-500 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              ➕ Create Campaign
            </button>
            <button
              onClick={() => setActiveTab("donate")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "donate"
                  ? "bg-pink-500 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              💝 Donate
            </button>
            <button
              onClick={() => setActiveTab("impact")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "impact"
                  ? "bg-pink-500 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📊 Impact Tracker
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "campaigns" && (
            <div className="space-y-8">
              <FHETest />
              <RealCampaignList />
            </div>
          )}
          {activeTab === "create" && <CreateCampaign />}
          {activeTab === "donate" && <DonationForm />}
          {activeTab === "impact" && <ImpactTracker />}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Charity Nexus Platform</h3>
            <p className="text-gray-400 mb-6">
              Secure, private, and transparent charitable giving powered by FHE technology
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </a>
            </div>
            <p className="text-gray-500 mt-6">
              &copy; 2024 Charity Nexus Platform. Built with FHEVM technology.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
