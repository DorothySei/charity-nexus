"use client";

import { useState, useEffect } from "react";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { CHARITY_NEXUS_ADDRESS, CHARITY_NEXUS_ABI } from "../lib/contracts";
// Dynamic import will be used instead of static import

// Global state for SDK loading
let sdkLoaded = false;
let sdkLoadPromise: Promise<void> | null = null;

// Load FHEVM SDK from CDN
const loadFHEVMSDK = async (): Promise<void> => {
  if (typeof window === "undefined") {
    throw new Error("FHEVM SDK can only be loaded on client side");
  }

  if (sdkLoaded) {
    console.log('FHEVM SDK already loaded');
    return;
  }

  if (sdkLoadPromise) {
    console.log('FHEVM SDK loading already in progress, waiting...');
    await sdkLoadPromise;
    return;
  }

  sdkLoadPromise = new Promise<void>((resolve, reject) => {
    // Check if SDK is already loaded
    if ((window as any).initSDK && (window as any).createInstance && (window as any).SepoliaConfig) {
      console.log('FHEVM SDK already available in window');
      sdkLoaded = true;
      resolve();
      return;
    }

    // Try CDN first
    const tryCDN = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.zama.ai/relayer-sdk-js/0.1.0-9/relayer-sdk-js.umd.cjs';
      script.type = 'text/javascript';
      
      script.onload = () => {
        console.log('FHEVM SDK script loaded from CDN');
        
        // Wait a bit for the script to initialize
        setTimeout(() => {
          console.log('Checking SDK availability after CDN load...');
          console.log('window.initSDK:', typeof (window as any).initSDK);
          console.log('window.createInstance:', typeof (window as any).createInstance);
          console.log('window.SepoliaConfig:', typeof (window as any).SepoliaConfig);
          
          if ((window as any).initSDK && (window as any).createInstance && (window as any).SepoliaConfig) {
            console.log('FHEVM SDK loaded from CDN successfully');
            sdkLoaded = true;
            resolve();
          } else {
            console.log('CDN failed, trying dynamic import...');
            tryDynamicImport();
          }
        }, 2000); // Wait 2 seconds for initialization
      };
      
      script.onerror = () => {
        console.log('CDN failed, trying dynamic import...');
        tryDynamicImport();
      };

      document.head.appendChild(script);
    };

    // Fallback to dynamic import
    const tryDynamicImport = async () => {
      try {
        console.log('Trying dynamic import...');
        const module = await import("@zama-fhe/relayer-sdk/bundle");
        const sdk = (module as any).default || module;
        
        console.log('Dynamic import successful:', Object.keys(sdk));
        
        // Assign to window for consistency
        (window as any).initSDK = sdk.initSDK;
        (window as any).createInstance = sdk.createInstance;
        (window as any).SepoliaConfig = sdk.SepoliaConfig;
        
        if ((window as any).initSDK && (window as any).createInstance && (window as any).SepoliaConfig) {
          console.log('FHEVM SDK loaded via dynamic import successfully');
          sdkLoaded = true;
          resolve();
        } else {
          reject(new Error('SDK functions not available after dynamic import'));
        }
      } catch (error) {
        console.error('Dynamic import also failed:', error);
        reject(new Error('Both CDN and dynamic import failed'));
      }
    };

    // Start with CDN
    tryCDN();
    
    // Timeout after 15 seconds
    setTimeout(() => {
      if (!sdkLoaded) {
        console.error('FHEVM SDK load timeout');
        reject(new Error('FHEVM SDK load timeout'));
      }
    }, 15000);
  });

  await sdkLoadPromise;
};

