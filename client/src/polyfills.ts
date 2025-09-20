import { Buffer } from 'buffer'

// Polyfill Buffer for browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
  window.global = window.global ?? window
  window.process = window.process ?? { 
    env: { 
      NODE_ENV: 'development',
      VITE_ENABLE_WEB3: 'true'
    } 
  }

  // Enhanced Web3 provider detection
  const checkWeb3Provider = () => {
    if (window.ethereum) {
      if (window.ethereum.isMetaMask) {
        console.log('MetaMask detected and ready');
      } else if (window.ethereum.isCoinbaseWallet) {
        console.log('Coinbase Wallet detected');
      } else {
        console.log('Generic Web3 provider detected');
      }
      return true;
    } else if (window.web3?.currentProvider) {
      console.log('Legacy Web3 provider detected');
      return true;
    } else {
      console.log('No Web3 provider detected - some features may be limited');
      return false;
    }
  };

  // Check immediately and set up listener for delayed provider injection
  const hasProvider = checkWeb3Provider();
  
  if (!hasProvider) {
    // Some wallets inject the provider asynchronously
    let attempts = 0;
    const maxAttempts = 10;
    const checkInterval = setInterval(() => {
      attempts++;
      if (checkWeb3Provider() || attempts >= maxAttempts) {
        clearInterval(checkInterval);
      }
    }, 100);
  }

  // Listen for provider injection events
  window.addEventListener('ethereum#initialized', checkWeb3Provider);
}