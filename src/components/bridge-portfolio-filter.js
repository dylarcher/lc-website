// Bridge Portfolio Filter Component
// Filter buttons for portfolio and gallery components

class BridgePortfolioFilter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.activeFilter = 'all';
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.addEventListener('click', (e) => {
      const filterButton = e.target.closest('bridge-filter-button');
      if (filterButton) {
        this.setActiveFilter(filterButton.getAttribute('data-filter') || 'all');
      }
    });
  }

  setActiveFilter(filter) {
    this.activeFilter = filter;
    
    // Update button states
    const buttons = this.querySelectorAll('bridge-filter-button');
    buttons.forEach(button => {
      const buttonFilter = button.getAttribute('data-filter') || 'all';
      button.toggleAttribute('active', buttonFilter === filter);
    });

    // Dispatch filter change event
    this.dispatchEvent(new CustomEvent('portfolio-filter-change', {
      detail: { filter: this.activeFilter },
      bubbles: true
    }));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          gap: var(--bridge-spacing-sm, 1rem);
          margin-bottom: var(--bridge-spacing-lg, 3rem);
          flex-wrap: wrap;
        }

        ::slotted(bridge-filter-button) {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          :host {
            gap: var(--bridge-spacing-xs, 0.5rem);
          }
        }
      </style>
      
      <slot></slot>
    `;
  }
}

// Bridge Filter Button Component
class BridgeFilterButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['active', 'data-filter'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  setupEventListeners() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('filter-button-click', {
        detail: { filter: this.getAttribute('data-filter') },
        bubbles: true
      }));
    });
  }

  render() {
    const active = this.hasAttribute('active');
    const filter = this.getAttribute('data-filter') || 'all';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .filter-button {
          background: ${active ? 'var(--bridge-primary, #1abc9c)' : 'transparent'};
          border: 2px solid ${active ? 'var(--bridge-primary, #1abc9c)' : 'var(--bridge-border-light, #e5e5e5)'};
          color: ${active ? 'var(--bridge-text-white, #ffffff)' : 'var(--bridge-text-dark, #333333)'};
          padding: var(--bridge-spacing-xs, 0.5rem) var(--bridge-spacing-md, 2rem);
          border-radius: var(--bridge-radius-full, 50px);
          cursor: pointer;
          transition: var(--bridge-transition-base, all 0.3s ease);
          font-weight: var(--bridge-font-medium, 500);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          outline: none;
        }

        .filter-button:hover {
          background: var(--bridge-primary, #1abc9c);
          border-color: var(--bridge-primary, #1abc9c);
          color: var(--bridge-text-white, #ffffff);
          transform: translateY(-2px);
          box-shadow: var(--bridge-shadow-md, 0 4px 6px rgba(0,0,0,0.1));
        }

        .filter-button:focus {
          box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.3);
        }

        .filter-button:active {
          transform: translateY(0);
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .filter-button {
            transition: background-color 0.2s ease;
          }
          
          .filter-button:hover {
            transform: none;
          }
        }
      </style>
      
      <button class="filter-button" data-filter="${filter}">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('bridge-portfolio-filter', BridgePortfolioFilter);
customElements.define('bridge-filter-button', BridgeFilterButton);