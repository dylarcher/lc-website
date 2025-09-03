/**
 * Bridge Accordion Component Tests
 * Tests for the Legacy Concierge accordion web component
 */

import '../../../src/components/bridge-accordion.js';

describe('BridgeAccordion', () => {
  let accordion;

  beforeEach(() => {
    accordion = createTestComponent('bridge-accordion');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Registration', () => {
    test('should be defined as custom element', () => {
      expect(customElements.get('bridge-accordion')).toBeDefined();
    });

    test('should create instance with shadow root', () => {
      expect(accordion).toBeCustomElement();
      expect(accordion.shadowRoot).toBeDefined();
    });
  });

  describe('Attributes and Properties', () => {
    test('should observe attribute changes', () => {
      const observedAttrs = accordion.constructor.observedAttributes;
      expect(observedAttrs).toContain('allow-multiple');
      expect(observedAttrs).toContain('collapse-siblings');
      expect(observedAttrs).toContain('show-controls');
    });

    test('should handle allow-multiple attribute', () => {
      expect(accordion.allowMultiple).toBe(false);
      accordion.setAttribute('allow-multiple', '');
      expect(accordion.allowMultiple).toBe(true);
    });

    test('should handle collapse-siblings attribute', () => {
      expect(accordion.collapseSiblings).toBe(false);
      accordion.setAttribute('collapse-siblings', '');
      expect(accordion.collapseSiblings).toBe(true);
    });

    test('should handle show-controls attribute', () => {
      expect(accordion.showControls).toBe(false);
      accordion.setAttribute('show-controls', '');
      expect(accordion.showControls).toBe(true);
    });
  });

  describe('Rendering', () => {
    test('should render with slot for content', () => {
      const slot = accordion.shadowRoot.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    test('should show controls when show-controls attribute is set', () => {
      accordion.setAttribute('show-controls', '');
      const controls = accordion.shadowRoot.querySelector('.controls');
      expect(controls).toBeTruthy();
      
      const expandBtn = accordion.shadowRoot.querySelector('.expand-all-btn');
      const collapseBtn = accordion.shadowRoot.querySelector('.collapse-all-btn');
      expect(expandBtn).toBeTruthy();
      expect(collapseBtn).toBeTruthy();
    });

    test('should hide controls when show-controls attribute is not set', () => {
      const controls = accordion.shadowRoot.querySelector('.controls');
      const computedStyle = window.getComputedStyle ? 
        window.getComputedStyle(controls).display : 'none';
      expect(computedStyle).toBe('none');
    });
  });

  describe('Control Functionality', () => {
    beforeEach(() => {
      accordion.setAttribute('show-controls', '');
      // Add mock details elements
      accordion.shadowRoot.innerHTML = accordion.shadowRoot.innerHTML + `
        <details><summary>Test 1</summary><div>Content 1</div></details>
        <details><summary>Test 2</summary><div>Content 2</div></details>
      `;
    });

    test('should expand all details when expand all button is clicked', () => {
      const expandBtn = accordion.shadowRoot.querySelector('.expand-all-btn');
      expandBtn.click();
      
      const allDetails = accordion.shadowRoot.querySelectorAll('details');
      allDetails.forEach(details => {
        expect(details.open).toBe(true);
      });
    });

    test('should collapse all details when collapse all button is clicked', () => {
      // First expand all
      const expandBtn = accordion.shadowRoot.querySelector('.expand-all-btn');
      expandBtn.click();
      
      // Then collapse all
      const collapseBtn = accordion.shadowRoot.querySelector('.collapse-all-btn');
      collapseBtn.click();
      
      const allDetails = accordion.shadowRoot.querySelectorAll('details');
      allDetails.forEach(details => {
        expect(details.open).toBe(false);
      });
    });

    test('should dispatch expand-all event', () => {
      const expandHandler = jest.fn();
      accordion.addEventListener('accordion-expand-all', expandHandler);
      
      accordion.expandAll();
      
      expect(expandHandler).toHaveBeenCalledTimes(1);
      expect(expandHandler.mock.calls[0][0].detail.accordion).toBe(accordion);
    });

    test('should dispatch collapse-all event', () => {
      const collapseHandler = jest.fn();
      accordion.addEventListener('accordion-collapse-all', collapseHandler);
      
      accordion.collapseAll();
      
      expect(collapseHandler).toHaveBeenCalledTimes(1);
      expect(expandHandler.mock.calls[0][0].detail.accordion).toBe(accordion);
    });
  });

  describe('State Detection', () => {
    beforeEach(() => {
      // Mock details elements in shadow root
      const mockDetails1 = document.createElement('details');
      const mockDetails2 = document.createElement('details');
      accordion.shadowRoot.appendChild(mockDetails1);
      accordion.shadowRoot.appendChild(mockDetails2);
    });

    test('should detect when all are expanded', () => {
      const allDetails = accordion.shadowRoot.querySelectorAll('details');
      allDetails.forEach(details => details.open = true);
      
      expect(accordion.areAllExpanded).toBe(true);
    });

    test('should detect when all are collapsed', () => {
      const allDetails = accordion.shadowRoot.querySelectorAll('details');
      allDetails.forEach(details => details.open = false);
      
      expect(accordion.areAllCollapsed).toBe(true);
    });

    test('should detect mixed state', () => {
      const allDetails = accordion.shadowRoot.querySelectorAll('details');
      if (allDetails.length >= 2) {
        allDetails[0].open = true;
        allDetails[1].open = false;
        
        expect(accordion.areAllExpanded).toBe(false);
        expect(accordion.areAllCollapsed).toBe(false);
      }
    });
  });

  describe('Accessibility', () => {
    test('should include proper ARIA roles and labels', () => {
      accordion.setAttribute('show-controls', '');
      accordion.setAttribute('label', 'FAQ');
      
      const region = accordion.shadowRoot.querySelector('[role="region"]');
      const toolbar = accordion.shadowRoot.querySelector('[role="toolbar"]');
      const group = accordion.shadowRoot.querySelector('[role="group"]');
      
      expect(region).toBeTruthy();
      expect(toolbar).toBeTruthy();
      expect(group).toBeTruthy();
    });

    test('should have screen reader only descriptions', () => {
      accordion.setAttribute('show-controls', '');
      
      const srElements = accordion.shadowRoot.querySelectorAll('.sr-only');
      expect(srElements.length).toBeGreaterThan(0);
    });
  });

  describe('CSS Custom Properties', () => {
    test('should use CSS custom properties for theming', () => {
      const styles = accordion.shadowRoot.querySelector('style').textContent;
      expect(styles).toContain('--bridge-primary');
      expect(styles).toContain('--bridge-border-light');
      expect(styles).toContain('--bridge-bg-light');
      expect(styles).toContain('--bridge-text-dark');
      expect(styles).toContain('--bridge-transition-base');
    });
  });
});

describe('BridgeAccordionItem', () => {
  let item;

  beforeEach(() => {
    item = createTestComponent('bridge-accordion-item');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Registration', () => {
    test('should be defined as custom element', () => {
      expect(customElements.get('bridge-accordion-item')).toBeDefined();
    });

    test('should create instance with shadow root', () => {
      expect(item).toBeCustomElement();
      expect(item.shadowRoot).toBeDefined();
    });
  });

  describe('Attributes and Properties', () => {
    test('should observe attribute changes', () => {
      const observedAttrs = item.constructor.observedAttributes;
      expect(observedAttrs).toContain('title');
      expect(observedAttrs).toContain('open');
    });

    test('should handle title attribute', () => {
      expect(item.title).toBe('');
      item.setAttribute('title', 'Test Title');
      expect(item.title).toBe('Test Title');
    });

    test('should handle open attribute', () => {
      expect(item.isOpen).toBe(false);
      item.setAttribute('open', '');
      expect(item.isOpen).toBe(true);
    });
  });

  describe('Rendering', () => {
    test('should render details element', () => {
      item.setAttribute('title', 'Test Title');
      const details = item.shadowRoot.querySelector('details');
      expect(details).toBeTruthy();
    });

    test('should render summary with title', () => {
      item.setAttribute('title', 'Test Title');
      const summary = item.shadowRoot.querySelector('summary');
      expect(summary).toBeTruthy();
      expect(summary.textContent).toContain('Test Title');
    });

    test('should render open when open attribute is set', () => {
      item.setAttribute('open', '');
      item.setAttribute('title', 'Test Title');
      const details = item.shadowRoot.querySelector('details');
      expect(details.hasAttribute('open')).toBe(true);
    });

    test('should render slot for content', () => {
      const slot = item.shadowRoot.querySelector('slot');
      expect(slot).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      item.setAttribute('title', 'Test Title');
      const summary = item.shadowRoot.querySelector('summary');
      const content = item.shadowRoot.querySelector('.accordion-content');
      
      expect(summary.getAttribute('role')).toBe('button');
      expect(summary.hasAttribute('aria-expanded')).toBe(true);
      expect(summary.hasAttribute('aria-controls')).toBe(true);
      expect(content.getAttribute('role')).toBe('region');
      expect(content.hasAttribute('aria-labelledby')).toBe(true);
    });

    test('should be keyboard accessible', () => {
      item.setAttribute('title', 'Test Title');
      const summary = item.shadowRoot.querySelector('summary');
      expect(summary.getAttribute('tabindex')).toBe('0');
    });
  });
});