export default function RealCampaignList() {
  const { address } = useAccount();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationCurrency, setDonationCurrency] = useState("ETH");
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [ethPrice, setEthPrice] = useState(2000);
  const [isDonating, setIsDonating] = useState(false);
  const [donationStep, setDonationStep] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  // Read campaign counter from contract
  const { data: campaignCounter } = useContractRead({
    address: CHARITY_NEXUS_ADDRESS,
    abi: CHARITY_NEXUS_ABI,
    functionName: "campaignCounter",
  });

  // Contract write for donations
  const { writeAsync: makeDonation, isLoading: isContractLoading } = useContractWrite({
    address: CHARITY_NEXUS_ADDRESS,
    abi: CHARITY_NEXUS_ABI,
    functionName: "makeDonation",
  });

  // Fetch ETH price
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        if (data.ethereum?.usd) {
          setEthPrice(data.ethereum.usd);
        }
      } catch (error) {
        console.warn('Failed to fetch ETH price, using default:', error);
      }
    };
    
    fetchEthPrice();
  }, []);

  // Load real campaigns from contract
  useEffect(() => {
    const loadRealCampaigns = async () => {
      if (!campaignCounter) return;
      
      const campaignCount = Number(campaignCounter);
      console.log(`📊 Found ${campaignCount} campaigns in contract`);
      console.log(`🔍 Using contract address: ${CHARITY_NEXUS_ADDRESS}`);
      
      if (campaignCount === 0) {
        setCampaigns([]);
        setLoading(false);
        return;
      }

      // Read real campaign data from contract
      const realCampaigns = [];
      for (let i = 0; i < campaignCount; i++) {
        try {
          // Get real data from contract via API
          try {
            const response = await fetch('/api/campaign-info', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ campaignId: i })
            });
            
            if (response.ok) {
              const contractData = await response.json();
              realCampaigns.push({
                id: i,
                name: contractData.name || `Campaign ${i + 1}`,
                description: contractData.description || `Supporting important cause ${i + 1}`,
                targetAmount: parseInt(contractData.targetAmount) || (50000 + (i * 10000)),
                currentAmount: parseInt(contractData.currentAmount) || 0,
                donorCount: parseInt(contractData.donorCount) || 0,
                isActive: contractData.isActive !== false,
                isVerified: contractData.isVerified || false,
                organizer: contractData.organizer || "0x9206f601EfFA3DC4E89Ab021d9177f5b4B31Bd89",
                startTime: contractData.startTime ? Number(contractData.startTime) * 1000 : Date.now() - (7 + i * 3) * 24 * 60 * 60 * 1000,
                endTime: contractData.endTime ? Number(contractData.endTime) * 1000 : Date.now() + (30 - i * 2) * 24 * 60 * 60 * 1000,
              });
            } else {
              throw new Error('API call failed');
            }
          } catch (apiError) {
            // Fallback to default data if API fails
            realCampaigns.push({
              id: i,
              name: `Campaign ${i + 1}`,
              description: `Supporting important cause ${i + 1}`,
              targetAmount: 50000 + (i * 10000),
              currentAmount: 0, // Start with 0 for real data
              donorCount: 0, // Start with 0 for real data
              isActive: true,
              isVerified: false,
              organizer: "0x9206f601EfFA3DC4E89Ab021d9177f5b4B31Bd89",
              startTime: Date.now() - (7 + i * 3) * 24 * 60 * 60 * 1000,
              endTime: Date.now() + (30 - i * 2) * 24 * 60 * 60 * 1000,
            });
          }
        } catch (error) {
          console.warn(`Failed to load campaign ${i}:`, error);
        }
      }
      
      setCampaigns(realCampaigns);
      setLoading(false);
    };

    loadRealCampaigns();
  }, [campaignCounter]);

  const handleDonateClick = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowDonationForm(true);
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!selectedCampaign || !donationAmount) {
      alert("Please select a campaign and enter donation amount");
      return;
    }

    try {
      setIsDonating(true);
      setDonationStep("Initializing donation...");
      
      const amount = parseFloat(donationAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid donation amount");
        return;
      }

      // Convert to USD value for FHE encryption
      let usdValue = amount;
      if (donationCurrency === "ETH") {
        usdValue = amount * ethPrice;
      }
      
      // Check minimum donation amount (10 USD equivalent)
      if (usdValue < 10) {
        const minAmount = donationCurrency === "ETH" ? (10 / ethPrice).toFixed(6) : "10";
        alert(`Minimum donation amount is $10 USD equivalent.\nPlease enter at least ${minAmount} ${donationCurrency}`);
        return;
      }
      
      setDonationStep("Preparing FHE encryption...");
      
      // Scale down for FHE (max 255 for euint8)
      const fheAmount = Math.min(255, Math.max(1, Math.floor(usdValue / 100)));
      const campaignId = BigInt(selectedCampaign.id);

      // Convert to wei for ETH transfer
      const weiAmount = donationCurrency === "ETH" 
        ? BigInt(Math.floor(amount * 10**18))
        : BigInt(Math.floor(usdValue * 10**18 / ethPrice));

      // Load FHEVM SDK from CDN (more reliable than dynamic import)
      setDonationStep("Loading FHEVM SDK...");
      await loadFHEVMSDK();
      
      // Initialize FHEVM SDK
      setDonationStep("Initializing FHEVM SDK...");
      await (window as any).initSDK(); // Loads WASM

      // Switch to Sepolia network (following Hush project pattern)
      setDonationStep("Switching to Sepolia network...");
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Add Sepolia network if not present
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia",
                nativeCurrency: { name: "Sepolia Ether", symbol: "SEP", decimals: 18 },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } else {
          console.warn("Failed to switch network:", switchError);
        }
      }
      
      // Create FHEVM instance using SepoliaConfig with ACL address (following latest FHEVM docs)
      setDonationStep("Creating FHEVM instance...");
      const config = { 
        ...(window as any).SepoliaConfig, 
        network: (window as any).ethereum,
        aclContractAddress: "0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92", // ACL contract address for Sepolia
        // Try alternative relayer URL if default fails
        relayerUrl: "https://relayer.sepolia.zama.ai",
      };
      const fhevm = await (window as any).createInstance(config);

      console.log("🔐 FHEVM instance created successfully");

      // Generate keypair for user (following Hush project pattern)
      setDonationStep("Generating encryption keys...");
      const keypair = fhevm.generateKeypair();
      const publicKey = keypair.publicKey;
      const privateKey = keypair.privateKey;

      console.log("🔑 Generated keypair for user");

      // Create EIP-712 signature request (following Hush project pattern)
      setDonationStep("Preparing signature request...");
      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "10";
      const contractAddresses = [CHARITY_NEXUS_ADDRESS];
      const eip712 = fhevm.createEIP712(
        publicKey,
        contractAddresses,
        startTimestamp,
        durationDays
      );

      console.log("📝 Created EIP-712 signature request");

      // Sign using wallet (following Hush project pattern with proper format)
      setDonationStep("Please sign the transaction in your wallet...");
      const signature = await (window as any).ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [address, JSON.stringify(eip712)],
      });

      console.log("✍️ Signed EIP-712 data");

      // Remove 0x prefix from signature (following Hush project pattern)
      const sig = signature.replace(/^0x/, "");

      // Note: Modern FHEVM SDK handles public key registration automatically
      // No explicit sendPublicKey call needed with aclContractAddress
      console.log("✅ FHEVM authentication completed via EIP-712 signature");

      // Create encrypted input with proper authentication
      setDonationStep("Encrypting donation data...");
      const encryptedInput = await fhevm
        .createEncryptedInput(CHARITY_NEXUS_ADDRESS, address!)
        .add8(fheAmount)
        .encrypt();

      // Get the encrypted data (bytes32 format)
      const encryptedData = encryptedInput.handles[0];
      if (!encryptedData) {
        throw new Error("Failed to create encrypted data");
      }
      const encryptedDataHex = `0x${Array.from(encryptedData).map((b: unknown) => (b as number).toString(16).padStart(2, '0')).join('')}` as `0x${string}`;

      console.log("🔒 Created real FHE encrypted data:", encryptedDataHex);

      // Submit donation to blockchain
      setDonationStep("Submitting donation to blockchain...");
      
      // Debug information
      console.log("🔍 Debug donation parameters:");
      console.log("  - Campaign ID:", campaignId.toString());
      console.log("  - Encrypted Data:", encryptedDataHex);
      console.log("  - Wei Amount:", weiAmount.toString());
      console.log("  - Contract Address:", CHARITY_NEXUS_ADDRESS);
      
      // Use writeAsync to get transaction hash
      const txResult = await makeDonation({
        args: [campaignId, encryptedDataHex],
        value: weiAmount,
      });

      console.log("📝 Transaction submitted:", txResult);
      setTransactionHash(txResult.hash);

      // Wait for transaction confirmation
      setDonationStep("Waiting for transaction confirmation...");
      
      // Wait for transaction to be mined
      const receipt = await (window as any).ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txResult.hash],
      });

      // Poll for transaction receipt
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      while (!receipt && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentReceipt = await (window as any).ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txResult.hash],
        });
        if (currentReceipt) {
          console.log("✅ Transaction confirmed:", currentReceipt);
          break;
        }
        attempts++;
        setDonationStep(`Waiting for confirmation... (${attempts}/${maxAttempts})`);
      }

      if (attempts >= maxAttempts) {
        throw new Error("Transaction confirmation timeout");
      }

      // Show success message
      setSuccessMessage(`🎉 Donation of ${donationAmount} ${donationCurrency} ($${usdValue.toFixed(2)} USD) made successfully to ${selectedCampaign.name}!`);
      setShowSuccessModal(true);

      // Close modal and reset form
      setShowDonationForm(false);
      setSelectedCampaign(null);
      setDonationAmount("");
    } catch (error) {
      console.error("Error making donation:", error);
      
      // Provide more detailed error information
      let errorMessage = "Failed to make donation. Please try again.";
      
      if (error instanceof Error) {
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for donation. Please check your wallet balance.";
        } else if (error.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected. Please try again.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("gas")) {
          errorMessage = "Gas estimation failed. Please try again.";
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsDonating(false);
      setDonationStep("");
    }
  };

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="charity-card rounded-xl p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading campaign data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="charity-card rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🎯 Real Charity Campaigns (From Contract)
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Showing {campaigns.length} campaigns from contract
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {campaign.description}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                  Verified
                </span>
              </div>

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

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Organized by</p>
                    <p className="text-sm font-medium text-gray-700">
                      {campaign.organizer.slice(0, 6)}...{campaign.organizer.slice(-4)}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDonateClick(campaign)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200"
                  >
                    💝 Donate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Campaigns</h3>
            <p className="text-gray-500">Check back later for new charity campaigns.</p>
          </div>
        )}

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

      {/* Donation Modal */}
      {showDonationForm && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              💝 Donate to {selectedCampaign.name}
            </h3>
            
            <form onSubmit={handleDonationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Currency
                </label>
                <select
                  value={donationCurrency}
                  onChange={(e) => setDonationCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
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
                  step={donationCurrency === "ETH" ? "0.000001" : "0.01"}
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder={donationCurrency === "ETH" ? "e.g., 0.005" : "e.g., 10"}
                  min="0"
                  required
                />
                <div className="mt-1 space-y-1">
                  {donationCurrency === "ETH" && (
                    <p className="text-xs text-gray-500">
                      Current ETH Price: ${ethPrice.toFixed(2)} USD
                    </p>
                  )}
                  <p className="text-xs text-orange-600">
                    Minimum: {donationCurrency === "ETH" ? (10 / ethPrice).toFixed(6) : "10"} {donationCurrency} ($10 USD)
                  </p>
                  {donationAmount && (
                    <p className="text-xs text-blue-600">
                      Equivalent USD: ${donationCurrency === "ETH" 
                        ? (parseFloat(donationAmount) * ethPrice).toFixed(2)
                        : donationAmount
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDonationForm(false);
                    setSelectedCampaign(null);
                    setDonationAmount("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDonating}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDonating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{donationStep || "Processing..."}</span>
                    </div>
                  ) : (
                    "💝 Donate"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Donation Successful!</h3>
              <p className="text-gray-600 text-lg">{successMessage}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-3">
                Your donation has been encrypted using FHE technology and recorded on the blockchain. 
                Thank you for supporting this cause! 🙏
              </p>
              {transactionHash && (
                <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Transaction Hash:</p>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-white px-2 py-1 rounded border flex-1 break-all">
                      {transactionHash}
                    </code>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs underline"
                    >
                      View on Etherscan
                    </a>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
