/**
 * End-to-End Page Functionality Tests
 * Tests complete page interactions and user workflows
 */

import '../../src/main.js';

describe('Page Functionality E2E Tests', () => {
  beforeEach(() => {
    // Reset DOM for each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cleanup();
  });

  describe('Homepage Integration', () => {
    test('should load complete homepage structure', async () => {
      // Simulate loading homepage structure
      document.body.innerHTML = `
        <bridge-header logo="Legacy Concierge" sticky>
          <bridge-menu slot="menu">
            <bridge-menu-item href="/services">Services</bridge-menu-item>
            <bridge-menu-item href="/about">About</bridge-menu-item>
            <bridge-menu-item href="/contact">Contact</bridge-menu-item>
          </bridge-menu>
        </bridge-header>
        
        <bridge-hero variant="centered" background="teal">
          <h1>Your Health. Our Purpose.</h1>
          <p>Premium concierge nursing and caregiver services in Los Angeles</p>
          <bridge-button variant="primary">Our Services</bridge-button>
        </bridge-hero>
        
        <bridge-footer>
          <p>&copy; 2025 Legacy Concierge</p>
        </bridge-footer>
      `;

      // Wait for all components to be ready
      const header = document.querySelector('bridge-header');
      const hero = document.querySelector('bridge-hero');
      const button = document.querySelector('bridge-button');
      const footer = document.querySelector('bridge-footer');

      await waitForComponentReady(header);
      await waitForComponentReady(hero);
      await waitForComponentReady(button);
      await waitForComponentReady(footer);

      // Verify all components are rendered
      expect(header.shadowRoot.querySelector('nav')).toBeTruthy();
      expect(hero.shadowRoot.querySelector('.bridge-hero')).toBeTruthy();
      expect(button.shadowRoot.querySelector('button')).toBeTruthy();
      expect(footer.shadowRoot.querySelector('footer')).toBeTruthy();
    });

    test('should handle interactive elements on homepage', async () => {
      document.body.innerHTML = `
        <bridge-header logo="Legacy Concierge">
          <bridge-menu slot="menu">
            <bridge-menu-item href="/services">Services</bridge-menu-item>
          </bridge-menu>
        </bridge-header>
        
        <bridge-button id="cta-button" variant="primary">Get Started</bridge-button>
        
        <bridge-modal id="contact-modal">
          <h2>Contact Us</h2>
          <bridge-contact-form></bridge-contact-form>
        </bridge-modal>
      `;

      const header = document.querySelector('bridge-header');
      const button = document.querySelector('#cta-button');
      const modal = document.querySelector('#contact-modal');

      await waitForComponentReady(header);
      await waitForComponentReady(button);
      await waitForComponentReady(modal);

      // Test mobile menu toggle
      const mobileToggle = header.shadowRoot.querySelector('.mobile-toggle');
      mobileToggle.click();
      expect(header.isMenuOpen).toBe(true);

      // Test button interaction
      let buttonClicked = false;
      button.addEventListener('bridge-button-click', () => {
        buttonClicked = true;
        modal.setAttribute('open', '');
      });

      const shadowButton = button.shadowRoot.querySelector('button');
      shadowButton.click();
      
      expect(buttonClicked).toBe(true);
      expect(modal.hasAttribute('open')).toBe(true);
    });
  });

  describe('Component Gallery Page', () => {
    test('should render component showcase', async () => {
      document.body.innerHTML = `
        <div class="component-gallery">
          <bridge-accordion show-controls>
            <bridge-accordion-item title="Buttons" open>
              <bridge-button variant="primary">Primary</bridge-button>
              <bridge-button variant="secondary">Secondary</bridge-button>
              <bridge-button variant="outline">Outline</bridge-button>
            </bridge-accordion-item>
            
            <bridge-accordion-item title="Forms">
              <bridge-input type="text" placeholder="Enter text"></bridge-input>
              <bridge-input type="email" placeholder="Enter email"></bridge-input>
            </bridge-accordion-item>
          </bridge-accordion>
        </div>
      `;

      const accordion = document.querySelector('bridge-accordion');
      const items = document.querySelectorAll('bridge-accordion-item');
      const buttons = document.querySelectorAll('bridge-button');
      const inputs = document.querySelectorAll('bridge-input');

      await waitForComponentReady(accordion);
      
      // Wait for all items to be ready
      for (const item of items) {
        await waitForComponentReady(item);
      }
      
      for (const button of buttons) {
        await waitForComponentReady(button);
      }
      
      for (const input of inputs) {
        await waitForComponentReady(input);
      }

      // Verify accordion controls are present
      const expandBtn = accordion.shadowRoot.querySelector('.expand-all-btn');
      const collapseBtn = accordion.shadowRoot.querySelector('.collapse-all-btn');
      expect(expandBtn).toBeTruthy();
      expect(collapseBtn).toBeTruthy();

      // Verify all button variants are rendered
      expect(buttons[0].variant).toBe('primary');
      expect(buttons[1].variant).toBe('secondary');
      expect(buttons[2].variant).toBe('outline');

      // Test accordion expand/collapse all functionality
      collapseBtn.click();
      // Should dispatch collapse-all event
      expect(accordion.areAllCollapsed).toBe(true);

      expandBtn.click();
      // Should dispatch expand-all event
      expect(accordion.areAllExpanded).toBe(true);
    });
  });

  describe('Contact Page Workflow', () => {
    test('should handle complete contact form submission', async () => {
      document.body.innerHTML = `
        <bridge-contact-form>
          <bridge-input name="name" type="text" placeholder="Your Name" required></bridge-input>
          <bridge-input name="email" type="email" placeholder="Your Email" required></bridge-input>
          <bridge-input name="message" type="textarea" placeholder="Your Message" required></bridge-input>
          <bridge-button type="submit" variant="primary">Send Message</bridge-button>
        </bridge-contact-form>
      `;

      const form = document.querySelector('bridge-contact-form');
      const inputs = document.querySelectorAll('bridge-input');
      const submitButton = document.querySelector('bridge-button');

      await waitForComponentReady(form);
      
      for (const input of inputs) {
        await waitForComponentReady(input);
      }
      
      await waitForComponentReady(submitButton);

      // Simulate form filling
      const nameInput = inputs[0].shadowRoot.querySelector('input');
      const emailInput = inputs[1].shadowRoot.querySelector('input');
      const messageInput = inputs[2].shadowRoot.querySelector('textarea');

      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      messageInput.value = 'I need healthcare services.';

      // Trigger input events
      nameInput.dispatchEvent(new Event('input'));
      emailInput.dispatchEvent(new Event('input'));
      messageInput.dispatchEvent(new Event('input'));

      // Test form submission
      let formSubmitted = false;
      form.addEventListener('form-submit', (event) => {
        formSubmitted = true;
        expect(event.detail.data.name).toBe('John Doe');
        expect(event.detail.data.email).toBe('john@example.com');
        expect(event.detail.data.message).toBe('I need healthcare services.');
      });

      const shadowButton = submitButton.shadowRoot.querySelector('button');
      shadowButton.click();

      expect(formSubmitted).toBe(true);
    });
  });

  describe('Portfolio Page Filtering', () => {
    test('should handle portfolio filtering workflow', async () => {
      document.body.innerHTML = `
        <bridge-portfolio-filter>
          <bridge-button data-filter="all" class="active">All</bridge-button>
          <bridge-button data-filter="nursing">Nursing</bridge-button>
          <bridge-button data-filter="caregiving">Caregiving</bridge-button>
        </bridge-portfolio-filter>
        
        <div class="portfolio-grid">
          <bridge-portfolio-item data-category="nursing">
            <h3>Private Nursing</h3>
          </bridge-portfolio-item>
          <bridge-portfolio-item data-category="caregiving">
            <h3>Home Caregiving</h3>
          </bridge-portfolio-item>
          <bridge-portfolio-item data-category="nursing">
            <h3>Post-Op Care</h3>
          </bridge-portfolio-item>
        </div>
      `;

      const filter = document.querySelector('bridge-portfolio-filter');
      const filterButtons = filter.querySelectorAll('bridge-button');
      const portfolioItems = document.querySelectorAll('bridge-portfolio-item');

      await waitForComponentReady(filter);
      
      for (const button of filterButtons) {
        await waitForComponentReady(button);
      }
      
      for (const item of portfolioItems) {
        await waitForComponentReady(item);
      }

      // Test filtering functionality
      let filterApplied = false;
      filter.addEventListener('filter-change', (event) => {
        filterApplied = true;
        expect(event.detail.filter).toBe('nursing');
      });

      // Click nursing filter
      const nursingButton = filterButtons[1];
      const shadowButton = nursingButton.shadowRoot.querySelector('button');
      shadowButton.click();

      expect(filterApplied).toBe(true);
    });
  });

  describe('Responsive Design E2E', () => {
    test('should adapt to mobile viewport', async () => {
      document.body.innerHTML = `
        <bridge-header logo="Legacy Concierge">
          <bridge-menu slot="menu">
            <bridge-menu-item href="/services">Services</bridge-menu-item>
            <bridge-menu-item href="/about">About</bridge-menu-item>
          </bridge-menu>
        </bridge-header>
      `;

      const header = document.querySelector('bridge-header');
      await waitForComponentReady(header);

      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      
      const mobileToggle = header.shadowRoot.querySelector('.mobile-toggle');
      
      // Mobile toggle should be available in mobile viewport
      expect(mobileToggle).toBeTruthy();
      
      // Test mobile menu interaction
      mobileToggle.click();
      expect(header.isMenuOpen).toBe(true);
      
      const headerElement = header.shadowRoot.querySelector('.bridge-header');
      expect(headerElement.classList.contains('mobile-menu-open')).toBe(true);
    });
  });

  describe('Accessibility E2E', () => {
    test('should support keyboard navigation', async () => {
      document.body.innerHTML = `
        <bridge-menu>
          <bridge-menu-item href="/services" tabindex="0">Services</bridge-menu-item>
          <bridge-menu-item href="/about" tabindex="0">About</bridge-menu-item>
        </bridge-menu>
        
        <bridge-accordion>
          <bridge-accordion-item title="FAQ 1">Answer 1</bridge-accordion-item>
          <bridge-accordion-item title="FAQ 2">Answer 2</bridge-accordion-item>
        </bridge-accordion>
      `;

      const menu = document.querySelector('bridge-menu');
      const menuItems = document.querySelectorAll('bridge-menu-item');
      const accordion = document.querySelector('bridge-accordion');
      const accordionItems = document.querySelectorAll('bridge-accordion-item');

      await waitForComponentReady(menu);
      await waitForComponentReady(accordion);
      
      for (const item of menuItems) {
        await waitForComponentReady(item);
      }
      
      for (const item of accordionItems) {
        await waitForComponentReady(item);
      }

      // Test tabindex on menu items
      const firstMenuItem = menuItems[0];
      const menuLink = firstMenuItem.shadowRoot.querySelector('a');
      expect(menuLink).toBeTruthy();

      // Test accordion keyboard support
      const firstAccordionItem = accordionItems[0];
      const summary = firstAccordionItem.shadowRoot.querySelector('summary');
      expect(summary.getAttribute('tabindex')).toBe('0');
      expect(summary.getAttribute('role')).toBe('button');
    });

    test('should have proper ARIA labels and roles', async () => {
      document.body.innerHTML = `
        <bridge-accordion show-controls label="FAQ">
          <bridge-accordion-item title="Question 1">Answer 1</bridge-accordion-item>
        </bridge-accordion>
      `;

      const accordion = document.querySelector('bridge-accordion');
      await waitForComponentReady(accordion);

      const region = accordion.shadowRoot.querySelector('[role="region"]');
      const toolbar = accordion.shadowRoot.querySelector('[role="toolbar"]');
      const group = accordion.shadowRoot.querySelector('[role="group"]');

      expect(region).toBeTruthy();
      expect(toolbar).toBeTruthy();
      expect(group).toBeTruthy();
      
      const expandBtn = accordion.shadowRoot.querySelector('.expand-all-btn');
      expect(expandBtn.getAttribute('aria-label')).toContain('Expand all');
    });
  });
});