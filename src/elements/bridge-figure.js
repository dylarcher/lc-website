class BridgeFigure extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'caption', 
      'caption-position', 
      'align', 
      'width', 
      'height',
      'rounded',
      'shadow'
    ];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  get caption() {
    return this.getAttribute('caption') || '';
  }

  get captionPosition() {
    return this.getAttribute('caption-position') || 'bottom';
  }

  get align() {
    return this.getAttribute('align') || 'center';
  }

  get width() {
    return this.getAttribute('width');
  }

  get height() {
    return this.getAttribute('height');
  }

  get hasCaption() {
    return this.caption || this.querySelector('[slot="caption"]');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 100%;
          margin: 0 auto;
        }

        figure {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: ${this.captionPosition === 'top' ? 'column-reverse' : 'column'};
          align-items: ${this.align === 'left' ? 'flex-start' : this.align === 'right' ? 'flex-end' : 'center'};
          ${this.width ? `width: ${this.width};` : ''}
          ${this.height ? `height: ${this.height};` : ''}
        }

        .image-container {
          position: relative;
          width: 100%;
          ${this.hasAttribute('rounded') ? 'border-radius: var(--border-radius, 8px); overflow: hidden;' : ''}
          ${this.hasAttribute('shadow') ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);' : ''}
        }

        ::slotted(*) {
          width: 100%;
          height: 100%;
          display: block;
        }

        figcaption {
          margin: ${this.captionPosition === 'top' ? '0 0 1rem 0' : '1rem 0 0 0'};
          color: var(--text-light, #777);
          font-size: 0.875rem;
          line-height: 1.5;
          text-align: ${this.align};
          font-style: italic;
          max-width: 100%;
        }

        figcaption.empty {
          display: none;
        }

        /* Caption styling variants */
        :host([caption-style="bold"]) figcaption {
          font-weight: 600;
          font-style: normal;
        }

        :host([caption-style="subtle"]) figcaption {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        :host([caption-style="emphasized"]) figcaption {
          font-size: 1rem;
          color: var(--text-dark, #333);
          font-style: normal;
        }

        /* Alignment variants */
        :host([align="left"]) {
          margin: 0 auto 0 0;
        }

        :host([align="right"]) {
          margin: 0 0 0 auto;
        }

        :host([align="center"]) {
          margin: 0 auto;
        }

        /* Size variants */
        :host([size="small"]) {
          max-width: 300px;
        }

        :host([size="medium"]) {
          max-width: 500px;
        }

        :host([size="large"]) {
          max-width: 800px;
        }

        :host([size="full"]) {
          max-width: 100%;
        }

        /* Responsive behavior */
        @media (max-width: 768px) {
          :host([size="large"]),
          :host([size="medium"]) {
            max-width: 100%;
          }

          figcaption {
            text-align: center;
          }
        }

        /* Hover effects */
        :host([hover-lift]) .image-container {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        :host([hover-lift]:hover) .image-container {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.04);
        }

        /* Border support */
        :host([bordered]) .image-container {
          border: 1px solid var(--border-color, #e5e5e5);
        }

        /* Spacing variants */
        :host([spacing="tight"]) figcaption {
          margin: ${this.captionPosition === 'top' ? '0 0 0.5rem 0' : '0.5rem 0 0 0'};
        }

        :host([spacing="loose"]) figcaption {
          margin: ${this.captionPosition === 'top' ? '0 0 2rem 0' : '2rem 0 0 0'};
        }
      </style>

      <figure>
        <div class="image-container">
          <slot name="image"></slot>
          <slot></slot>
        </div>
        <figcaption class="${!this.hasCaption ? 'empty' : ''}">
          ${this.caption ? this.caption : '<slot name="caption"></slot>'}
        </figcaption>
      </figure>
    `;
  }
}

customElements.define("bridge-figure", BridgeFigure);