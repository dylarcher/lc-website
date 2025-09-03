class BridgeKeyboardShortcut extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.keyListeners = new Map();
    this.isActive = false;
  }

  static get observedAttributes() {
    return [
      'keys', 
      'action', 
      'description', 
      'position', 
      'show-visual',
      'trigger-mode',
      'disabled'
    ];
  }

  connectedCallback() {
    this.render();
    this.setupKeyboardListeners();
    this.setupVisualIndicator();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
      this.updateKeyboardListeners();
    }
  }

  get keys() {
    return this.getAttribute('keys') || '';
  }

  get action() {
    return this.getAttribute('action') || 'focus';
  }

  get description() {
    return this.getAttribute('description') || 'Keyboard shortcut';
  }

  get position() {
    return this.getAttribute('position') || 'bottom-right';
  }

  get showVisual() {
    return this.hasAttribute('show-visual');
  }

  get triggerMode() {
    return this.getAttribute('trigger-mode') || 'hover';
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  get parsedKeys() {
    return this.keys.split('+').map(key => key.trim().toLowerCase());
  }

  get keyDisplayNames() {
    const keyMap = {
      'ctrl': '⌃',
      'control': '⌃',
      'cmd': '⌘',
      'meta': '⌘',
      'alt': '⌥',
      'option': '⌥',
      'shift': '⇧',
      'enter': '↵',
      'return': '↵',
      'space': '␣',
      'tab': '⇥',
      'backspace': '⌫',
      'delete': '⌦',
      'escape': '⎋',
      'esc': '⎋',
      'arrowup': '↑',
      'arrowdown': '↓',
      'arrowleft': '←',
      'arrowright': '→',
      'up': '↑',
      'down': '↓',
      'left': '←',
      'right': '→'
    };

    return this.parsedKeys.map(key => {
      const normalizedKey = key.toLowerCase();
      return keyMap[normalizedKey] || key.toUpperCase();
    });
  }

  setupKeyboardListeners() {
    if (this.disabled) return;

    this.cleanup(); // Remove existing listeners

    const handleKeyDown = (e) => {
      if (this.matchesKeyCombo(e)) {
        e.preventDefault();
        e.stopPropagation();
        this.executeAction();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    this.keyListeners.set('keydown', handleKeyDown);
  }

  updateKeyboardListeners() {
    this.setupKeyboardListeners();
  }

  matchesKeyCombo(event) {
    const keys = this.parsedKeys;
    const pressed = [];

    // Check modifier keys
    if (event.ctrlKey || event.metaKey) pressed.push('ctrl');
    if (event.altKey) pressed.push('alt');
    if (event.shiftKey) pressed.push('shift');

    // Add the main key
    const mainKey = event.key.toLowerCase();
    if (!['control', 'alt', 'shift', 'meta'].includes(mainKey)) {
      pressed.push(mainKey);
    }

    // Compare arrays
    const normalizedKeys = keys.map(k => k === 'cmd' || k === 'meta' ? 'ctrl' : k);
    const normalizedPressed = pressed.map(k => k === 'meta' ? 'ctrl' : k);

    return normalizedKeys.length === normalizedPressed.length &&
           normalizedKeys.every(key => normalizedPressed.includes(key));
  }

  executeAction() {
    const targetElement = this.querySelector('*') || this.parentElement;
    
    // Announce action to screen readers
    this.announceAction();

    // Show visual feedback
    this.showActivationFeedback();

    // Execute the action
    switch (this.action) {
      case 'click':
        if (targetElement && targetElement.click) {
          targetElement.click();
        }
        break;
      
      case 'focus':
        if (targetElement && targetElement.focus) {
          targetElement.focus();
        }
        break;
      
      case 'toggle':
        if (targetElement) {
          const isExpanded = targetElement.getAttribute('aria-expanded') === 'true';
          targetElement.setAttribute('aria-expanded', !isExpanded);
          if (targetElement.click) targetElement.click();
        }
        break;
      
      case 'custom':
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('keyboard-shortcut-triggered', {
          bubbles: true,
          detail: { 
            keys: this.keys, 
            target: targetElement,
            description: this.description
          }
        }));
        break;
    }

    // Dispatch general shortcut event
    this.dispatchEvent(new CustomEvent('shortcut-activated', {
      bubbles: true,
      detail: { 
        keys: this.keys,
        action: this.action,
        target: targetElement
      }
    }));
  }

  announceAction() {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.className = 'sr-only';
    announcement.textContent = `Keyboard shortcut activated: ${this.description}`;
    
    document.body.appendChild(announcement);
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  showActivationFeedback() {
    const visual = this.shadowRoot.querySelector('.keyboard-visual');
    if (visual) {
      visual.classList.add('activated');
      setTimeout(() => visual.classList.remove('activated'), 200);
    }
  }

  setupVisualIndicator() {
    if (!this.showVisual) return;

    const targetElement = this.querySelector('*') || this.parentElement;
    if (!targetElement) return;

    // Setup hover/focus listeners based on trigger mode
    if (this.triggerMode === 'hover') {
      targetElement.addEventListener('mouseenter', () => this.showKeyVisual());
      targetElement.addEventListener('mouseleave', () => this.hideKeyVisual());
    } else if (this.triggerMode === 'focus') {
      targetElement.addEventListener('focus', () => this.showKeyVisual());
      targetElement.addEventListener('blur', () => this.hideKeyVisual());
    } else if (this.triggerMode === 'always') {
      this.showKeyVisual();
    }
  }

  showKeyVisual() {
    const visual = this.shadowRoot.querySelector('.keyboard-visual');
    if (visual) {
      visual.classList.add('visible');
    }
  }

  hideKeyVisual() {
    const visual = this.shadowRoot.querySelector('.keyboard-visual');
    if (visual) {
      visual.classList.remove('visible');
    }
  }

  cleanup() {
    // Remove event listeners
    this.keyListeners.forEach((listener, event) => {
      document.removeEventListener(event, listener);
    });
    this.keyListeners.clear();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: contents;
        }

        .keyboard-visual {
          position: absolute;
          ${this.getPositionStyles()}
          background: var(--bg-dark, #1a1a1a);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          border: 1px solid var(--border-color, #333);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          white-space: nowrap;
          display: ${this.showVisual ? 'flex' : 'none'};
          align-items: center;
          gap: 0.25rem;
        }

        .keyboard-visual.visible {
          opacity: 1;
          transform: scale(1);
        }

        .keyboard-visual.activated {
          background: var(--primary-color, #1abc9c);
          transform: scale(1.1);
        }

        .key {
          background: var(--bg-light, #f8f8f8);
          color: var(--text-dark, #333);
          padding: 0.125rem 0.375rem;
          border-radius: 2px;
          border: 1px solid var(--border-color, #ddd);
          font-size: 0.6875rem;
          line-height: 1;
          min-width: 1rem;
          text-align: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-weight: 500;
        }

        .key-separator {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.625rem;
          margin: 0 0.125rem;
        }

        .description {
          font-size: 0.625rem;
          opacity: 0.8;
          margin-left: 0.25rem;
        }

        /* Position variants */
        .keyboard-visual.top-left {
          top: -2rem;
          left: 0;
        }

        .keyboard-visual.top-right {
          top: -2rem;
          right: 0;
        }

        .keyboard-visual.top-center {
          top: -2rem;
          left: 50%;
          transform: translateX(-50%) scale(0.8);
        }

        .keyboard-visual.top-center.visible {
          transform: translateX(-50%) scale(1);
        }

        .keyboard-visual.bottom-left {
          bottom: -2rem;
          left: 0;
        }

        .keyboard-visual.bottom-right {
          bottom: -2rem;
          right: 0;
        }

        .keyboard-visual.bottom-center {
          bottom: -2rem;
          left: 50%;
          transform: translateX(-50%) scale(0.8);
        }

        .keyboard-visual.bottom-center.visible {
          transform: translateX(-50%) scale(1);
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

        /* Floating position support */
        :host([position*="float"]) .keyboard-visual {
          position: fixed;
          z-index: 9999;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .keyboard-visual {
            transition: opacity 0.1s ease;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .keyboard-visual {
            border: 2px solid;
          }
          
          .key {
            border: 2px solid;
          }
        }
      </style>

      <div class="keyboard-visual ${this.position}" 
           role="tooltip" 
           aria-live="polite"
           aria-label="Keyboard shortcut: ${this.keys}. ${this.description}">
        <div class="sr-only">Keyboard shortcut available: ${this.keys}</div>
        ${this.keyDisplayNames.map((key, index) => `
          <span class="key" aria-hidden="true">${key}</span>
          ${index < this.keyDisplayNames.length - 1 ? '<span class="key-separator" aria-hidden="true">+</span>' : ''}
        `).join('')}
        ${this.description && this.description !== 'Keyboard shortcut' ? 
          `<span class="description" aria-hidden="true">${this.description}</span>` : ''}
      </div>

      <slot></slot>
    `;
  }

  getPositionStyles() {
    const positions = {
      'top-left': 'top: -2rem; left: 0;',
      'top-right': 'top: -2rem; right: 0;',
      'top-center': 'top: -2rem; left: 50%; transform: translateX(-50%) scale(0.8);',
      'bottom-left': 'bottom: -2rem; left: 0;',
      'bottom-right': 'bottom: -2rem; right: 0;',
      'bottom-center': 'bottom: -2rem; left: 50%; transform: translateX(-50%) scale(0.8);',
      'float-top-left': 'top: 1rem; left: 1rem;',
      'float-top-right': 'top: 1rem; right: 1rem;',
      'float-bottom-left': 'bottom: 1rem; left: 1rem;',
      'float-bottom-right': 'bottom: 1rem; right: 1rem;'
    };

    return positions[this.position] || positions['bottom-right'];
  }
}

customElements.define("bridge-keyboard-shortcut", BridgeKeyboardShortcut);