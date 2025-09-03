/**
 * Web Components Polyfill for JSDOM Testing
 * Provides minimal Web Components API support in test environment
 */

// Custom Elements polyfill
if (!global.customElements) {
  global.customElements = {
    define: jest.fn((name, constructor) => {
      global[name] = constructor;
    }),
    get: jest.fn(),
    whenDefined: jest.fn(() => Promise.resolve()),
    upgrade: jest.fn()
  };
}

// HTMLElement with basic Web Components support
if (typeof global.HTMLElement === 'undefined') {
  global.HTMLElement = class HTMLElement {
    constructor() {
      this.shadowRoot = null;
      this.innerHTML = '';
      this.style = {};
      this.classList = {
        add: jest.fn(),
        remove: jest.fn(),
        contains: jest.fn(() => false),
        toggle: jest.fn()
      };
    }
    
    attachShadow({ mode } = { mode: 'open' }) {
      this.shadowRoot = {
        innerHTML: '',
        appendChild: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(() => []),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      };
      return this.shadowRoot;
    }
    
    getAttribute(name) {
      return this.attributes && this.attributes[name];
    }
    
    setAttribute(name, value) {
      this.attributes = this.attributes || {};
      this.attributes[name] = value;
    }
    
    hasAttribute(name) {
      return this.attributes && this.attributes.hasOwnProperty(name);
    }
    
    removeAttribute(name) {
      if (this.attributes) {
        delete this.attributes[name];
      }
    }
    
    addEventListener(event, handler) {
      this.eventListeners = this.eventListeners || {};
      this.eventListeners[event] = this.eventListeners[event] || [];
      this.eventListeners[event].push(handler);
    }
    
    removeEventListener(event, handler) {
      if (this.eventListeners && this.eventListeners[event]) {
        const index = this.eventListeners[event].indexOf(handler);
        if (index > -1) {
          this.eventListeners[event].splice(index, 1);
        }
      }
    }
    
    dispatchEvent(event) {
      if (this.eventListeners && this.eventListeners[event.type]) {
        this.eventListeners[event.type].forEach(handler => handler(event));
      }
    }
    
    querySelector(selector) {
      return null;
    }
    
    querySelectorAll(selector) {
      return [];
    }
    
    appendChild(child) {
      this.children = this.children || [];
      this.children.push(child);
      return child;
    }
  };
}

// Document methods for creating elements
if (global.document) {
  const originalCreateElement = global.document.createElement;
  global.document.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    
    // Add Web Components methods to created elements
    if (!element.attachShadow) {
      element.attachShadow = function({ mode } = { mode: 'open' }) {
        this.shadowRoot = {
          innerHTML: '',
          appendChild: jest.fn(),
          querySelector: jest.fn(),
          querySelectorAll: jest.fn(() => []),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn()
        };
        return this.shadowRoot;
      };
    }
    
    return element;
  };
}

// Custom Event constructor
if (!global.CustomEvent) {
  global.CustomEvent = class CustomEvent extends Event {
    constructor(type, options = {}) {
      super(type, options);
      this.detail = options.detail;
    }
  };
}

// Template element support
if (!global.HTMLTemplateElement) {
  global.HTMLTemplateElement = class HTMLTemplateElement extends HTMLElement {
    constructor() {
      super();
      this.content = {
        cloneNode: jest.fn(() => this),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(() => [])
      };
    }
  };
}