/**
 * Bridge Input Element Tests
 * Tests for the Legacy Concierge input web component
 */

import '../../../src/elements/bridge-input.js';

describe('BridgeInput', () => {
  let input;

  beforeEach(() => {
    input = createTestComponent('bridge-input');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Registration', () => {
    test('should be defined as custom element', () => {
      expect(customElements.get('bridge-input')).toBeDefined();
    });

    test('should create instance with shadow root', () => {
      expect(input).toBeCustomElement();
      expect(input.shadowRoot).toBeDefined();
    });
  });

  describe('Input Types', () => {
    test('should handle text input type', () => {
      input.setAttribute('type', 'text');
      const shadowInput = input.shadowRoot.querySelector('input');
      expect(shadowInput.type).toBe('text');
    });

    test('should handle email input type', () => {
      input.setAttribute('type', 'email');
      const shadowInput = input.shadowRoot.querySelector('input');
      expect(shadowInput.type).toBe('email');
    });

    test('should handle password input type', () => {
      input.setAttribute('type', 'password');
      const shadowInput = input.shadowRoot.querySelector('input');
      expect(shadowInput.type).toBe('password');
    });

    test('should handle textarea type', () => {
      input.setAttribute('type', 'textarea');
      const shadowTextarea = input.shadowRoot.querySelector('textarea');
      expect(shadowTextarea).toBeTruthy();
    });
  });

  describe('Attributes and Properties', () => {
    test('should handle placeholder attribute', () => {
      input.setAttribute('placeholder', 'Enter your name');
      const shadowInput = input.shadowRoot.querySelector('input');
      expect(shadowInput.placeholder).toBe('Enter your name');
    });

    test('should handle required attribute', () => {
      input.setAttribute('required', '');
      const shadowInput = input.shadowRoot.querySelector('input');
      expect(shadowInput.hasAttribute('required')).toBe(true);
    });

    test('should handle disabled attribute', () => {
      input.setAttribute('disabled', '');
      const shadowInput = input.shadowRoot.querySelector('input');
      expect(shadowInput.hasAttribute('disabled')).toBe(true);
    });

    test('should handle value attribute', () => {
      input.setAttribute('value', 'test value');
      const shadowInput = input.shadowRoot.querySelector('input');
      expect(shadowInput.value).toBe('test value');
    });
  });

  describe('Validation', () => {
    test('should show validation error for required field', () => {
      input.setAttribute('required', '');
      input.setAttribute('type', 'email');
      
      const shadowInput = input.shadowRoot.querySelector('input');
      shadowInput.value = '';
      shadowInput.dispatchEvent(new Event('blur'));
      
      const errorMessage = input.shadowRoot.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
    });

    test('should validate email format', () => {
      input.setAttribute('type', 'email');
      input.setAttribute('required', '');
      
      const shadowInput = input.shadowRoot.querySelector('input');
      shadowInput.value = 'invalid-email';
      shadowInput.dispatchEvent(new Event('blur'));
      
      const errorMessage = input.shadowRoot.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
    });

    test('should clear validation errors when valid', () => {
      input.setAttribute('type', 'email');
      input.setAttribute('required', '');
      
      const shadowInput = input.shadowRoot.querySelector('input');
      shadowInput.value = 'valid@email.com';
      shadowInput.dispatchEvent(new Event('input'));
      
      const errorMessage = input.shadowRoot.querySelector('.error-message');
      expect(errorMessage).toBeFalsy();
    });
  });

  describe('Event Handling', () => {
    test('should dispatch input-change event on input', () => {
      const changeHandler = jest.fn();
      input.addEventListener('input-change', changeHandler);
      
      const shadowInput = input.shadowRoot.querySelector('input');
      shadowInput.value = 'new value';
      shadowInput.dispatchEvent(new Event('input'));
      
      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler.mock.calls[0][0].detail.value).toBe('new value');
    });

    test('should dispatch input-blur event on blur', () => {
      const blurHandler = jest.fn();
      input.addEventListener('input-blur', blurHandler);
      
      const shadowInput = input.shadowRoot.querySelector('input');
      shadowInput.dispatchEvent(new Event('blur'));
      
      expect(blurHandler).toHaveBeenCalledTimes(1);
    });

    test('should dispatch input-focus event on focus', () => {
      const focusHandler = jest.fn();
      input.addEventListener('input-focus', focusHandler);
      
      const shadowInput = input.shadowRoot.querySelector('input');
      shadowInput.dispatchEvent(new Event('focus'));
      
      expect(focusHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('should support aria-label attribute', () => {
      input.setAttribute('aria-label', 'User name');
      expect(input.constructor.observedAttributes).toContain('aria-label');
    });

    test('should support aria-describedby attribute', () => {
      input.setAttribute('aria-describedby', 'help-text');
      expect(input.constructor.observedAttributes).toContain('aria-describedby');
    });

    test('should associate label with input', () => {
      input.setAttribute('label', 'Email Address');
      const label = input.shadowRoot.querySelector('label');
      const shadowInput = input.shadowRoot.querySelector('input');
      
      expect(label).toBeTruthy();
      expect(label.getAttribute('for')).toBe(shadowInput.id);
    });
  });

  describe('CSS Custom Properties', () => {
    test('should use CSS custom properties for theming', () => {
      const styles = input.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('--bridge-border-color');
      expect(styles).toContain('--bridge-font-primary');
      expect(styles).toContain('--bridge-radius-input');
      expect(styles).toContain('--bridge-primary');
    });
  });
});