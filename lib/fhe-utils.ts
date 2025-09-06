// FHE Encryption Utilities for Charity Nexus
// Based on Number Verse Arena implementation

// Global type declarations
declare global {
  interface Window {
    [key: string]: any;
  }
}

// FHE instance management
let fhevmInstance: any = null;
let sdkInitialized = false;

/**
 * Initialize FHEVM instance
 * Uses CDN-loaded SDK with Sepolia configuration
 */
export async function initializeFHE() {
  try {
    if (!fhevmInstance) {
      console.log('Checking available global objects...');
      console.log('Available keys:', Object.keys(window).filter(key => 
        key.toLowerCase().includes('relayer') || 
        key.toLowerCase().includes('fhe') || 
        key.toLowerCase().includes('zama')
      ));

      // Check for possible global object names
      const possibleNames = ['RelayerSDK', 'FHE', 'Zama', 'relayerSDK', 'fhe'];
      let sdk = null;

      for (const name of possibleNames) {
        if (window[name]) {
          sdk = window[name];
          console.log(`Found SDK at window.${name}:`, sdk);
          break;
        }
      }

      if (!sdk) {
        // If no explicit SDK object found, check for direct functions
        if (window['initSDK'] && window['createInstance']) {
          sdk = window;
          console.log('Found SDK functions directly on window object');
        } else {
          throw new Error('FHE SDK not found. Available window keys: ' + Object.keys(window).join(', '));
        }
      }

      // Initialize SDK
      if (!sdkInitialized && sdk.initSDK) {
        console.log('Initializing FHE SDK from CDN...');
        await sdk.initSDK();
        sdkInitialized = true;
        console.log('FHE SDK initialized successfully');
      }

      console.log('Creating FHEVM instance...');

      // Try using SepoliaConfig or manual configuration
      let config;
      if (sdk.SepoliaConfig) {
        config = {
          ...sdk.SepoliaConfig,
          network: (window as any).ethereum || "https://eth-sepolia.public.blastapi.io",
        };
        console.log('Using SepoliaConfig:', config);
      } else {
        // Manual configuration
        config = {
          aclContractAddress: "0x687820221192C5B662b25367F70076A37bc79b6c",
          kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
          inputVerifierContractAddress: "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4",
          verifyingContractAddressDecryption: "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1",
          verifyingContractAddressInputVerification: "0x7048C39f048125eDa9d678AEbaDfB22F7900a29F",
          chainId: 11155111,
          gatewayChainId: 55815,
          network: (window as any).ethereum || "https://eth-sepolia.public.blastapi.io",
          relayerUrl: "https://relayer.testnet.zama.cloud",
        };
        console.log('Using manual config:', config);
      }

      fhevmInstance = await sdk.createInstance(config);

      console.log('FHEVM relayer SDK instance initialized successfully');
    }
    return fhevmInstance;
  } catch (error) {
    console.error('Failed to initialize FHEVM relayer SDK:', error);
    console.error('Error details:', error);
    throw new Error('Failed to initialize FHE encryption');
  }
}

/**
 * Get initialized FHEVM instance
 */
export async function getFhevmInstance() {
  if (!fhevmInstance) {
    await initializeFHE();
  }
  return fhevmInstance;
}

/**
 * Encrypt 32-bit unsigned integer (donation amount) - using 32-bit FHE
 * @param value - Amount to encrypt (supports larger values up to 4.2 billion)
 * @param contractAddress - Contract address
 * @param userAddress - User address
 * @returns Encrypted data and proof
 */
