// Bridge Service Card Component
// Service/feature cards with icons and actions

class BridgeServiceCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['icon', 'title', 'description', 'variant', 'hover-effect'];
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
      this.dispatchEvent(new CustomEvent('service-card-click', {
        detail: {
          title: this.getAttribute('title'),
          icon: this.getAttribute('icon')
        },
        bubbles: true
      }));
    });
  }

  render() {
    const icon = this.getAttribute('icon') || 'fas fa-star';
    const title = this.getAttribute('title') || 'Service Title';
    const description = this.getAttribute('description') || '';
    const variant = this.getAttribute('variant') || 'default';
    const hoverEffect = this.getAttribute('hover-effect') || 'lift';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .service-card {
          background: var(--bridge-bg-white, #ffffff);
          border-radius: var(--bridge-radius-lg, 1rem);
          padding: var(--bridge-spacing-lg, 3rem);
          text-align: center;
          transition: var(--bridge-transition-base, all 0.3s ease);
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }

        .service-card:hover::before {
          left: 100%;
        }

        .service-card.default {
          box-shadow: var(--bridge-shadow-md, 0 4px 6px rgba(0,0,0,0.1));
          border: 1px solid var(--bridge-border-light, #e5e5e5);
        }

        .service-card.bordered {
          border: 2px solid var(--bridge-primary, #1abc9c);
          box-shadow: none;
        }

        .service-card.minimal {
          background: transparent;
          box-shadow: none;
          border: none;
        }

        .service-card.gradient {
          background: linear-gradient(135deg, var(--bridge-primary, #1abc9c), var(--bridge-secondary, #2c3e50));
          color: var(--bridge-text-white, #ffffff);
        }

        .service-card.lift:hover {
          transform: translateY(-10px);
          box-shadow: var(--bridge-shadow-xl, 0 20px 25px rgba(0,0,0,0.15));
        }

        .service-card.scale:hover {
          transform: scale(1.05);
        }

        .service-card.rotate:hover {
          transform: rotate(2deg) scale(1.02);
        }

        .service-icon {
          font-size: 3rem;
          color: var(--bridge-primary, #1abc9c);
          margin-bottom: var(--bridge-spacing-md, 2rem);
          transition: var(--bridge-transition-base, all 0.3s ease);
        }

        .service-card.gradient .service-icon {
          color: var(--bridge-text-white, #ffffff);
        }

        .service-card:hover .service-icon {
          transform: scale(1.1);
        }

        .service-title {
          font-size: 1.5rem;
          font-weight: var(--bridge-font-semibold, 600);
          color: var(--bridge-text-dark, #333333);
          margin-bottom: var(--bridge-spacing-sm, 1rem);
          transition: var(--bridge-transition-base, all 0.3s ease);
        }

        .service-card.gradient .service-title {
          color: var(--bridge-text-white, #ffffff);
        }

        .service-description {
          color: var(--bridge-text-light, #777777);
          line-height: 1.6;
          margin-bottom: var(--bridge-spacing-lg, 3rem);
          flex: 1;
        }

        .service-card.gradient .service-description {
          color: rgba(255,255,255,0.9);
        }

        .service-actions {
          margin-top: auto;
        }

        ::slotted([slot="action"]) {
          width: 100%;
        }

        /* Number badge for numbered lists */
        .service-number {
          position: absolute;
          top: var(--bridge-spacing-md, 2rem);
          right: var(--bridge-spacing-md, 2rem);
          width: 40px;
          height: 40px;
          background: var(--bridge-primary, #1abc9c);
          color: var(--bridge-text-white, #ffffff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--bridge-font-bold, 700);
          font-size: 1.125rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .service-card {
            padding: var(--bridge-spacing-md, 2rem);
          }

          .service-icon {
            font-size: 2.5rem;
            margin-bottom: var(--bridge-spacing-sm, 1rem);
          }

          .service-title {
            font-size: 1.25rem;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .service-card, .service-icon {
            transition: none !important;
          }
          
          .service-card:hover {
            transform: none !important;
          }
          
          .service-card:hover .service-icon {
            transform: none !important;
          }
          
          .service-card::before {
            display: none;
          }
        }

        /* Focus styles */
        .service-card:focus {
          outline: 2px solid var(--bridge-primary, #1abc9c);
          outline-offset: 2px;
        }
      </style>
      
      <div class="service-card ${variant} ${hoverEffect}" tabindex="0" role="button">
        <div class="service-icon">
          <i class="${icon}" aria-hidden="true"></i>
        </div>
        
        <h3 class="service-title">${title}</h3>
        
        ${description ? `<p class="service-description">${description}</p>` : ''}
        
        <div class="service-description">
          <slot></slot>
        </div>
        
        <div class="service-actions">
          <slot name="action"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('bridge-service-card', BridgeServiceCard);