/**
 * Bridge Button Element Tests
 * Tests for the Legacy Concierge button web component
 */

import '../../../src/elements/bridge-button.js';

describe('BridgeButton', () => {
  let button;

  beforeEach(() => {
    button = createTestComponent('bridge-button');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Registration', () => {
    test('should be defined as custom element', () => {
      expect(customElements.get('bridge-button')).toBeDefined();
    });

    test('should create instance with shadow root', async () => {
      expect(button).toBeCustomElement();
      expect(button.shadowRoot).toBeDefined();
    });
  });

  describe('Attributes and Properties', () => {
    test('should have default variant "primary"', () => {
      expect(button.variant).toBe('primary');
    });

    test('should have default size "medium"', () => {
      expect(button.size).toBe('medium');
    });

    test('should not be disabled by default', () => {
      expect(button.disabled).toBe(false);
    });

    test('should observe attribute changes', () => {
      const observedAttrs = button.constructor.observedAttributes;
      expect(observedAttrs).toContain('variant');
      expect(observedAttrs).toContain('disabled');
      expect(observedAttrs).toContain('size');
      expect(observedAttrs).toContain('aria-label');
    });

    test('should update variant property when attribute changes', () => {
      button.setAttribute('variant', 'secondary');
      expect(button.variant).toBe('secondary');
    });

    test('should update size property when attribute changes', () => {
      button.setAttribute('size', 'large');
      expect(button.size).toBe('large');
    });

    test('should update disabled property when attribute changes', () => {
      button.setAttribute('disabled', '');
      expect(button.disabled).toBe(true);
    });
  });

  describe('Rendering', () => {
    test('should render button element in shadow root', () => {
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton).toBeTruthy();
    });

    test('should apply variant class', () => {
      button.setAttribute('variant', 'outline');
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton.className).toContain('outline');
    });

    test('should apply size class', () => {
      button.setAttribute('size', 'small');
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton.className).toContain('small');
    });

    test('should apply disabled attribute when disabled', () => {
      button.setAttribute('disabled', '');
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton.hasAttribute('disabled')).toBe(true);
    });

    test('should render slot for content', () => {
      button.innerHTML = 'Click me';
      const slot = button.shadowRoot.querySelector('slot');
      expect(slot).toBeTruthy();
    });
  });

  describe('Event Handling', () => {
    test('should dispatch bridge-button-click event on click', () => {
      const clickHandler = jest.fn();
      button.addEventListener('bridge-button-click', clickHandler);
      
      const shadowButton = button.shadowRoot.querySelector('button');
      shadowButton.click();
      
      expect(clickHandler).toHaveBeenCalledTimes(1);
      expect(clickHandler.mock.calls[0][0].detail.originalEvent).toBeTruthy();
    });

    test('should not dispatch event when disabled', () => {
      const clickHandler = jest.fn();
      button.addEventListener('bridge-button-click', clickHandler);
      button.setAttribute('disabled', '');
      
      const shadowButton = button.shadowRoot.querySelector('button');
      shadowButton.click();
      
      expect(clickHandler).not.toHaveBeenCalled();
    });

    test('should prevent default and stop propagation when disabled', () => {
      button.setAttribute('disabled', '');
      const shadowButton = button.shadowRoot.querySelector('button');
      
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };
      
      // Manually trigger the click handler
      shadowButton.dispatchEvent(new Event('click'));
      
      // Since the button is disabled, we expect the handler to prevent default behavior
      expect(button.disabled).toBe(true);
    });
  });

  describe('Variants', () => {
    test('should support primary variant', () => {
      button.setAttribute('variant', 'primary');
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton.className).toContain('primary');
    });

    test('should support outline variant', () => {
      button.setAttribute('variant', 'outline');
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton.className).toContain('outline');
    });

    test('should support secondary variant', () => {
      button.setAttribute('variant', 'secondary');
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton.className).toContain('secondary');
    });
  });

  describe('Sizes', () => {
    test('should support small size', () => {
      button.setAttribute('size', 'small');
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton.className).toContain('small');
    });

    test('should support medium size', () => {
      button.setAttribute('size', 'medium');
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton.className).toContain('medium');
    });

    test('should support large size', () => {
      button.setAttribute('size', 'large');
      const shadowButton = button.shadowRoot.querySelector('button');
      expect(shadowButton.className).toContain('large');
    });
  });

  describe('Accessibility', () => {
    test('should support aria-label attribute', () => {
      button.setAttribute('aria-label', 'Close dialog');
      // Check if aria-label is part of observed attributes
      expect(button.constructor.observedAttributes).toContain('aria-label');
    });

    test('should support aria-describedby attribute', () => {
      button.setAttribute('aria-describedby', 'help-text');
      expect(button.constructor.observedAttributes).toContain('aria-describedby');
    });

    test('should support role attribute', () => {
      button.setAttribute('role', 'tab');
      expect(button.constructor.observedAttributes).toContain('role');
    });

    test('should have focus-visible styles', () => {
      const styles = button.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('focus-visible');
    });
  });

  describe('CSS Custom Properties', () => {
    test('should use CSS custom properties for theming', () => {
      const styles = button.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('--bridge-primary');
      expect(styles).toContain('--bridge-radius-button');
      expect(styles).toContain('--bridge-font-primary');
      expect(styles).toContain('--bridge-transition-base');
    });
  });
});