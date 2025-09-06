"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
// Dynamic import will be used instead of static import
import { CHARITY_NEXUS_ADDRESS } from "../lib/contracts";

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

export default function FHETest() {
  const { address } = useAccount();
  const [testResult, setTestResult] = useState<string>("");
  const [isTesting, setIsTesting] = useState(false);

  const testFHEVM = async () => {
    if (!address) {
      setTestResult("Please connect your wallet first");
      return;
    }

    setIsTesting(true);
    setTestResult("Testing FHEVM SDK...");

    try {
      // Load FHEVM SDK from CDN (more reliable than dynamic import)
      await loadFHEVMSDK();
      
      // Initialize FHEVM SDK
      await (window as any).initSDK(); // Loads WASM
      
      // Create FHEVM instance using SepoliaConfig with proper configuration
      const config = { 
        ...(window as any).SepoliaConfig, 
        network: (window as any).ethereum,
        // Add explicit configuration for Sepolia
        chainId: 11155111,
        gatewayChainId: 11155111,
      };
      const fhevm = await (window as any).createInstance(config);

      setTestResult("✅ FHEVM instance created successfully!");

      // Generate keypair for user (following Hush project pattern)
      const keypair = fhevm.generateKeypair();
      const publicKey = keypair.publicKey;
      const privateKey = keypair.privateKey;

      console.log("🔑 Generated keypair for user");

      // Create EIP-712 signature request (following Hush project pattern)
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

      // Sign using wallet (following Hush project pattern)
      const signature = await (window as any).ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [address, JSON.stringify(eip712)],
      });

      console.log("✍️ Signed EIP-712 data");

      // Test creating encrypted input with proper authentication
      const encryptedInput = await fhevm
        .createEncryptedInput(CHARITY_NEXUS_ADDRESS, address)
        .add8(1)
        .encrypt();

      // Get the encrypted data
      const encryptedData = encryptedInput.handles[0];
      if (!encryptedData) {
        throw new Error("Failed to create encrypted data");
      }
      const encryptedDataHex = `0x${Array.from(encryptedData).map((b: unknown) => (b as number).toString(16).padStart(2, '0')).join('')}`;

      setTestResult("✅ Real FHE encryption test successful! Encrypted data created.");
      console.log("Real encrypted data:", encryptedDataHex);

    } catch (error: any) {
      setTestResult(`❌ FHEVM test failed: ${error.message}`);
      console.error("FHEVM test error:", error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">FHEVM SDK Test</h3>
      <button
        onClick={testFHEVM}
        disabled={isTesting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isTesting ? "Testing..." : "Test FHEVM SDK"}
      </button>
      {testResult && (
        <div className="mt-4 p-3 bg-white border rounded">
          <pre className="text-sm">{testResult}</pre>
        </div>
      )}
    </div>
  );
}
