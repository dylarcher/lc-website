// Bridge Theme Utilities
// Common utilities and helper functions similar to WordPress theme functions

/**
 * Bridge Theme Configuration and Utilities
 */
export class BridgeThemeUtils {
  constructor() {
    this.options = this.loadThemeOptions();
    this.breakpoints = {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    };
  }

  /**
   * Load theme options from localStorage or set defaults
   */
  loadThemeOptions() {
    const defaultOptions = {
      // Layout options
      responsiveness: true,
      containerWidth: 1200,
      
      // Header options
      headerType: 'default',
      headerSticky: true,
      headerTransparent: false,
      
      // Footer options
      footerColumns: 4,
      footerInGrid: true,
      
      // Colors
      primaryColor: '#1abc9c',
      secondaryColor: '#2c3e50',
      accentColor: '#e74c3c',
      
      // Typography
      primaryFont: 'Raleway',
      secondaryFont: 'Georgia',
      fontSize: 16,
      
      // Animations
      enableAnimations: true,
      animationDuration: 600,
      
      // Performance
      lazyLoading: true,
      imageOptimization: true
    };

    try {
      const saved = localStorage.getItem('bridge-theme-options');
      return saved ? { ...defaultOptions, ...JSON.parse(saved) } : defaultOptions;
    } catch (error) {
      console.warn('Failed to load theme options:', error);
      return defaultOptions;
    }
  }

  /**
   * Save theme options to localStorage
   */
  saveThemeOptions() {
    try {
      localStorage.setItem('bridge-theme-options', JSON.stringify(this.options));
    } catch (error) {
      console.warn('Failed to save theme options:', error);
    }
  }

  /**
   * Get theme option value
   * @param {string} key - Option key
   * @param {*} defaultValue - Default value if key doesn't exist
   */
  getOption(key, defaultValue = null) {
    return this.options[key] !== undefined ? this.options[key] : defaultValue;
  }

  /**
   * Set theme option value
   * @param {string} key - Option key
   * @param {*} value - Option value
   */
  setOption(key, value) {
    this.options[key] = value;
    this.saveThemeOptions();
    this.dispatchOptionChange(key, value);
  }

  /**
   * Dispatch option change event
   * @param {string} key - Option key that changed
   * @param {*} value - New value
   */
  dispatchOptionChange(key, value) {
    document.dispatchEvent(new CustomEvent('bridge-option-change', {
      detail: { key, value, options: this.options }
    }));
  }

  /**
   * Check if current viewport matches breakpoint
   * @param {string} breakpoint - Breakpoint name
   * @param {string} direction - 'up' or 'down'
   */
  matchBreakpoint(breakpoint, direction = 'up') {
    const width = window.innerWidth;
    const breakpointValue = this.breakpoints[breakpoint];
    
    if (direction === 'up') {
      return width >= breakpointValue;
    } else {
      return width < breakpointValue;
    }
  }

  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width >= this.breakpoints.xxl) return 'xxl';
    if (width >= this.breakpoints.xl) return 'xl';
    if (width >= this.breakpoints.lg) return 'lg';
    if (width >= this.breakpoints.md) return 'md';
    if (width >= this.breakpoints.sm) return 'sm';
    return 'xs';
  }

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Execute immediately
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   */
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Check if element is in viewport
   * @param {Element} element - Element to check
   * @param {number} threshold - Threshold percentage (0-1)
   */
  isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const height = window.innerHeight || document.documentElement.clientHeight;
    const width = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top >= -rect.height * threshold &&
      rect.left >= -rect.width * threshold &&
      rect.bottom <= height + rect.height * threshold &&
      rect.right <= width + rect.width * threshold
    );
  }

  /**
   * Animate element with intersection observer
   * @param {Element} element - Element to animate
   * @param {string} animation - Animation class name
   * @param {Object} options - Intersection observer options
   */
  animateOnScroll(element, animation = 'fade-in', options = {}) {
    if (!this.getOption('enableAnimations', true)) {
      element.classList.add(animation);
      return;
    }

    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerOptions = { ...defaultOptions, ...options };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animation);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(element);
  }

  /**
   * Format number with commas
   * @param {number} num - Number to format
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Generate unique ID
   * @param {string} prefix - ID prefix
   */
  generateId(prefix = 'bridge') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Deep clone object
   * @param {Object} obj - Object to clone
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  /**
   * Get CSS custom property value
   * @param {string} property - CSS custom property name
   * @param {Element} element - Element to get property from (defaults to document element)
   */
  getCSSProperty(property, element = document.documentElement) {
    return getComputedStyle(element).getPropertyValue(property).trim();
  }

  /**
   * Set CSS custom property value
   * @param {string} property - CSS custom property name
   * @param {string} value - Property value
   * @param {Element} element - Element to set property on (defaults to document element)
   */
  setCSSProperty(property, value, element = document.documentElement) {
    element.style.setProperty(property, value);
  }

  /**
   * Load image with promise
   * @param {string} src - Image source
   */
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Smooth scroll to element
   * @param {Element|string} target - Target element or selector
   * @param {number} offset - Scroll offset
   * @param {number} duration - Animation duration
   */
  scrollToElement(target, offset = 0, duration = 800) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }

  /**
   * Easing function for smooth animations
   * @param {number} t - Current time
   * @param {number} b - Start value
   * @param {number} c - Change in value
   * @param {number} d - Duration
   */
  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Apply theme colors to CSS custom properties
   */
  applyThemeColors() {
    this.setCSSProperty('--bridge-primary', this.getOption('primaryColor'));
    this.setCSSProperty('--bridge-secondary', this.getOption('secondaryColor'));
    this.setCSSProperty('--bridge-accent', this.getOption('accentColor'));
  }

  /**
   * Apply theme fonts to CSS custom properties
   */
  applyThemeFonts() {
    this.setCSSProperty('--bridge-font-primary', this.getOption('primaryFont'));
    this.setCSSProperty('--bridge-font-secondary', this.getOption('secondaryFont'));
    this.setCSSProperty('--bridge-font-size-base', `${this.getOption('fontSize')}px`);
  }

  /**
   * Initialize theme utilities
   */
  init() {
    this.applyThemeColors();
    this.applyThemeFonts();

    // Listen for option changes
    document.addEventListener('bridge-option-change', (e) => {
      const { key } = e.detail;
      
      // Update theme when colors change
      if (['primaryColor', 'secondaryColor', 'accentColor'].includes(key)) {
        this.applyThemeColors();
      }
      
      // Update theme when fonts change
      if (['primaryFont', 'secondaryFont', 'fontSize'].includes(key)) {
        this.applyThemeFonts();
      }
    });

    // Handle resize events
    const handleResize = this.debounce(() => {
      document.dispatchEvent(new CustomEvent('bridge-breakpoint-change', {
        detail: { breakpoint: this.getCurrentBreakpoint() }
      }));
    }, 250);

    window.addEventListener('resize', handleResize);

    console.log('🌉 Bridge Theme Utils initialized');
  }
}

// Create global instance
const bridgeUtils = new BridgeThemeUtils();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => bridgeUtils.init());
} else {
  bridgeUtils.init();
}

export default bridgeUtils;