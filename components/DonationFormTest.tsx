"use client";

import { useState } from "react";

export default function DonationFormTest() {
  const [donationAmount, setDonationAmount] = useState("");
  const [donationCurrency, setDonationCurrency] = useState("ETH");
  const [ethPrice] = useState(2000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { donationAmount, donationCurrency });
    alert(`Donation: ${donationAmount} ${donationCurrency}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Donation Form Test</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Currency
          </label>
          <select
            value={donationCurrency}
            onChange={(e) => setDonationCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="ETH">ETH (Ethereum)</option>
            <option value="USD">USD (US Dollar)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount ({donationCurrency})
          </label>
          <input
            type="number"
            step="0.01"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder={donationCurrency === "ETH" ? "e.g., 0.1" : "e.g., 100"}
            min="0.01"
            required
          />
          {donationCurrency === "ETH" && (
            <p className="text-xs text-gray-500 mt-1">
              Current ETH Price: ${ethPrice.toFixed(2)} USD
            </p>
          )}
          {donationAmount && (
            <p className="text-xs text-blue-600 mt-1">
              Equivalent USD: ${donationCurrency === "ETH" 
                ? (parseFloat(donationAmount) * ethPrice).toFixed(2)
                : donationAmount
              }
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200"
        >
          Test Donation
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-100 rounded">
        <h3 className="font-semibold">Debug Info:</h3>
        <p>Currency: {donationCurrency}</p>
        <p>Amount: {donationAmount}</p>
        <p>ETH Price: ${ethPrice}</p>
      </div>
    </div>
  );
}
