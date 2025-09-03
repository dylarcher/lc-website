/**
 * Test Setup Utilities for Legacy Concierge Web Components
 * Configures JSDOM environment for Web Components testing
 */

// Polyfill for Web Components in JSDOM
import './web-components-polyfill.js';

// Custom matchers for Web Components
expect.extend({
  toBeCustomElement(received) {
    const pass = received && typeof received.tagName === 'string' && received.tagName.includes('-');
    return {
      message: () => pass 
        ? `expected ${received} not to be a custom element`
        : `expected ${received} to be a custom element with hyphenated tag name`,
      pass
    };
  },
  
  toHaveShadowRoot(received) {
    const pass = received && received.shadowRoot !== null;
    return {
      message: () => pass
        ? `expected element not to have shadow root`
        : `expected element to have shadow root`,
      pass
    };
  },
  
  toHaveAttribute(received, attribute, value) {
    const pass = received.hasAttribute(attribute) && 
      (value === undefined || received.getAttribute(attribute) === value);
    return {
      message: () => pass
        ? `expected element not to have attribute ${attribute}${value ? ` with value ${value}` : ''}`
        : `expected element to have attribute ${attribute}${value ? ` with value ${value}` : ''}`,
      pass
    };
  }
});

// Global test utilities
global.createTestComponent = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  document.body.appendChild(element);
  return element;
};

global.waitForComponentReady = (element, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Component ${element.tagName} did not become ready within ${timeout}ms`));
    }, timeout);
    
    if (element.shadowRoot) {
      clearTimeout(timer);
      resolve(element);
    } else {
      const observer = new MutationObserver(() => {
        if (element.shadowRoot) {
          clearTimeout(timer);
          observer.disconnect();
          resolve(element);
        }
      });
      
      observer.observe(element, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
  });
};

global.cleanup = () => {
  document.body.innerHTML = '';
};

// Clean up after each test
afterEach(() => {
  global.cleanup();
});

// Mock console.warn for tests
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = jest.fn();
});

afterEach(() => {
  console.warn = originalWarn;
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver  
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};