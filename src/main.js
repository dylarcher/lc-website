// Bridge Theme Web Components
// Import all modular components and utilities

// Core Utilities and Asset Management
import bridgeAssetManager, { BRIDGE_ASSET_PRESETS } from "./shared/helpers/asset-manager.js";
import bridgeUtils from "./shared/helpers/bridge-utils.js";

// Core Layout Components
import "./sections/bridge-header.js";
import "./components/bridge-slider.js";
import "./sections/bridge-footer.js";

// Sections
import "./sections/bridge-hero-section.js";
import "./sections/bridge-content-section.js";
import "./sections/bridge-image-content-section.js";

// Elements
import "./elements/bridge-button.js";
import "./elements/bridge-input.js";
import "./elements/bridge-progress.js";
import "./elements/bridge-image.js";
import "./elements/bridge-picture.js";
import "./elements/bridge-figure.js";

// Components
import "./components/bridge-accordion.js";
import "./components/bridge-card.js";
import "./components/bridge-modal.js";
import "./components/bridge-tabs.js";
import "./sections/bridge-service-card.js";
import "./components/bridge-portfolio-filter.js";
import "./sections/bridge-contact-form.js";
import "./sections/bridge-testimonials-carousel.js";

// Blocks
import "./modules/bridge-hero.js";
import "./modules/bridge-portfolio.js";
import "./modules/bridge-pricing.js";
import "./modules/bridge-testimonial.js";
import "./modules/bridge-skip-links.js";
import "./modules/bridge-keyboard-shortcut.js";