export async function encryptAmount(
  value: number,
  contractAddress: string,
  userAddress: string
): Promise<{ encryptedData: string; inputProof: string }> {
  try {
    const instance = await getFhevmInstance();

    if (!instance || !instance.createEncryptedInput) {
      throw new Error('FHEVM relayer SDK instance not properly initialized');
    }

    // Ensure value is within 32-bit range (0 to 4,294,967,295)
    const clampedValue = Math.min(4294967295, Math.max(0, Math.floor(value)));
    
    console.log('Creating encrypted input for:', { 
      originalValue: value, 
      clampedValue, 
      contractAddress, 
      userAddress 
    });

    // Create encrypted input buffer
    const buffer = instance.createEncryptedInput(contractAddress, userAddress);

    // Add 32-bit unsigned integer to encrypted input
    buffer.add32(clampedValue);

    // Execute encryption and generate proof
    console.log('Encrypting value...');
    const ciphertexts = await buffer.encrypt();

    console.log('Encryption result:', ciphertexts);
    console.log('Handles:', ciphertexts.handles);
    console.log('Input proof:', ciphertexts.inputProof);

    // Ensure returned data is in correct format
    const encryptedData = ciphertexts.handles[0];
    const inputProof = ciphertexts.inputProof;

    console.log('Encrypted data type:', typeof encryptedData, encryptedData);
    console.log('Input proof type:', typeof inputProof, inputProof);

    // Convert Uint8Array to hexadecimal string
    const toHex = (uint8Array: Uint8Array): string => {
      return '0x' + Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    };

    const result = {
      encryptedData: encryptedData instanceof Uint8Array ? toHex(encryptedData) : encryptedData,
      inputProof: inputProof instanceof Uint8Array ? toHex(inputProof) : inputProof,
    };

    console.log('Converted result:', result);
    console.log('Encrypted data hex:', result.encryptedData);
    console.log('Input proof hex:', result.inputProof);

    return result;
  } catch (error) {
    console.error('Failed to encrypt amount:', error);
    throw new Error(`Failed to encrypt amount: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if FHEVM instance is initialized
 */
export function isFhevmInitialized(): boolean {
  return fhevmInstance !== null;
}

/**
 * Reset FHEVM instance (for testing or re-initialization)
 */
export function resetFhevmInstance() {
  fhevmInstance = null;
  sdkInitialized = false;
}

/**
 * Load FHEVM SDK from CDN
 */
export async function loadFHEVMSDK(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("FHEVM SDK can only be loaded on client side");
  }

  if (sdkInitialized) {
    console.log('FHEVM SDK already loaded');
    return;
  }

  return new Promise<void>((resolve, reject) => {
    // Check if SDK is already loaded
    if (window['initSDK'] && window['createInstance'] && window['SepoliaConfig']) {
      console.log('FHEVM SDK already available in window');
      sdkInitialized = true;
      resolve();
      return;
    }

    // Create script element to load SDK from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@zama-fhe/relayer-sdk@0.1.2/dist/index.js';
    script.type = 'text/javascript';
    
    script.onload = () => {
      console.log('FHEVM SDK script loaded from CDN');
      
      // Wait a bit for the script to initialize
      setTimeout(() => {
        console.log('Available window objects after script load:', Object.keys(window));
        console.log('window[initSDK]:', typeof window['initSDK']);
        console.log('window[createInstance]:', typeof window['createInstance']);
        console.log('window[SepoliaConfig]:', typeof window['SepoliaConfig']);
        
        if (window['initSDK'] && window['createInstance'] && window['SepoliaConfig']) {
          console.log('FHEVM SDK loaded from CDN successfully');
          sdkInitialized = true;
          resolve();
        } else {
          console.error('FHEVM SDK functions not available after script load');
          reject(new Error('FHEVM SDK functions not available'));
        }
      }, 1000);
    };

    script.onerror = () => {
      console.error('Failed to load FHEVM SDK from CDN');
      reject(new Error('Failed to load FHEVM SDK from CDN'));
    };

    document.head.appendChild(script);

    // Timeout after 15 seconds
    setTimeout(() => {
      if (!sdkInitialized) {
        console.error('FHEVM SDK load timeout');
        reject(new Error('FHEVM SDK load timeout'));
      }
    }, 15000);
  });
}
