class BridgeSkipLinks extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.skipLinks = [];
  }

  static get observedAttributes() {
    return ['auto-detect', 'position'];
  }

  connectedCallback() {
    this.render();
    this.setupSkipLinks();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  get autoDetect() {
    return this.hasAttribute('auto-detect');
  }

  get position() {
    return this.getAttribute('position') || 'top-left';
  }

  setupSkipLinks() {
    if (this.autoDetect) {
      this.detectSkipTargets();
    } else {
      this.parseManualSkipLinks();
    }
  }

  detectSkipTargets() {
    // Auto-detect common skip targets
    const selectors = [
      'main, [role="main"]',
      'nav, [role="navigation"]', 
      '.content, #content',
      'header, [role="banner"]',
      'footer, [role="contentinfo"]',
      'h1, h2[id], h3[id], h4[id], h5[id], h6[id]',
      '[data-skip-target]'
    ];

    this.skipLinks = [];
    const rootDocument = this.getRootNode() === document ? document : document;

    selectors.forEach(selector => {
      const elements = rootDocument.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isValidSkipTarget(element)) {
          const id = element.id || this.generateId(element);
          if (!element.id) element.id = id;
          
          const label = this.generateLabel(element);
          this.skipLinks.push({ id, label, element });
        }
      });
    });

    // Remove duplicates and sort by document order
    this.skipLinks = this.skipLinks
      .filter((link, index, arr) => arr.findIndex(l => l.id === link.id) === index)
      .sort((a, b) => a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  }

  parseManualSkipLinks() {
    const links = this.querySelectorAll('bridge-skip-link');
    this.skipLinks = Array.from(links).map(link => ({
      id: link.getAttribute('href').replace('#', ''),
      label: link.getAttribute('label') || link.textContent.trim(),
      element: document.getElementById(link.getAttribute('href').replace('#', ''))
    })).filter(link => link.element);
  }

  isValidSkipTarget(element) {
    // Skip hidden elements, empty headings, or elements without meaningful content
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;
    if (element.tagName.match(/H[1-6]/) && !element.textContent.trim()) return false;
    if (element.closest('[aria-hidden="true"]')) return false;
    
    return true;
  }

  generateId(element) {
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent.trim().toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
    
    return `skip-${tagName}-${text || Math.random().toString(36).substr(2, 6)}`;
  }

  generateLabel(element) {
    const tagName = element.tagName.toLowerCase();
    
    // Custom skip target labels
    if (element.hasAttribute('data-skip-target')) {
      return element.getAttribute('data-skip-target');
    }
    
    // Role-based labels
    const role = element.getAttribute('role');
    if (role) {
      const roleLabels = {
        'main': 'Main content',
        'navigation': 'Navigation',
        'banner': 'Header',
        'contentinfo': 'Footer',
        'search': 'Search',
        'form': 'Form'
      };
      if (roleLabels[role]) return roleLabels[role];
    }
    
    // Tag-based labels
    const tagLabels = {
      'main': 'Main content',
      'nav': 'Navigation',
      'header': 'Header',
      'footer': 'Footer',
      'aside': 'Sidebar',
      'section': 'Section'
    };
    
    if (tagLabels[tagName]) {
      const ariaLabel = element.getAttribute('aria-label');
      return ariaLabel ? `${tagLabels[tagName]}: ${ariaLabel}` : tagLabels[tagName];
    }
    
    // Heading labels
    if (tagName.match(/h[1-6]/)) {
      const text = element.textContent.trim();
      return text ? `Heading: ${text.substring(0, 40)}${text.length > 40 ? '...' : ''}` : 'Heading';
    }
    
    // ID or class based labels
    if (element.id) {
      return element.id.replace(/-/g, ' ').replace(/([A-Z])/g, ' $1').trim();
    }
    
    return 'Content section';
  }

  setupEventListeners() {
    // Handle skip link clicks
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.classList.contains('skip-link')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        this.skipTo(targetId);
      }
    });

    // Handle keyboard navigation
    this.shadowRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideSkipLinks();
      }
    });

    // Show skip links on Tab focus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        this.showSkipLinks();
      }
    });
  }

  skipTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      // Make element focusable if it isn't already
      const originalTabIndex = target.getAttribute('tabindex');
      if (!target.matches('a, button, input, textarea, select, [tabindex]')) {
        target.setAttribute('tabindex', '-1');
      }
      
      // Focus and scroll to target
      target.focus();
      target.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      
      // Announce to screen readers
      this.announceSkip(target);
      
      // Restore original tabindex after focus
      setTimeout(() => {
        if (originalTabIndex) {
          target.setAttribute('tabindex', originalTabIndex);
        } else if (target.getAttribute('tabindex') === '-1') {
          target.removeAttribute('tabindex');
        }
      }, 100);
      
      this.hideSkipLinks();
    }
  }

  announceSkip(target) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Skipped to ${this.generateLabel(target)}`;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }

  showSkipLinks() {
    const skipContainer = this.shadowRoot.querySelector('.skip-links');
    if (skipContainer) {
      skipContainer.classList.add('visible');
    }
  }

  hideSkipLinks() {
    const skipContainer = this.shadowRoot.querySelector('.skip-links');
    if (skipContainer) {
      skipContainer.classList.remove('visible');
    }
  }

  cleanup() {
    // Remove any dynamically added elements
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          pointer-events: none;
        }

        .skip-links {
          position: fixed;
          ${this.getPositionStyles()}
          background: var(--bg-dark, #1a1a1a);
          border: 2px solid var(--primary-color, #1abc9c);
          border-radius: 4px;
          padding: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(-100%);
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
          pointer-events: none;
          max-width: 300px;
        }

        .skip-links.visible,
        .skip-links:focus-within {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .skip-link {
          display: block;
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          margin: 0.25rem 0;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.4;
          transition: var(--transition-base, all 0.3s ease);
        }

        .skip-link:hover,
        .skip-link:focus {
          background: var(--primary-color, #1abc9c);
          border-color: var(--primary-color, #1abc9c);
          color: white;
          outline: 2px solid var(--primary-color, #1abc9c);
          outline-offset: 2px;
        }

        .skip-link:focus-visible {
          outline: 2px solid white;
          outline-offset: 2px;
        }

        /* Screen reader only content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Position variants */
        :host([position="top-center"]) .skip-links {
          left: 50%;
          transform: translateX(-50%) translateY(-100%);
        }

        :host([position="top-center"]) .skip-links.visible,
        :host([position="top-center"]) .skip-links:focus-within {
          transform: translateX(-50%) translateY(0);
        }

        :host([position="top-right"]) .skip-links {
          right: 1rem;
          left: auto;
        }
      </style>

      <nav class="skip-links" role="navigation" aria-label="Skip navigation links">
        <div class="sr-only" role="status" aria-live="polite">
          Use Tab to navigate through skip links. Press Enter to jump to section.
        </div>
        ${this.skipLinks.map(link => `
          <a href="#${link.id}" class="skip-link" role="menuitem">
            ${link.label}
          </a>
        `).join('')}
        ${!this.skipLinks.length ? '<a href="#" class="skip-link">No skip targets found</a>' : ''}
      </nav>
    `;
  }

  getPositionStyles() {
    switch (this.position) {
      case 'top-center':
        return 'top: 1rem; left: 50%; transform: translateX(-50%) translateY(-100%);';
      case 'top-right':
        return 'top: 1rem; right: 1rem;';
      case 'top-left':
      default:
        return 'top: 1rem; left: 1rem;';
    }
  }
}

customElements.define("bridge-skip-links", BridgeSkipLinks);

// Manual skip link component for custom skip targets
class BridgeSkipLink extends HTMLElement {
  static get observedAttributes() {
    return ['href', 'label'];
  }

  get href() {
    return this.getAttribute('href') || '';
  }

  get label() {
    return this.getAttribute('label') || this.textContent.trim();
  }
}

customElements.define("bridge-skip-link", BridgeSkipLink);