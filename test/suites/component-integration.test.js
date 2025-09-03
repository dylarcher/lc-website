/**
 * Component Integration Tests
 * Tests for component interactions and combined functionality
 */

import '../../src/elements/bridge-button.js';
import '../../src/components/bridge-modal.js';
import '../../src/components/bridge-accordion.js';
import '../../src/sections/bridge-header.js';

describe('Component Integration Tests', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Button and Modal Integration', () => {
    test('should open modal when button is clicked', async () => {
      // Create button and modal
      const button = createTestComponent('bridge-button');
      const modal = createTestComponent('bridge-modal', { id: 'test-modal' });
      
      button.innerHTML = 'Open Modal';
      modal.innerHTML = '<p>Modal content</p>';
      
      await waitForComponentReady(button);
      await waitForComponentReady(modal);
      
      // Set up button to trigger modal
      button.addEventListener('bridge-button-click', () => {
        modal.setAttribute('open', '');
      });
      
      // Trigger button click
      const shadowButton = button.shadowRoot.querySelector('button');
      shadowButton.click();
      
      // Check if modal is opened
      expect(modal.hasAttribute('open')).toBe(true);
    });

    test('should close modal when close button is clicked', async () => {
      const modal = createTestComponent('bridge-modal', { open: '' });
      const closeButton = createTestComponent('bridge-button');
      
      await waitForComponentReady(modal);
      await waitForComponentReady(closeButton);
      
      closeButton.addEventListener('bridge-button-click', () => {
        modal.removeAttribute('open');
      });
      
      const shadowButton = closeButton.shadowRoot.querySelector('button');
      shadowButton.click();
      
      expect(modal.hasAttribute('open')).toBe(false);
    });
  });

  describe('Header and Menu Integration', () => {
    test('should render complete navigation structure', async () => {
      const header = createTestComponent('bridge-header', { logo: 'Legacy Concierge' });
      const menu = document.createElement('bridge-menu');
      const menuItem1 = document.createElement('bridge-menu-item');
      const menuItem2 = document.createElement('bridge-menu-item');
      
      menuItem1.setAttribute('href', '/services');
      menuItem1.textContent = 'Services';
      menuItem2.setAttribute('href', '/about');
      menuItem2.textContent = 'About';
      
      menu.appendChild(menuItem1);
      menu.appendChild(menuItem2);
      menu.setAttribute('slot', 'menu');
      header.appendChild(menu);
      
      await waitForComponentReady(header);
      
      // Check that header rendered
      const nav = header.shadowRoot.querySelector('nav');
      expect(nav).toBeTruthy();
      
      // Check that menu slot is available
      const menuSlot = header.shadowRoot.querySelector('slot[name="menu"]');
      expect(menuSlot).toBeTruthy();
    });

    test('should handle mobile menu toggle in complete navigation', async () => {
      const header = createTestComponent('bridge-header');
      const menu = document.createElement('bridge-menu');
      menu.setAttribute('slot', 'menu');
      header.appendChild(menu);
      
      await waitForComponentReady(header);
      
      expect(header.isMenuOpen).toBe(false);
      
      // Toggle mobile menu
      const mobileToggle = header.shadowRoot.querySelector('.mobile-toggle');
      mobileToggle.click();
      
      expect(header.isMenuOpen).toBe(true);
    });
  });

  describe('Accordion Component Interaction', () => {
    test('should handle accordion with multiple items', async () => {
      const accordion = createTestComponent('bridge-accordion');
      const item1 = document.createElement('bridge-accordion-item');
      const item2 = document.createElement('bridge-accordion-item');
      
      item1.setAttribute('title', 'Section 1');
      item1.innerHTML = 'Content 1';
      item2.setAttribute('title', 'Section 2');
      item2.innerHTML = 'Content 2';
      
      accordion.appendChild(item1);
      accordion.appendChild(item2);
      
      await waitForComponentReady(accordion);
      
      // Check that accordion rendered with items
      const slot = accordion.shadowRoot.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    test('should handle accordion with controls', async () => {
      const accordion = createTestComponent('bridge-accordion', { 'show-controls': '' });
      
      await waitForComponentReady(accordion);
      
      const controls = accordion.shadowRoot.querySelector('.controls');
      const expandBtn = accordion.shadowRoot.querySelector('.expand-all-btn');
      const collapseBtn = accordion.shadowRoot.querySelector('.collapse-all-btn');
      
      expect(controls).toBeTruthy();
      expect(expandBtn).toBeTruthy();
      expect(collapseBtn).toBeTruthy();
    });
  });

  describe('Form Component Integration', () => {
    test('should handle form with input and button components', async () => {
      const form = document.createElement('form');
      const input = createTestComponent('bridge-input');
      const button = createTestComponent('bridge-button');
      
      input.setAttribute('type', 'email');
      input.setAttribute('placeholder', 'Enter email');
      button.innerHTML = 'Submit';
      button.setAttribute('variant', 'primary');
      
      form.appendChild(input);
      form.appendChild(button);
      document.body.appendChild(form);
      
      await waitForComponentReady(input);
      await waitForComponentReady(button);
      
      // Check that both components are rendered
      const inputShadow = input.shadowRoot.querySelector('input');
      const buttonShadow = button.shadowRoot.querySelector('button');
      
      expect(inputShadow).toBeTruthy();
      expect(buttonShadow).toBeTruthy();
      expect(inputShadow.type).toBe('email');
      expect(buttonShadow.className).toContain('primary');
    });
  });

  describe('Event Propagation Between Components', () => {
    test('should propagate custom events between components', async () => {
      const container = document.createElement('div');
      const button = createTestComponent('bridge-button');
      const accordion = createTestComponent('bridge-accordion');
      
      container.appendChild(button);
      container.appendChild(accordion);
      document.body.appendChild(container);
      
      await waitForComponentReady(button);
      await waitForComponentReady(accordion);
      
      let eventCaught = false;
      container.addEventListener('bridge-button-click', () => {
        eventCaught = true;
      });
      
      const shadowButton = button.shadowRoot.querySelector('button');
      shadowButton.click();
      
      expect(eventCaught).toBe(true);
    });
  });

  describe('CSS Custom Properties Integration', () => {
    test('should share theme variables across components', async () => {
      const button = createTestComponent('bridge-button');
      const accordion = createTestComponent('bridge-accordion');
      
      await waitForComponentReady(button);
      await waitForComponentReady(accordion);
      
      // Both components should use the same CSS custom properties
      const buttonStyles = button.shadowRoot.querySelector('style').textContent;
      const accordionStyles = accordion.shadowRoot.querySelector('style').textContent;
      
      expect(buttonStyles).toContain('--bridge-primary');
      expect(accordionStyles).toContain('--bridge-primary');
      expect(buttonStyles).toContain('--bridge-transition-base');
      expect(accordionStyles).toContain('--bridge-transition-base');
    });

    test('should apply Legacy Concierge brand variables', async () => {
      const header = createTestComponent('bridge-header');
      
      await waitForComponentReady(header);
      
      const styles = header.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('--lc-primary');
    });
  });

  describe('Responsive Design Integration', () => {
    test('should handle mobile breakpoint changes', async () => {
      const header = createTestComponent('bridge-header');
      
      await waitForComponentReady(header);
      
      const styles = header.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('@media (max-width: 767.98px)');
      expect(styles).toContain('@media (min-width: 768px)');
    });
  });

  describe('Asset Helper Integration', () => {
    test('should load assets consistently across components', async () => {
      const header = createTestComponent('bridge-header');
      
      await waitForComponentReady(header);
      
      const logoImg = header.shadowRoot.querySelector('.bridge-logo img');
      expect(logoImg.src).toContain('legacy-concierge-logo');
    });
  });
});