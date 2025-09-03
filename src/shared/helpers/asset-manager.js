// Bridge Theme Asset Manager
// Handles dynamic loading of CSS, JS, and other assets similar to WordPress theme

class BridgeAssetManager {
  constructor() {
    this.loadedAssets = new Set();
    this.loadingPromises = new Map();
    this.version = '1.0.0'; // Theme version for cache busting
  }

  /**
   * Load CSS file dynamically
   * @param {string} href - Path to CSS file
   * @param {string} id - Optional ID for the link element
   * @param {boolean} async - Whether to load asynchronously
   */
  async loadCSS(href, id = null, async = false) {
    const fullPath = this.resolveAssetPath(href);
    
    if (this.loadedAssets.has(fullPath)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(fullPath)) {
      return this.loadingPromises.get(fullPath);
    }

    const promise = new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.addVersionParam(fullPath);
      
      if (id) {
        link.id = id;
      }

      if (async) {
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
          this.loadedAssets.add(fullPath);
          resolve();
        };
      } else {
        link.onload = () => {
          this.loadedAssets.add(fullPath);
          resolve();
        };
      }

      link.onerror = () => {
        reject(new Error(`Failed to load CSS: ${fullPath}`));
      };

      document.head.appendChild(link);
    });

    this.loadingPromises.set(fullPath, promise);
    return promise;
  }

  /**
   * Load JavaScript file dynamically
   * @param {string} src - Path to JS file
   * @param {string} id - Optional ID for the script element
   * @param {boolean} defer - Whether to defer execution
   * @param {boolean} async - Whether to load asynchronously
   */
  async loadJS(src, id = null, defer = false, async = false) {
    const fullPath = this.resolveAssetPath(src);
    
    if (this.loadedAssets.has(fullPath)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(fullPath)) {
      return this.loadingPromises.get(fullPath);
    }

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.addVersionParam(fullPath);
      
      if (id) {
        script.id = id;
      }
      
      if (defer) {
        script.defer = true;
      }
      
      if (async) {
        script.async = true;
      }

      script.onload = () => {
        this.loadedAssets.add(fullPath);
        resolve();
      };

      script.onerror = () => {
        reject(new Error(`Failed to load JS: ${fullPath}`));
      };

      document.head.appendChild(script);
    });

    this.loadingPromises.set(fullPath, promise);
    return promise;
  }

  /**
   * Load multiple assets
   * @param {Array} assets - Array of asset objects {type: 'css'|'js', src: 'path', ...options}
   */
  async loadAssets(assets) {
    const promises = assets.map(asset => {
      if (asset.type === 'css') {
        return this.loadCSS(asset.src, asset.id, asset.async);
      } else if (asset.type === 'js') {
        return this.loadJS(asset.src, asset.id, asset.defer, asset.async);
      }
      return Promise.resolve();
    });

    return Promise.all(promises);
  }

  /**
   * Preload assets for better performance
   * @param {Array} assets - Array of asset paths
   * @param {string} type - Asset type ('style', 'script', 'image', etc.)
   */
  preloadAssets(assets, type = 'style') {
    assets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = this.resolveAssetPath(asset);
      link.as = type;
      
      if (type === 'style') {
        link.onload = () => {
          link.rel = 'stylesheet';
        };
      }
      
      document.head.appendChild(link);
    });
  }

  /**
   * Load Google Fonts
   * @param {Array} fonts - Array of font family strings
   * @param {string} display - Font display property
   */
  async loadGoogleFonts(fonts, display = 'swap') {
    const fontFamilies = fonts.join('|');
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamilies)}&display=${display}`;
    
    return this.loadCSS(url, 'google-fonts');
  }

  /**
   * Load Font Awesome icons
   * @param {string} version - Font Awesome version
   * @param {string} type - 'all', 'solid', 'regular', 'light', 'brands'
   */
  async loadFontAwesome(version = '6.0.0', type = 'all') {
    const url = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${version}/css/${type === 'all' ? 'all' : `fa-${type}`}.min.css`;
    
    return this.loadCSS(url, 'font-awesome');
  }

  /**
   * Resolve asset path based on current location
   * @param {string} path - Asset path
   */
  resolveAssetPath(path) {
    // If it's already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
      return path;
    }

    // If it's a relative path starting with './', resolve it
    if (path.startsWith('./')) {
      const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
      return `${basePath}/${path.substring(2)}`;
    }

    // If it's an absolute path starting with '/', return as is
    if (path.startsWith('/')) {
      return path;
    }

    // Otherwise, treat as relative to current directory
    return `./${path}`;
  }

  /**
   * Add version parameter for cache busting
   * @param {string} path - Asset path
   */
  addVersionParam(path) {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}v=${this.version}`;
  }

  /**
   * Remove loaded asset
   * @param {string} path - Asset path to remove
   * @param {string} type - Asset type ('css' or 'js')
   */
  removeAsset(path, type = 'css') {
    const fullPath = this.resolveAssetPath(path);
    
    if (type === 'css') {
      const link = document.querySelector(`link[href*="${path}"]`);
      if (link) {
        link.remove();
      }
    } else if (type === 'js') {
      const script = document.querySelector(`script[src*="${path}"]`);
      if (script) {
        script.remove();
      }
    }

    this.loadedAssets.delete(fullPath);
    this.loadingPromises.delete(fullPath);
  }

  /**
   * Check if asset is loaded
   * @param {string} path - Asset path
   */
  isLoaded(path) {
    const fullPath = this.resolveAssetPath(path);
    return this.loadedAssets.has(fullPath);
  }

  /**
   * Get all loaded assets
   */
  getLoadedAssets() {
    return Array.from(this.loadedAssets);
  }

  /**
   * Clear all loaded assets tracking (doesn't remove from DOM)
   */
  clearCache() {
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }
}

// Bridge Theme specific asset presets
export const BRIDGE_ASSET_PRESETS = {
  // Core theme assets
  core: [
    { type: 'css', src: './shared/styles/bridge-core.css', id: 'bridge-core' },
    { type: 'css', src: './shared/styles/bridge-layout.css', id: 'bridge-layout' },
    { type: 'css', src: './shared/styles/bridge-responsive.css', id: 'bridge-responsive' }
  ],

  // Icon fonts
  icons: [
    { type: 'css', src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', id: 'font-awesome' }
  ],

  // Fonts
  fonts: [
    'Raleway:ital,wght@0,100..900;1,100..900',
    'Montserrat:ital,wght@0,100..900;1,100..900'
  ],

  // Animation libraries (optional)
  animations: [
    { type: 'css', src: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', id: 'animate-css', async: true }
  ],

  // Development tools (only in dev mode)
  dev: [
    { type: 'js', src: './shared/helpers/bridge-dev-tools.js', id: 'bridge-dev', defer: true }
  ]
};

// Create global instance
const bridgeAssetManager = new BridgeAssetManager();

// Auto-load core assets when module loads
bridgeAssetManager.loadAssets(BRIDGE_ASSET_PRESETS.core).catch(console.error);
bridgeAssetManager.loadAssets(BRIDGE_ASSET_PRESETS.icons).catch(console.error);

export default bridgeAssetManager;