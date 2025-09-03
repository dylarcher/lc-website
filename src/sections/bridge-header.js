// Bridge Header Component
// Replaces WordPress header functionality with web components

import { Assets } from '../shared/helpers/asset-helper.js';

class BridgeHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isMenuOpen = false;
    this.isScrolled = false;
  }

  static get observedAttributes() {
    return ['logo', 'variant', 'sticky', 'background', 'transparent'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.setupScrollListener();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  setupEventListeners() {
    const mobileToggle = this.shadowRoot.querySelector('.mobile-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Handle menu item clicks
    this.addEventListener('click', this.handleMenuClick.bind(this));
  }

  removeEventListeners() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  setupScrollListener() {
    this.handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const newIsScrolled = scrollTop > 50;
      
      if (newIsScrolled !== this.isScrolled) {
        this.isScrolled = newIsScrolled;
        this.updateScrollState();
      }
    };
    
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  updateScrollState() {
    const header = this.shadowRoot.querySelector('.bridge-header');
    if (header) {
      header.classList.toggle('scrolled', this.isScrolled);
    }
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const header = this.shadowRoot.querySelector('.bridge-header');
    const menu = this.querySelector('[slot="menu"]');
    
    if (header) {
      header.classList.toggle('mobile-menu-open', this.isMenuOpen);
    }
    
    if (menu) {
      menu.classList.toggle('open', this.isMenuOpen);
    }

    // Dispatch event
    this.dispatchEvent(new CustomEvent('menu-toggle', {
      detail: { isOpen: this.isMenuOpen },
      bubbles: true
    }));
  }

  handleMenuClick(event) {
    // Close mobile menu when menu item is clicked
    if (event.target.matches('bridge-menu-item, bridge-menu-item a')) {
      if (this.isMenuOpen) {
        this.toggleMobileMenu();
      }
      
      // Dispatch menu click event
      this.dispatchEvent(new CustomEvent('menu-item-click', {
        detail: { element: event.target },
        bubbles: true
      }));
    }
  }

  render() {
    const logo = this.getAttribute('logo') || 'Bridge Theme';
    const variant = this.getAttribute('variant') || 'default';
    const sticky = this.hasAttribute('sticky');
    const transparent = this.hasAttribute('transparent');
    const background = this.getAttribute('background') || 'white';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          z-index: var(--bridge-z-fixed, 1030);
        }

        .bridge-header {
          position: ${sticky ? 'sticky' : 'relative'};
          top: 0;
          left: 0;
          right: 0;
          background: ${transparent ? 'transparent' : 
            background === 'dark' ? 'var(--bridge-bg-dark, #1a1a1a)' : 
            'var(--bridge-bg-white, #ffffff)'};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: inherit;
          ${transparent ? '' : 'box-shadow: 0 2px 10px rgba(0,0,0,0.1);'}
        }

        .bridge-header.scrolled {
          background: var(--bridge-bg-white, #ffffff);
          box-shadow: 0 2px 20px rgba(0,0,0,0.15);
        }

        .bridge-header.scrolled .bridge-logo {
          color: var(--bridge-text-dark, #333333);
        }

        .bridge-navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--bridge-spacing-md, 2rem) 0;
          max-width: var(--bridge-container-xl, 1200px);
          margin: 0 auto;
          padding-left: var(--bridge-spacing-md, 2rem);
          padding-right: var(--bridge-spacing-md, 2rem);
        }

        .bridge-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: var(--bridge-transition-base, all 0.3s ease);
          z-index: 1001;
        }

        .bridge-logo img {
          height: 40px;
          width: auto;
          max-width: 200px;
          object-fit: contain;
          transition: var(--bridge-transition-base, all 0.3s ease);
        }

        .bridge-logo:hover img {
          transform: scale(1.05);
        }

        .bridge-logo-text {
          font-size: 1.5rem;
          font-weight: var(--bridge-font-bold, 700);
          color: ${background === 'dark' || transparent ? 
            'var(--bridge-text-white, #ffffff)' : 
            'var(--bridge-text-dark, #333333)'};
          margin-left: var(--bridge-spacing-sm, 0.75rem);
        }

        .bridge-logo:hover .bridge-logo-text {
          color: var(--bridge-primary, #1abc9c);
        }

        .menu-container {
          display: flex;
          align-items: center;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: ${background === 'dark' || transparent ? 
            'var(--bridge-text-white, #ffffff)' : 
            'var(--bridge-text-dark, #333333)'};
          cursor: pointer;
          padding: var(--bridge-spacing-xs, 0.5rem);
          z-index: 1001;
          transition: var(--bridge-transition-base, all 0.3s ease);
        }

        .mobile-toggle:hover {
          color: var(--bridge-primary, #1abc9c);
        }

        ::slotted([slot="menu"]) {
          display: flex;
          align-items: center;
        }

        /* Mobile Styles */
        @media (max-width: 767.98px) {
          .mobile-toggle {
            display: block;
          }

          .bridge-navigation {
            position: relative;
            flex-direction: column;
            padding: var(--bridge-spacing-sm, 1rem);
          }

          .nav-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          ::slotted([slot="menu"]) {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bridge-bg-white, #ffffff);
            box-shadow: var(--bridge-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
            border-radius: var(--bridge-radius-md, 0.5rem);
            padding: var(--bridge-spacing-md, 2rem);
            margin-top: var(--bridge-spacing-sm, 1rem);
            flex-direction: column;
            z-index: 1000;
          }

          .mobile-menu-open ::slotted([slot="menu"]) {
            display: flex !important;
          }

          .mobile-menu-open ::slotted([slot="menu"].open) {
            display: flex !important;
          }
        }

        @media (min-width: 768px) {
          .mobile-toggle {
            display: none !important;
          }

          ::slotted([slot="menu"]) {
            display: flex !important;
            position: static;
            background: none;
            box-shadow: none;
            border-radius: 0;
            padding: 0;
            margin-top: 0;
            flex-direction: row;
          }
        }

        /* Variant Styles */
        .bridge-header.variant-centered .bridge-navigation {
          flex-direction: column;
          text-align: center;
        }

        .bridge-header.variant-centered .menu-container {
          margin-top: var(--bridge-spacing-sm, 1rem);
        }

        .bridge-header.variant-minimal {
          box-shadow: none;
        }

        .bridge-header.variant-minimal.scrolled {
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
      </style>
      
      <header class="bridge-header variant-${variant}">
        <nav class="bridge-navigation">
          <div class="nav-top">
            <a href="/" class="bridge-logo">
              <img src="${Assets.brand.logo()}" alt="${logo}" />
              <span class="bridge-logo-text">${logo}</span>
            </a>
            <button class="mobile-toggle" aria-label="Toggle navigation">
              <i class="fas fa-bars"></i>
            </button>
          </div>
          <div class="menu-container">
            <slot name="menu"></slot>
          </div>
        </nav>
      </header>
    `;
  }
}

// Bridge Menu Component
class BridgeMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        ::slotted(bridge-menu-item) {
          position: relative;
        }

        @media (max-width: 767.98px) {
          :host {
            flex-direction: column;
            width: 100%;
          }

          ::slotted(bridge-menu-item) {
            width: 100%;
            text-align: center;
            margin: var(--bridge-spacing-xs, 0.5rem) 0;
          }
        }
      </style>
      <slot></slot>
    `;
  }
}

// Bridge Menu Item Component
class BridgeMenuItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['href', 'active', 'has-dropdown'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const link = this.shadowRoot.querySelector('a');
    if (link) {
      link.addEventListener('click', (e) => {
        this.dispatchEvent(new CustomEvent('menu-item-click', {
          detail: { href: this.getAttribute('href') },
          bubbles: true
        }));
      });
    }
  }

  render() {
    const href = this.getAttribute('href') || '#';
    const active = this.hasAttribute('active');
    const hasDropdown = this.hasAttribute('has-dropdown');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          margin: 0 var(--bridge-spacing-sm, 1rem);
        }

        a {
          display: block;
          padding: var(--bridge-spacing-xs, 0.5rem) var(--bridge-spacing-sm, 1rem);
          color: inherit;
          text-decoration: none;
          font-weight: var(--bridge-font-medium, 500);
          transition: var(--bridge-transition-base, all 0.3s ease);
          position: relative;
        }

        a:hover,
        :host([active]) a {
          color: var(--bridge-primary, #1abc9c);
        }

        :host([active]) a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 2px;
          background: var(--bridge-primary, #1abc9c);
        }

        .dropdown-icon {
          margin-left: var(--bridge-spacing-xs, 0.5rem);
          font-size: 0.8rem;
          transition: var(--bridge-transition-base, all 0.3s ease);
        }

        :host(:hover) .dropdown-icon {
          transform: rotate(180deg);
        }

        ::slotted([slot="dropdown"]) {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 200px;
          background: var(--bridge-bg-white, #ffffff);
          box-shadow: var(--bridge-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
          border-radius: var(--bridge-radius-md, 0.5rem);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: var(--bridge-transition-base, all 0.3s ease);
          z-index: var(--bridge-z-dropdown, 1000);
        }

        :host(:hover) ::slotted([slot="dropdown"]) {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        @media (max-width: 767.98px) {
          :host {
            margin: var(--bridge-spacing-xs, 0.5rem) 0;
            width: 100%;
          }

          ::slotted([slot="dropdown"]) {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            box-shadow: none;
            background: var(--bridge-bg-light, #f8f8f8);
            margin-top: var(--bridge-spacing-xs, 0.5rem);
          }

          :host([active]) a::after {
            display: none;
          }
        }
      </style>
      
      <a href="${href}">
        <slot></slot>
        ${hasDropdown ? '<i class="fas fa-chevron-down dropdown-icon"></i>' : ''}
      </a>
      ${hasDropdown ? '<slot name="dropdown"></slot>' : ''}
    `;
  }
}

// Bridge Dropdown Component
class BridgeDropdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: var(--bridge-spacing-sm, 1rem);
        }

        ::slotted(bridge-menu-item) {
          margin: 0;
          border-bottom: 1px solid var(--bridge-border-light, #e5e5e5);
        }

        ::slotted(bridge-menu-item:last-child) {
          border-bottom: none;
        }

        ::slotted(bridge-menu-item a) {
          padding: var(--bridge-spacing-sm, 1rem);
          color: var(--bridge-text-dark, #333333);
        }
      </style>
      <slot></slot>
    `;
  }
}

// Register components
customElements.define('bridge-header', BridgeHeader);
customElements.define('bridge-menu', BridgeMenu);
customElements.define('bridge-menu-item', BridgeMenuItem);
customElements.define('bridge-dropdown', BridgeDropdown);