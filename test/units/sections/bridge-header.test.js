/**
 * Bridge Header Section Tests
 * Tests for the Legacy Concierge header web component
 */

import '../../../src/sections/bridge-header.js';

describe('BridgeHeader', () => {
  let header;

  beforeEach(() => {
    header = createTestComponent('bridge-header');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Registration', () => {
    test('should register all header-related components', () => {
      expect(customElements.get('bridge-header')).toBeDefined();
      expect(customElements.get('bridge-menu')).toBeDefined();
      expect(customElements.get('bridge-menu-item')).toBeDefined();
      expect(customElements.get('bridge-dropdown')).toBeDefined();
    });

    test('should create instance with shadow root', () => {
      expect(header).toBeCustomElement();
      expect(header.shadowRoot).toBeDefined();
    });
  });

  describe('Attributes and Properties', () => {
    test('should observe attribute changes', () => {
      const observedAttrs = header.constructor.observedAttributes;
      expect(observedAttrs).toContain('logo');
      expect(observedAttrs).toContain('variant');
      expect(observedAttrs).toContain('sticky');
      expect(observedAttrs).toContain('background');
      expect(observedAttrs).toContain('transparent');
    });

    test('should handle logo attribute', () => {
      header.setAttribute('logo', 'Test Logo');
      const logoImg = header.shadowRoot.querySelector('.bridge-logo img');
      expect(logoImg.alt).toBe('Test Logo');
    });

    test('should handle sticky attribute', () => {
      header.setAttribute('sticky', '');
      const headerEl = header.shadowRoot.querySelector('.bridge-header');
      const computedStyle = window.getComputedStyle ? 
        window.getComputedStyle(headerEl).position : 'sticky';
      expect(computedStyle).toBe('sticky');
    });

    test('should handle variant attribute', () => {
      header.setAttribute('variant', 'centered');
      const headerEl = header.shadowRoot.querySelector('.bridge-header');
      expect(headerEl.className).toContain('variant-centered');
    });

    test('should handle transparent attribute', () => {
      header.setAttribute('transparent', '');
      const headerEl = header.shadowRoot.querySelector('.bridge-header');
      const computedStyle = window.getComputedStyle ? 
        window.getComputedStyle(headerEl).background : 'transparent';
      expect(computedStyle).toContain('transparent');
    });
  });

  describe('Mobile Menu Functionality', () => {
    test('should toggle mobile menu state', () => {
      expect(header.isMenuOpen).toBe(false);
      header.toggleMobileMenu();
      expect(header.isMenuOpen).toBe(true);
      header.toggleMobileMenu();
      expect(header.isMenuOpen).toBe(false);
    });

    test('should dispatch menu-toggle event', () => {
      const toggleHandler = jest.fn();
      header.addEventListener('menu-toggle', toggleHandler);
      
      header.toggleMobileMenu();
      
      expect(toggleHandler).toHaveBeenCalledTimes(1);
      expect(toggleHandler.mock.calls[0][0].detail.isOpen).toBe(true);
    });

    test('should toggle mobile menu on button click', () => {
      const mobileToggle = header.shadowRoot.querySelector('.mobile-toggle');
      expect(header.isMenuOpen).toBe(false);
      
      mobileToggle.click();
      expect(header.isMenuOpen).toBe(true);
    });
  });

  describe('Scroll Functionality', () => {
    test('should initialize scroll state', () => {
      expect(header.isScrolled).toBe(false);
    });

    test('should update scroll state', () => {
      header.isScrolled = true;
      header.updateScrollState();
      
      const headerEl = header.shadowRoot.querySelector('.bridge-header');
      expect(headerEl.classList.contains('scrolled')).toBe(true);
    });

    test('should setup scroll event listener', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const newHeader = createTestComponent('bridge-header');
      
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll', 
        expect.any(Function), 
        { passive: true }
      );
      
      addEventListenerSpy.mockRestore();
    });

    test('should remove scroll event listener on disconnect', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      header.disconnectedCallback();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
      
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Menu Item Click Handling', () => {
    test('should dispatch menu-item-click event', () => {
      const clickHandler = jest.fn();
      header.addEventListener('menu-item-click', clickHandler);
      
      // Create a mock menu item click
      const mockEvent = new Event('click');
      Object.defineProperty(mockEvent, 'target', {
        value: { matches: () => true }
      });
      
      header.handleMenuClick(mockEvent);
      
      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    test('should close mobile menu when menu item is clicked', () => {
      header.isMenuOpen = true;
      
      const mockEvent = new Event('click');
      Object.defineProperty(mockEvent, 'target', {
        value: { matches: () => true }
      });
      
      header.handleMenuClick(mockEvent);
      expect(header.isMenuOpen).toBe(false);
    });
  });

  describe('Legacy Concierge Branding', () => {
    test('should include Legacy Concierge logo', () => {
      const logoImg = header.shadowRoot.querySelector('.bridge-logo img');
      expect(logoImg.src).toContain('legacy-concierge-logo');
    });

    test('should include "Lc" text branding', () => {
      const logoText = header.shadowRoot.querySelector('.lc-logo-text');
      expect(logoText.textContent).toBe('Lc');
    });

    test('should include brand tagline', () => {
      const tagline = header.shadowRoot.querySelector('.lc-tagline');
      expect(tagline.textContent).toBe('YOUR HEALTH. OUR PURPOSE.');
    });
  });

  describe('Accessibility', () => {
    test('should have aria-label for mobile toggle', () => {
      const mobileToggle = header.shadowRoot.querySelector('.mobile-toggle');
      expect(mobileToggle.getAttribute('aria-label')).toBe('Toggle navigation');
    });

    test('should have proper nav structure', () => {
      const nav = header.shadowRoot.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(nav.className).toContain('bridge-navigation');
    });
  });

  describe('CSS Custom Properties', () => {
    test('should use CSS custom properties for theming', () => {
      const styles = header.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('--bridge-bg-white');
      expect(styles).toContain('--bridge-text-dark');
      expect(styles).toContain('--bridge-primary');
      expect(styles).toContain('--bridge-transition-base');
      expect(styles).toContain('--bridge-spacing-md');
    });
  });
});

describe('BridgeMenu', () => {
  let menu;

  beforeEach(() => {
    menu = createTestComponent('bridge-menu');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Registration', () => {
    test('should be defined as custom element', () => {
      expect(customElements.get('bridge-menu')).toBeDefined();
    });

    test('should create instance with shadow root', () => {
      expect(menu).toBeCustomElement();
      expect(menu.shadowRoot).toBeDefined();
    });
  });

  describe('Rendering', () => {
    test('should render with slot for menu items', () => {
      const slot = menu.shadowRoot.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    test('should have flex display styling', () => {
      const styles = menu.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('display: flex');
    });
  });
});

describe('BridgeMenuItem', () => {
  let menuItem;

  beforeEach(() => {
    menuItem = createTestComponent('bridge-menu-item');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Registration', () => {
    test('should be defined as custom element', () => {
      expect(customElements.get('bridge-menu-item')).toBeDefined();
    });

    test('should create instance with shadow root', () => {
      expect(menuItem).toBeCustomElement();
      expect(menuItem.shadowRoot).toBeDefined();
    });
  });

  describe('Attributes and Properties', () => {
    test('should observe attribute changes', () => {
      const observedAttrs = menuItem.constructor.observedAttributes;
      expect(observedAttrs).toContain('href');
      expect(observedAttrs).toContain('active');
      expect(observedAttrs).toContain('has-dropdown');
    });

    test('should handle href attribute', () => {
      menuItem.setAttribute('href', '/test');
      const link = menuItem.shadowRoot.querySelector('a');
      expect(link.href).toContain('/test');
    });

    test('should handle active attribute', () => {
      menuItem.setAttribute('active', '');
      expect(menuItem.hasAttribute('active')).toBe(true);
    });

    test('should handle has-dropdown attribute', () => {
      menuItem.setAttribute('has-dropdown', '');
      const dropdownIcon = menuItem.shadowRoot.querySelector('.dropdown-icon');
      expect(dropdownIcon).toBeTruthy();
    });
  });

  describe('Event Handling', () => {
    test('should dispatch menu-item-click event on link click', () => {
      const clickHandler = jest.fn();
      menuItem.addEventListener('menu-item-click', clickHandler);
      menuItem.setAttribute('href', '/test-link');
      
      const link = menuItem.shadowRoot.querySelector('a');
      link.click();
      
      expect(clickHandler).toHaveBeenCalledTimes(1);
      expect(clickHandler.mock.calls[0][0].detail.href).toBe('/test-link');
    });
  });

  describe('Dropdown Functionality', () => {
    test('should show dropdown icon when has-dropdown is set', () => {
      menuItem.setAttribute('has-dropdown', '');
      const dropdownIcon = menuItem.shadowRoot.querySelector('.dropdown-icon');
      expect(dropdownIcon).toBeTruthy();
      expect(dropdownIcon.className).toContain('fa-chevron-down');
    });

    test('should include dropdown slot when has-dropdown is set', () => {
      menuItem.setAttribute('has-dropdown', '');
      const dropdownSlot = menuItem.shadowRoot.querySelector('slot[name="dropdown"]');
      expect(dropdownSlot).toBeTruthy();
    });
  });
});

describe('BridgeDropdown', () => {
  let dropdown;

  beforeEach(() => {
    dropdown = createTestComponent('bridge-dropdown');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Registration', () => {
    test('should be defined as custom element', () => {
      expect(customElements.get('bridge-dropdown')).toBeDefined();
    });

    test('should create instance with shadow root', () => {
      expect(dropdown).toBeCustomElement();
      expect(dropdown.shadowRoot).toBeDefined();
    });
  });

  describe('Rendering', () => {
    test('should render with slot for dropdown items', () => {
      const slot = dropdown.shadowRoot.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    test('should have block display styling', () => {
      const styles = dropdown.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('display: block');
    });
  });
});