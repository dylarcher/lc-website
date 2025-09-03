class BridgeImageContentSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'layout', 
      'image-position', 
      'vertical-align', 
      'gap', 
      'image-width',
      'content-width',
      'background',
      'padding',
      'rounded',
      'shadow'
    ];
  }

  connectedCallback() {
    this.render();
    this.setupIntersectionObserver();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  get layout() {
    return this.getAttribute('layout') || 'horizontal';
  }

  get imagePosition() {
    return this.getAttribute('image-position') || 'right';
  }

  get verticalAlign() {
    return this.getAttribute('vertical-align') || 'center';
  }

  get gap() {
    return this.getAttribute('gap') || '3rem';
  }

  get imageWidth() {
    return this.getAttribute('image-width') || '50%';
  }

  get contentWidth() {
    return this.getAttribute('content-width') || '50%';
  }

  get background() {
    return this.getAttribute('background') || '';
  }

  get padding() {
    return this.getAttribute('padding') || 'var(--spacing-xl, 5rem) 0';
  }

  get isReversed() {
    return this.imagePosition === 'left';
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px 0px'
      });

      observer.observe(this);
    }
  }

  render() {
    const flexDirection = this.layout === 'vertical' ? 'column' : 
                         (this.isReversed ? 'row-reverse' : 'row');
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          ${this.background ? `background: ${this.background};` : ''}
          ${this.hasAttribute('rounded') ? 'border-radius: var(--border-radius, 12px); overflow: hidden;' : ''}
          ${this.hasAttribute('shadow') ? 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);' : ''}
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: ${this.padding};
          padding-left: max(20px, env(safe-area-inset-left));
          padding-right: max(20px, env(safe-area-inset-right));
        }

        .content-wrapper {
          display: flex;
          flex-direction: ${flexDirection};
          align-items: ${this.verticalAlign === 'top' ? 'flex-start' : 
                        this.verticalAlign === 'bottom' ? 'flex-end' : 'center'};
          gap: ${this.gap};
          width: 100%;
        }

        .image-container {
          flex: 0 0 ${this.layout === 'vertical' ? 'auto' : this.imageWidth};
          width: ${this.layout === 'vertical' ? '100%' : this.imageWidth};
          opacity: 0;
          transform: translateX(${this.isReversed ? '-30px' : '30px'});
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .content-container {
          flex: 0 0 ${this.layout === 'vertical' ? 'auto' : this.contentWidth};
          width: ${this.layout === 'vertical' ? '100%' : this.contentWidth};
          opacity: 0;
          transform: translateX(${this.isReversed ? '30px' : '-30px'});
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
        }

        :host(.animate-in) .image-container,
        :host(.animate-in) .content-container {
          opacity: 1;
          transform: translateX(0);
        }

        .eyebrow {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary-color, #1abc9c);
          margin-bottom: 0.5rem;
          display: block;
        }

        .eyebrow.empty {
          display: none;
        }

        .heading {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          color: var(--text-dark, #333);
          margin: 0 0 1rem 0;
          font-family: var(--font-display, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .heading.empty {
          display: none;
        }

        .subtext {
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--text-light, #777);
          margin: 0 0 1.5rem 0;
          line-height: 1.4;
        }

        .subtext.empty {
          display: none;
        }

        .content {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-dark, #333);
        }

        ::slotted(*) {
          width: 100%;
          height: 100%;
        }

        ::slotted(bridge-picture),
        ::slotted(bridge-figure),
        ::slotted(img) {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Content spacing */
        .content ::slotted(p) {
          margin: 0 0 1rem 0;
        }

        .content ::slotted(p:last-child) {
          margin-bottom: 0;
        }

        /* Responsive design */
        @media (max-width: 968px) {
          .content-wrapper {
            flex-direction: column;
            gap: 2rem;
          }

          .image-container,
          .content-container {
            width: 100%;
            flex: none;
          }

          .image-container {
            order: ${this.imagePosition === 'left' ? '1' : '2'};
          }

          .content-container {
            order: ${this.imagePosition === 'left' ? '2' : '1'};
          }
        }

        @media (max-width: 640px) {
          .container {
            padding: var(--spacing-lg, 3rem) 20px;
          }

          .content-wrapper {
            gap: 1.5rem;
          }

          .heading {
            font-size: 1.75rem;
          }

          .subtext {
            font-size: 1rem;
          }
        }

        /* Background variants */
        :host([background="light"]) {
          background: var(--bg-light, #f8f8f8);
        }

        :host([background="dark"]) {
          background: var(--bg-dark, #1a1a1a);
          color: var(--text-light, #f8f8f8);
        }

        :host([background="dark"]) .heading {
          color: var(--text-light, #f8f8f8);
        }

        :host([background="primary"]) {
          background: var(--primary-color, #1abc9c);
          color: white;
        }

        :host([background="primary"]) .heading {
          color: white;
        }

        :host([background="primary"]) .eyebrow {
          color: rgba(255, 255, 255, 0.8);
        }

        /* Size variants */
        :host([size="compact"]) .container {
          padding: var(--spacing-lg, 3rem) 0;
        }

        :host([size="spacious"]) .container {
          padding: var(--spacing-xxl, 8rem) 0;
        }

        /* Animation variants */
        :host([animation="fade"]) .image-container,
        :host([animation="fade"]) .content-container {
          transform: none;
        }

        :host([animation="slide-up"]) .image-container,
        :host([animation="slide-up"]) .content-container {
          transform: translateY(30px);
        }

        :host([animation="slide-up"].animate-in) .image-container,
        :host([animation="slide-up"].animate-in) .content-container {
          transform: translateY(0);
        }
      </style>

      <div class="container">
        <div class="content-wrapper">
          <div class="image-container">
            <slot name="image"></slot>
          </div>
          
          <div class="content-container">
            <span class="eyebrow ${!this.hasAttribute('eyebrow') && !this.querySelector('[slot="eyebrow"]') ? 'empty' : ''}">
              ${this.getAttribute('eyebrow') || '<slot name="eyebrow"></slot>'}
            </span>
            
            <h2 class="heading ${!this.hasAttribute('heading') && !this.querySelector('[slot="heading"]') ? 'empty' : ''}">
              ${this.getAttribute('heading') || '<slot name="heading"></slot>'}
            </h2>
            
            <p class="subtext ${!this.hasAttribute('subtext') && !this.querySelector('[slot="subtext"]') ? 'empty' : ''}">
              ${this.getAttribute('subtext') || '<slot name="subtext"></slot>'}
            </p>
            
            <div class="content">
              <slot name="content"></slot>
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("bridge-image-content-section", BridgeImageContentSection);