
import { Buffer } from 'buffer';

// Make Buffer available globally for browser compatibility
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window.global || window;
  
  // Polyfill for require function
  if (!window.require) {
    window.require = (moduleName: string) => {
      if (moduleName === 'buffer') {
        return { Buffer };
      }
      throw new Error(`Module '${moduleName}' not found`);
    };
  }
  
  // Polyfill for process
  if (!window.process) {
    window.process = {
      env: {},
      version: '',
      versions: {},
      browser: true,
      nextTick: (fn: Function) => setTimeout(fn, 0),
    } as any;
  }
}

// Export for ES modules
export { Buffer };
