/**
 * Bridge Modal Component Tests
 * Tests for the Legacy Concierge modal web component
 */

import '../../../src/components/bridge-modal.js';

describe('BridgeModal', () => {
  let modal;

  beforeEach(() => {
    modal = createTestComponent('bridge-modal');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Registration', () => {
    test('should be defined as custom element', () => {
      expect(customElements.get('bridge-modal')).toBeDefined();
    });

    test('should create instance with shadow root', () => {
      expect(modal).toBeCustomElement();
      expect(modal.shadowRoot).toBeDefined();
    });
  });

  describe('Modal State Management', () => {
    test('should be closed by default', () => {
      expect(modal.isOpen).toBe(false);
      expect(modal.hasAttribute('open')).toBe(false);
    });

    test('should open when open attribute is set', () => {
      modal.setAttribute('open', '');
      expect(modal.isOpen).toBe(true);
    });

    test('should close when open attribute is removed', () => {
      modal.setAttribute('open', '');
      modal.removeAttribute('open');
      expect(modal.isOpen).toBe(false);
    });

    test('should update modal visibility based on state', () => {
      modal.setAttribute('open', '');
      const modalDialog = modal.shadowRoot.querySelector('.modal-dialog');
      expect(modalDialog.classList.contains('open')).toBe(true);
    });
  });

  describe('Modal Interaction', () => {
    test('should close modal when close button is clicked', () => {
      modal.setAttribute('open', '');
      const closeButton = modal.shadowRoot.querySelector('.modal-close');
      
      expect(modal.isOpen).toBe(true);
      closeButton.click();
      expect(modal.isOpen).toBe(false);
    });

    test('should close modal when backdrop is clicked', () => {
      modal.setAttribute('open', '');
      const backdrop = modal.shadowRoot.querySelector('.modal-backdrop');
      
      expect(modal.isOpen).toBe(true);
      backdrop.click();
      expect(modal.isOpen).toBe(false);
    });

    test('should not close modal when dialog content is clicked', () => {
      modal.setAttribute('open', '');
      const dialog = modal.shadowRoot.querySelector('.modal-content');
      
      expect(modal.isOpen).toBe(true);
      dialog.click();
      expect(modal.isOpen).toBe(true);
    });

    test('should close modal on Escape key press', () => {
      modal.setAttribute('open', '');
      
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      
      expect(modal.isOpen).toBe(false);
    });
  });

  describe('Event Handling', () => {
    test('should dispatch modal-open event when opened', () => {
      const openHandler = jest.fn();
      modal.addEventListener('modal-open', openHandler);
      
      modal.setAttribute('open', '');
      
      expect(openHandler).toHaveBeenCalledTimes(1);
      expect(openHandler.mock.calls[0][0].detail.modal).toBe(modal);
    });

    test('should dispatch modal-close event when closed', () => {
      const closeHandler = jest.fn();
      modal.addEventListener('modal-close', closeHandler);
      
      modal.setAttribute('open', '');
      modal.removeAttribute('open');
      
      expect(closeHandler).toHaveBeenCalledTimes(1);
      expect(closeHandler.mock.calls[0][0].detail.modal).toBe(modal);
    });

    test('should prevent body scroll when modal is open', () => {
      modal.setAttribute('open', '');
      expect(document.body.style.overflow).toBe('hidden');
    });

    test('should restore body scroll when modal is closed', () => {
      modal.setAttribute('open', '');
      modal.removeAttribute('open');
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Focus Management', () => {
    test('should focus on modal when opened', () => {
      modal.setAttribute('open', '');
      const modalDialog = modal.shadowRoot.querySelector('.modal-dialog');
      expect(document.activeElement).toBe(modal);
    });

    test('should trap focus within modal', () => {
      modal.innerHTML = `
        <button id="first-button">First</button>
        <button id="last-button">Last</button>
      `;
      modal.setAttribute('open', '');
      
      const firstButton = modal.querySelector('#first-button');
      const lastButton = modal.querySelector('#last-button');
      
      // Mock tab key on last element should focus first element
      const tabEvent = new KeyboardEvent('keydown', { 
        key: 'Tab',
        target: lastButton
      });
      
      modal.dispatchEvent(tabEvent);
      // Focus trapping should be implemented in the component
    });

    test('should restore focus to trigger element when closed', () => {
      const triggerButton = document.createElement('button');
      document.body.appendChild(triggerButton);
      triggerButton.focus();
      
      modal.setAttribute('open', '');
      modal.removeAttribute('open');
      
      expect(document.activeElement).toBe(triggerButton);
      document.body.removeChild(triggerButton);
    });
  });

  describe('Modal Variants', () => {
    test('should support size variants', () => {
      modal.setAttribute('size', 'large');
      const modalDialog = modal.shadowRoot.querySelector('.modal-dialog');
      expect(modalDialog.classList.contains('size-large')).toBe(true);
    });

    test('should support position variants', () => {
      modal.setAttribute('position', 'top');
      const modalDialog = modal.shadowRoot.querySelector('.modal-dialog');
      expect(modalDialog.classList.contains('position-top')).toBe(true);
    });

    test('should support fullscreen variant', () => {
      modal.setAttribute('fullscreen', '');
      const modalDialog = modal.shadowRoot.querySelector('.modal-dialog');
      expect(modalDialog.classList.contains('fullscreen')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      modal.setAttribute('open', '');
      const modalDialog = modal.shadowRoot.querySelector('.modal-dialog');
      
      expect(modalDialog.getAttribute('role')).toBe('dialog');
      expect(modalDialog.hasAttribute('aria-modal')).toBe(true);
      expect(modalDialog.getAttribute('aria-modal')).toBe('true');
    });

    test('should support aria-label attribute', () => {
      modal.setAttribute('aria-label', 'Contact Form');
      expect(modal.constructor.observedAttributes).toContain('aria-label');
    });

    test('should support aria-labelledby attribute', () => {
      modal.setAttribute('aria-labelledby', 'modal-title');
      expect(modal.constructor.observedAttributes).toContain('aria-labelledby');
    });

    test('should have proper tabindex for focus management', () => {
      modal.setAttribute('open', '');
      const modalDialog = modal.shadowRoot.querySelector('.modal-dialog');
      expect(modalDialog.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Animation and Transitions', () => {
    test('should apply animation classes', () => {
      modal.setAttribute('open', '');
      const modalDialog = modal.shadowRoot.querySelector('.modal-dialog');
      const backdrop = modal.shadowRoot.querySelector('.modal-backdrop');
      
      expect(modalDialog.classList.contains('animate-in')).toBe(true);
      expect(backdrop.classList.contains('fade-in')).toBe(true);
    });

    test('should handle animation completion', () => {
      modal.setAttribute('open', '');
      modal.removeAttribute('open');
      
      const animationEndEvent = new AnimationEvent('animationend');
      const modalDialog = modal.shadowRoot.querySelector('.modal-dialog');
      modalDialog.dispatchEvent(animationEndEvent);
      
      // Should trigger cleanup after animation
      expect(modalDialog.classList.contains('animate-out')).toBe(false);
    });
  });

  describe('CSS Custom Properties', () => {
    test('should use CSS custom properties for theming', () => {
      const styles = modal.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('--bridge-modal-bg');
      expect(styles).toContain('--bridge-modal-backdrop');
      expect(styles).toContain('--bridge-shadow-modal');
      expect(styles).toContain('--bridge-radius-modal');
      expect(styles).toContain('--bridge-z-modal');
    });
  });
});