// Define global CSS custom properties if not already defined
if (!document.documentElement.style.getPropertyValue("--primary-color")) {
  const style = document.createElement("style");
  style.textContent = `
    :root {
        /* Bridge Theme Color System - Using README.md Palette */
        --primary-color: color(srgb 0.031 0.161 0.208 / var(--primary-alpha, 1));
        --secondary-color: color(srgb 0.620 0.741 0.733 / var(--secondary-alpha, 1));
        --text-dark: color(srgb 0.043 0.161 0.208 / var(--text-dark-alpha, 1));
        --text-light: color(srgb 0.412 0.447 0.490 / var(--text-light-alpha, 1));
        --border-color: color(srgb 0.804 0.804 0.804 / var(--border-color-alpha, 1));
        --bg-dark: color(srgb 0.102 0.102 0.102 / var(--bg-dark-alpha, 1));
        --bg-light: color(srgb 0.961 0.953 0.929 / var(--bg-light-alpha, 1));
        --accent-dark: color(srgb 0.510 0.388 0.298 / var(--accent-dark-alpha, 1));
        --accent-color: color(srgb 0.365 0.176 0.902 / var(--accent-color-alpha, 1));
        --accent-light: color(srgb 0.882 0.863 0.824 / var(--accent-light-alpha, 1));
        --white: color(srgb 1 1 1 / var(--white-alpha, 1));
        --black: color(srgb 0 0 0 / var(--black-alpha, 1));

        @media (prefers-color-scheme: dark) {
            --primary-color: color(srgb 0.031 0.161 0.208 / var(--primary-alpha, 1));
            --secondary-color: color(srgb 0.620 0.741 0.733 / var(--secondary-alpha, 1));
            --text-dark: color(srgb 0.965 0.953 0.925 / var(--text-dark-alpha, 1));
            --text-light: color(srgb 0.412 0.447 0.490 / var(--text-light-alpha, 1));
            --border-color: color(srgb 0.239 0.239 0.239 / var(--border-color-alpha, 1));
            --bg-dark: color(srgb 0.102 0.102 0.102 / var(--bg-dark-alpha, 1));
            --bg-light: color(srgb 0.122 0.129 0.141 / var(--bg-light-alpha, 1));
            --accent-dark: color(srgb 0.510 0.388 0.298 / var(--accent-dark-alpha, 1));
            --accent-color: color(srgb 0.365 0.176 0.902 / var(--accent-color-alpha, 1));
            --accent-light: color(srgb 0.882 0.863 0.824 / var(--accent-light-alpha, 1));
            --white: color(srgb 1 1 1 / var(--white-alpha, 1));
            --black: color(srgb 0 0 0 / var(--black-alpha, 1));
        }

        @supports (color: oklch(0 0 0)) {
          --primary-color: oklch(0.2 0.08 200 / var(--primary-alpha, 1));
          --secondary-color: oklch(0.8 0.05 180 / var(--secondary-alpha, 1));
          --text-dark: oklch(0.21 0.08 200 / var(--text-dark-alpha, 1));
          --text-light: oklch(0.5 0.03 240 / var(--text-light-alpha, 1));
          --border-color: oklch(0.85 0 0 / var(--border-color-alpha, 1));
          --bg-dark: oklch(0.2 0 0 / var(--bg-dark-alpha, 1));
          --bg-light: oklch(0.95 0.01 80 / var(--bg-light-alpha, 1));
          --accent-dark: oklch(0.5 0.08 60 / var(--accent-dark-alpha, 1));
          --accent-color: oklch(0.5 0.25 280 / var(--accent-color-alpha, 1));
          --accent-light: oklch(0.9 0.02 60 / var(--accent-light-alpha, 1));
          --white: oklch(1 0 0 / var(--white-alpha, 1));
          --black: oklch(0 0 0 / var(--black-alpha, 1));

          @media (prefers-color-scheme: dark) {
            --primary-color: oklch(0.2 0.08 200 / var(--primary-alpha, 1));
            --secondary-color: oklch(0.8 0.05 180 / var(--secondary-alpha, 1));
            --text-dark: oklch(0.95 0.01 80 / var(--text-dark-alpha, 1));
            --text-light: oklch(0.5 0.03 240 / var(--text-light-alpha, 1));
            --border-color: oklch(0.35 0 0 / var(--border-color-alpha, 1));
            --bg-dark: oklch(0.2 0 0 / var(--bg-dark-alpha, 1));
            --bg-light: oklch(0.2 0.02 240 / var(--bg-light-alpha, 1));
            --accent-dark: oklch(0.5 0.08 60 / var(--accent-dark-alpha, 1));
            --accent-color: oklch(0.5 0.25 280 / var(--accent-color-alpha, 1));
            --accent-light: oklch(0.9 0.02 60 / var(--accent-light-alpha, 1));
            --white: oklch(1 0 0 / var(--white-alpha, 1));
            --black: oklch(0 0 0 / var(--black-alpha, 1));
          }
        }

      /* Legacy fallback colors for older browsers */
      --primary-color: #082935;
      --secondary-color: #9EBDBB;
      --text-color: #0b2935;
      --bg-color: #f5f3ed;
      --accent-color: #5D2DE6;
      --text-dark: #0b2935;
      --text-light: #69727d;
      --bg-light: #f5f3ed;
      --bg-dark: #1a1a1a;
      --border-color: #cdcdcd;

      /* Typography */
      --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --font-secondary: Georgia, "Times New Roman", serif;
      --font-display: "Montserrat", sans-serif;

      /* Spacing */
      --spacing-xs: 0.5rem;
      --spacing-sm: 1rem;
      --spacing-md: 2rem;
      --spacing-lg: 3rem;
      --spacing-xl: 5rem;
      --spacing-xxl: 8rem;

      /* Transitions */
      --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      --transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Global animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Utility classes */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }

    /* Spacing utilities */
    .mt-1 { margin-top: var(--spacing-xs); }
    .mt-2 { margin-top: var(--spacing-sm); }
    .mt-3 { margin-top: var(--spacing-md); }
    .mt-4 { margin-top: var(--spacing-lg); }
    .mt-5 { margin-top: var(--spacing-xl); }

    .mb-1 { margin-bottom: var(--spacing-xs); }
    .mb-2 { margin-bottom: var(--spacing-sm); }
    .mb-3 { margin-bottom: var(--spacing-md); }
    .mb-4 { margin-bottom: var(--spacing-lg); }
    .mb-5 { margin-bottom: var(--spacing-xl); }

    .pt-1 { padding-top: var(--spacing-xs); }
    .pt-2 { padding-top: var(--spacing-sm); }
    .pt-3 { padding-top: var(--spacing-md); }
    .pt-4 { padding-top: var(--spacing-lg); }
    .pt-5 { padding-top: var(--spacing-xl); }

    .pb-1 { padding-bottom: var(--spacing-xs); }
    .pb-2 { padding-bottom: var(--spacing-sm); }
    .pb-3 { padding-bottom: var(--spacing-md); }
    .pb-4 { padding-bottom: var(--spacing-lg); }
    .pb-5 { padding-bottom: var(--spacing-xl); }

    /* Animation utilities */
    .fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }

    .slide-up {
      animation: slideUp 0.5s ease-out;
    }
  `;

  document.head.appendChild(style);
}

// Initialize Bridge Theme
document.addEventListener('DOMContentLoaded', function() {
  // Load Google Fonts
  bridgeAssetManager.loadGoogleFonts(BRIDGE_ASSET_PRESETS.fonts).catch(console.error);
  
  // Global event handlers for Bridge Theme
  
  // Handle smooth scrolling for anchor links
  document.addEventListener('click', function(e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor && anchor.getAttribute('href') !== '#') {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        bridgeUtils.scrollToElement(target, 80);
      }
    }
  });
  
  // Handle form submissions
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.matches('bridge-contact-form form')) {
      e.preventDefault();
      
      // Dispatch custom event for form handling
      document.dispatchEvent(new CustomEvent('bridge-form-submit', {
        detail: { form, formData: new FormData(form) },
        bubbles: true
      }));
    }
  });
  
  // Initialize animations for elements in viewport
  const animatedElements = document.querySelectorAll('[data-animation]');
  animatedElements.forEach(element => {
    const animation = element.dataset.animation || 'fade-in';
    bridgeUtils.animateOnScroll(element, animation);
  });
  
  // Handle lazy loading for images
  if (bridgeUtils.getOption('lazyLoading', true)) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  console.log('🌉 Bridge Theme initialized successfully!');
});

// Make Bridge utilities available globally
window.BridgeTheme = {
  assetManager: bridgeAssetManager,
  utils: bridgeUtils,
  version: '1.0.0'
};

console.log("🌉 Bridge Theme Web Components loaded successfully!");
