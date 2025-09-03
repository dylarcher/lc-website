// Bridge Content Section Component
// Flexible content sections with various layouts

class BridgeContentSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['layout', 'background', 'padding', 'max-width', 'text-align', 'border', 'animation'];
  }

  connectedCallback() {
    this.render();
    this.setupAnimations();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  setupAnimations() {
    const animation = this.getAttribute('animation');
    if (animation && animation !== 'none') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, { threshold: 0.2 });

      observer.observe(this);
    }
  }

  render() {
    const layout = this.getAttribute('layout') || 'default';
    const background = this.getAttribute('background') || 'white';
    const padding = this.getAttribute('padding') || 'default';
    const maxWidth = this.getAttribute('max-width') || '1200px';
    const textAlign = this.getAttribute('text-align') || 'left';
    const border = this.getAttribute('border') || 'none';
    const animation = this.getAttribute('animation') || 'fade-up';

    const backgroundStyles = {
      white: 'var(--bridge-bg-white, #ffffff)',
      light: 'var(--bridge-bg-light, #f8f8f8)',
      dark: 'var(--bridge-bg-dark, #1a1a1a)',
      primary: 'var(--bridge-primary, #1abc9c)',
      secondary: 'var(--bridge-secondary, #2c3e50)',
      transparent: 'transparent'
    };

    const paddingStyles = {
      none: '0',
      small: 'var(--bridge-spacing-lg, 3rem) 0',
      default: 'var(--bridge-spacing-xxl, 8rem) 0',
      large: 'var(--bridge-spacing-xxl, 8rem) 0 calc(var(--bridge-spacing-xxl, 8rem) * 1.5)'
    };

    const borderStyles = {
      none: 'none',
      top: '1px solid var(--bridge-border-light, #e5e5e5)',
      bottom: '1px solid var(--bridge-border-light, #e5e5e5)',
      both: '1px solid var(--bridge-border-light, #e5e5e5)'
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }

        .content-section {
          background: ${backgroundStyles[background] || backgroundStyles.white};
          padding: ${paddingStyles[padding] || paddingStyles.default};
          ${border === 'top' ? `border-top: ${borderStyles.top};` : ''}
          ${border === 'bottom' ? `border-bottom: ${borderStyles.bottom};` : ''}
          ${border === 'both' ? `border-top: ${borderStyles.both}; border-bottom: ${borderStyles.both};` : ''}
          color: ${background === 'dark' ? 'var(--bridge-text-white, #ffffff)' : 'var(--bridge-text-dark, #333333)'};
        }

        .section-container {
          max-width: ${maxWidth};
          margin: 0 auto;
          padding: 0 var(--bridge-spacing-md, 2rem);
        }

        .section-content {
          opacity: 0;
          transform: ${animation === 'fade-up' ? 'translateY(30px)' : 
                     animation === 'fade-left' ? 'translateX(30px)' : 
                     animation === 'fade-right' ? 'translateX(-30px)' : 
                     'none'};
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: ${textAlign};
        }

        :host(.animate-in) .section-content {
          opacity: 1;
          transform: translate(0, 0);
        }

        /* Layout Variations */
        .content-section.two-column .section-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--bridge-spacing-xxl, 8rem);
          align-items: center;
        }

        .content-section.three-column .section-content {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--bridge-spacing-lg, 3rem);
        }

        .content-section.sidebar-left .section-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: var(--bridge-spacing-xxl, 8rem);
          align-items: start;
        }

        .content-section.sidebar-right .section-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--bridge-spacing-xxl, 8rem);
          align-items: start;
        }

        .content-section.centered .section-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        /* Typography Styles */
        ::slotted(h1), ::slotted(h2), ::slotted(h3), ::slotted(h4), ::slotted(h5), ::slotted(h6) {
          color: ${background === 'dark' ? 'var(--bridge-text-white, #ffffff)' : 'var(--bridge-text-dark, #333333)'};
          margin-bottom: var(--bridge-spacing-md, 2rem);
          line-height: 1.3;
        }

        ::slotted(p) {
          color: ${background === 'dark' ? 'rgba(255,255,255,0.9)' : 'var(--bridge-text-light, #777777)'};
          line-height: 1.6;
          margin-bottom: var(--bridge-spacing-sm, 1rem);
        }

        ::slotted(.lead) {
          font-size: 1.25rem;
          font-weight: var(--bridge-font-light, 300);
          color: ${background === 'dark' ? 'rgba(255,255,255,0.8)' : 'var(--bridge-text-light, #777777)'};
          margin-bottom: var(--bridge-spacing-lg, 3rem);
        }

        ::slotted(blockquote) {
          border-left: 4px solid var(--bridge-primary, #1abc9c);
          padding-left: var(--bridge-spacing-md, 2rem);
          margin: var(--bridge-spacing-lg, 3rem) 0;
          font-style: italic;
          font-size: 1.125rem;
        }

        ::slotted(.section-title) {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: var(--bridge-font-bold, 700);
          margin-bottom: var(--bridge-spacing-lg, 3rem);
          text-align: center;
        }

        ::slotted(.section-subtitle) {
          font-size: 1.125rem;
          font-weight: var(--bridge-font-light, 300);
          color: ${background === 'dark' ? 'rgba(255,255,255,0.7)' : 'var(--bridge-text-light, #777777)'};
          margin-bottom: var(--bridge-spacing-xl, 5rem);
          text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .content-section.two-column .section-content,
          .content-section.sidebar-left .section-content,
          .content-section.sidebar-right .section-content {
            grid-template-columns: 1fr;
            gap: var(--bridge-spacing-lg, 3rem);
          }

          .content-section.three-column .section-content {
            grid-template-columns: 1fr;
            gap: var(--bridge-spacing-md, 2rem);
          }
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 0 var(--bridge-spacing-sm, 1rem);
          }

          .content-section {
            padding: var(--bridge-spacing-xl, 5rem) 0;
          }

          ::slotted(.section-title) {
            font-size: clamp(1.75rem, 6vw, 2.5rem);
            margin-bottom: var(--bridge-spacing-md, 2rem);
          }

          ::slotted(.section-subtitle) {
            font-size: 1rem;
            margin-bottom: var(--bridge-spacing-lg, 3rem);
          }
        }

        /* Animation delay for staggered content */
        ::slotted([data-delay]) {
          transition-delay: var(--delay, 0s);
        }

        /* Special content types */
        ::slotted(.stats-grid) {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--bridge-spacing-lg, 3rem);
          margin: var(--bridge-spacing-xl, 5rem) 0;
        }

        ::slotted(.feature-list) {
          display: grid;
          gap: var(--bridge-spacing-md, 2rem);
          margin: var(--bridge-spacing-lg, 3rem) 0;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .section-content {
            transition: opacity 0.3s ease;
            transform: none !important;
          }
        }
      </style>
      
      <section class="content-section ${layout}">
        <div class="section-container">
          <div class="section-content">
            <slot></slot>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('bridge-content-section', BridgeContentSection);