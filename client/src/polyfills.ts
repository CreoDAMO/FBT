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

  // Handle Web3 service compatibility
  if (!window.ethereum) {
    console.log('Web3 provider not detected - running in compatibility mode')
  }
}