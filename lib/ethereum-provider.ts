/**
 * Ethereum Provider Utilities
 * Handles ethereum provider conflicts and detection
 */

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Safely get ethereum provider with conflict handling
 */
export const getEthereumProvider = (): any | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Check if ethereum is already defined and is a valid provider
    if (window.ethereum && typeof window.ethereum.request === 'function') {
      return window.ethereum;
    }
  } catch (error) {
    console.warn('⚠️ Ethereum provider conflict detected:', error);
  }

  return null;
};

/**
 * Wait for ethereum provider to be injected by wallet extensions
 */
export const waitForEthereumProvider = (timeout: number = 10000): Promise<any> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkProvider = () => {
      const provider = getEthereumProvider();
      if (provider) {
        resolve(provider);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error('Ethereum provider not found within timeout'));
        return;
      }
      
      setTimeout(checkProvider, 100);
    };
    
    checkProvider();
  });
};

/**
 * Handle ethereum property conflicts from browser extensions
 */
export const handleEthereumConflicts = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Check if ethereum is already defined and is a valid provider
    if (window.ethereum && typeof window.ethereum.request === 'function') {
      console.log('✅ Ethereum provider already available');
    } else {
      // Wait for ethereum to be injected by wallet extensions
      const checkEthereum = () => {
        if (window.ethereum && typeof window.ethereum.request === 'function') {
          console.log('✅ Ethereum provider injected by wallet extension');
        } else {
          setTimeout(checkEthereum, 100);
        }
      };
      checkEthereum();
    }
  } catch (error) {
    console.warn('⚠️ Ethereum provider conflict detected:', error);
  }
};
