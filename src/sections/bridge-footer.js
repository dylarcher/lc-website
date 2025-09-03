// Bridge Footer Component
// Replaces WordPress footer functionality with web components

class BridgeFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['columns', 'copyright', 'background', 'border', 'in-grid'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  render() {
    const columns = parseInt(this.getAttribute('columns')) || 4;
    const copyright = this.getAttribute('copyright') || '';
    const background = this.getAttribute('background') || 'dark';
    const border = this.hasAttribute('border');
    const inGrid = this.getAttribute('in-grid') !== 'false';

    // Generate column classes based on number of columns
    const getColumnClass = (totalColumns) => {
      switch(totalColumns) {
        case 1: return 'col-12';
        case 2: return 'col-md-6';
        case 3: return 'col-md-4';
        case 4: return 'col-md-6 col-lg-3';
        case 5: return 'col-md-4 col-lg-2'; // Special case for 5 columns
        case 6: return 'col-md-4 col-lg-2';
        default: return 'col-md-6 col-lg-3';
      }
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: auto;
        }

        .bridge-footer {
          background: ${background === 'dark' ? 'var(--bridge-bg-dark, #1a1a1a)' : 'var(--bridge-bg-light, #f8f8f8)'};
          color: ${background === 'dark' ? 'var(--bridge-text-white, #ffffff)' : 'var(--bridge-text-dark, #333333)'};
          ${border ? `border-top: 1px solid ${background === 'dark' ? 'rgba(255,255,255,0.1)' : 'var(--bridge-border-light, #e5e5e5)'};` : ''}
        }

        .footer-top {
          padding: var(--bridge-spacing-xxl, 8rem) 0 var(--bridge-spacing-lg, 3rem);
        }

        .footer-container {
          ${inGrid ? `
            max-width: var(--bridge-container-xl, 1200px);
            margin: 0 auto;
            padding-left: var(--bridge-spacing-md, 2rem);
            padding-right: var(--bridge-spacing-md, 2rem);
          ` : `
            padding-left: var(--bridge-spacing-md, 2rem);
            padding-right: var(--bridge-spacing-md, 2rem);
          `}
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--bridge-spacing-lg, 3rem);
        }

        .footer-column {
          margin-bottom: var(--bridge-spacing-md, 2rem);
        }

        ::slotted([slot^="column-"]) {
          display: block;
        }

        ::slotted([slot^="column-"] h4) {
          color: ${background === 'dark' ? 'var(--bridge-text-white, #ffffff)' : 'var(--bridge-text-dark, #333333)'};
          margin-bottom: var(--bridge-spacing-md, 2rem);
          font-size: 1.125rem;
          font-weight: var(--bridge-font-semibold, 600);
        }

        ::slotted([slot^="column-"] p) {
          color: ${background === 'dark' ? 'var(--bridge-text-muted, #999999)' : 'var(--bridge-text-light, #777777)'};
          line-height: 1.6;
          margin-bottom: var(--bridge-spacing-sm, 1rem);
        }

        ::slotted([slot^="column-"] ul) {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        ::slotted([slot^="column-"] ul li) {
          margin-bottom: var(--bridge-spacing-xs, 0.5rem);
        }

        ::slotted([slot^="column-"] ul li a) {
          color: ${background === 'dark' ? 'var(--bridge-text-muted, #999999)' : 'var(--bridge-text-light, #777777)'};
          text-decoration: none;
          transition: var(--bridge-transition-base, all 0.3s ease);
          display: inline-block;
        }

        ::slotted([slot^="column-"] ul li a:hover) {
          color: var(--bridge-primary, #1abc9c);
          transform: translateX(5px);
        }

        .footer-social {
          display: flex;
          gap: var(--bridge-spacing-sm, 1rem);
          margin-top: var(--bridge-spacing-md, 2rem);
        }

        .footer-social a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: ${background === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          color: ${background === 'dark' ? 'var(--bridge-text-white, #ffffff)' : 'var(--bridge-text-dark, #333333)'};
          border-radius: var(--bridge-radius-full, 50%);
          text-decoration: none;
          transition: var(--bridge-transition-base, all 0.3s ease);
          font-size: 1.1rem;
        }

        .footer-social a:hover {
          background: var(--bridge-primary, #1abc9c);
          color: var(--bridge-text-white, #ffffff);
          transform: translateY(-3px);
        }

        .footer-bottom {
          padding: var(--bridge-spacing-md, 2rem) 0;
          border-top: 1px solid ${background === 'dark' ? 'rgba(255,255,255,0.1)' : 'var(--bridge-border-light, #e5e5e5)'};
          text-align: center;
          color: ${background === 'dark' ? 'var(--bridge-text-muted, #999999)' : 'var(--bridge-text-light, #777777)'};
          font-size: 0.875rem;
        }

        .footer-bottom p {
          margin: 0;
          line-height: 1.6;
        }

        /* Different column layouts */
        .columns-1 .footer-grid {
          grid-template-columns: 1fr;
          text-align: center;
        }

        .columns-2 .footer-grid {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .columns-3 .footer-grid {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .columns-4 .footer-grid {
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        }

        .columns-5 .footer-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .columns-6 .footer-grid {
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .footer-top {
            padding: var(--bridge-spacing-xl, 5rem) 0 var(--bridge-spacing-md, 2rem);
          }

          .footer-container {
            padding-left: var(--bridge-spacing-sm, 1rem);
            padding-right: var(--bridge-spacing-sm, 1rem);
          }

          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: var(--bridge-spacing-md, 2rem);
          }

          .footer-column {
            text-align: center;
          }

          .footer-social {
            justify-content: center;
          }

          .footer-bottom {
            padding: var(--bridge-spacing-sm, 1rem) 0;
          }
        }

        @media (max-width: 480px) {
          .footer-top {
            padding: var(--bridge-spacing-lg, 3rem) 0 var(--bridge-spacing-sm, 1rem);
          }

          ::slotted([slot^="column-"] h4) {
            font-size: 1rem;
            margin-bottom: var(--bridge-spacing-sm, 1rem);
          }

          .footer-social a {
            width: 35px;
            height: 35px;
            font-size: 1rem;
          }
        }

        /* Animation for footer reveal */
        @keyframes footerSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-column {
          animation: footerSlideUp 0.6s ease-out forwards;
        }

        .footer-column:nth-child(1) { animation-delay: 0.1s; }
        .footer-column:nth-child(2) { animation-delay: 0.2s; }
        .footer-column:nth-child(3) { animation-delay: 0.3s; }
        .footer-column:nth-child(4) { animation-delay: 0.4s; }
        .footer-column:nth-child(5) { animation-delay: 0.5s; }
        .footer-column:nth-child(6) { animation-delay: 0.6s; }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .footer-column {
            animation: none;
          }
          
          ::slotted([slot^="column-"] ul li a:hover) {
            transform: none;
          }
          
          .footer-social a:hover {
            transform: none;
          }
        }
      </style>
      
      <footer class="bridge-footer columns-${columns}">
        <div class="footer-top">
          <div class="footer-container">
            <div class="footer-grid">
              ${Array.from({ length: columns }, (_, i) => `
                <div class="footer-column">
                  <slot name="column-${i + 1}"></slot>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        ${copyright ? `
          <div class="footer-bottom">
            <div class="footer-container">
              <p>${copyright}</p>
            </div>
          </div>
        ` : ''}
      </footer>
    `;
  }
}

// Bridge Back to Top Component
class BridgeBackToTop extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isVisible = false;
  }

  connectedCallback() {
    this.render();
    this.setupScrollListener();
    this.setupClickListener();
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  setupScrollListener() {
    this.handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldShow = scrollTop > 300;
      
      if (shouldShow !== this.isVisible) {
        this.isVisible = shouldShow;
        const button = this.shadowRoot.querySelector('.back-to-top');
        if (button) {
          button.classList.toggle('visible', this.isVisible);
        }
      }
    };
    
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  setupClickListener() {
    const button = this.shadowRoot.querySelector('.back-to-top');
    if (button) {
      button.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Dispatch event
        this.dispatchEvent(new CustomEvent('back-to-top-click', {
          bubbles: true
        }));
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: var(--bridge-spacing-md, 2rem);
          right: var(--bridge-spacing-md, 2rem);
          z-index: var(--bridge-z-fixed, 1030);
        }

        .back-to-top {
          width: 50px;
          height: 50px;
          background: var(--bridge-primary, #1abc9c);
          color: var(--bridge-text-white, #ffffff);
          border: none;
          border-radius: var(--bridge-radius-full, 50%);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: var(--bridge-transition-base, all 0.3s ease);
          font-size: 1.2rem;
          box-shadow: var(--bridge-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
        }

        .back-to-top.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .back-to-top:hover {
          background: var(--bridge-secondary, #2c3e50);
          transform: translateY(-3px);
          box-shadow: var(--bridge-shadow-xl, 0 20px 25px rgba(0,0,0,0.15));
        }

        .back-to-top:active {
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          :host {
            bottom: var(--bridge-spacing-sm, 1rem);
            right: var(--bridge-spacing-sm, 1rem);
          }

          .back-to-top {
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
          }
        }

        /* Accessibility */
        .back-to-top:focus {
          outline: 2px solid var(--bridge-primary, #1abc9c);
          outline-offset: 2px;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .back-to-top {
            transition: opacity 0.2s ease;
          }
          
          .back-to-top:hover {
            transform: none;
          }
        }
      </style>
      
      <button class="back-to-top" aria-label="Back to top" title="Back to top">
        <i class="fas fa-chevron-up"></i>
      </button>
    `;
  }
}

// Register components
customElements.define('bridge-footer', BridgeFooter);
customElements.define('bridge-back-to-top', BridgeBackToTop);