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

  // Enhanced Web3 provider detection with reduced logging
  let hasLoggedProvider = false;
  
  const checkWeb3Provider = () => {
    if (window.ethereum) {
      if (!hasLoggedProvider) {
        if (window.ethereum.isMetaMask) {
          console.log('MetaMask detected and ready');
        } else if (window.ethereum.isCoinbaseWallet) {
          console.log('Coinbase Wallet detected');
        } else {
          console.log('Generic Web3 provider detected');
        }
        hasLoggedProvider = true;
      }
      return true;
    } else if (window.web3?.currentProvider) {
      if (!hasLoggedProvider) {
        console.log('Legacy Web3 provider detected');
        hasLoggedProvider = true;
      }
      return true;
    } else {
      if (!hasLoggedProvider) {
        console.log('No Web3 provider detected - install MetaMask for full functionality');
        hasLoggedProvider = true;
      }
      return false;
    }
  };

  // Check immediately
  const hasProvider = checkWeb3Provider();
  
  if (!hasProvider) {
    // Single retry after 2 seconds for delayed provider injection
    setTimeout(() => {
      checkWeb3Provider();
    }, 2000);
  }

  // Listen for provider injection events
  window.addEventListener('ethereum#initialized', () => {
    hasLoggedProvider = false;
    checkWeb3Provider();
  });
}