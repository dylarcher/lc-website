class BridgePricing extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["columns", "gap"];
  }

  connectedCallback() {
    this.render();
    this.setupAnimations();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get columns() {
    return this.getAttribute("columns") || "auto";
  }

  get gap() {
    return this.getAttribute("gap") || "30px";
  }

  setupAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, index * 100);
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe items after render
    setTimeout(() => {
      this.shadowRoot.querySelectorAll("slot").forEach((slot) => {
        const assignedElements = slot.assignedElements();
        assignedElements.forEach((element) => {
          observer.observe(element);
        });
      });
    }, 100);
  }

  render() {
    const styles = this.getStyles();
    const template = this.getTemplate();

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${template}
    `;
  }

  getStyles() {
    return `
      :host {
        display: block;
        width: 100%;
      }

      .pricing-container {
        width: 100%;
      }

      .pricing-table {
        display: grid;
        grid-template-columns: ${
          this.columns === "auto"
            ? "repeat(auto-fit, minmax(300px, 1fr))"
            : `repeat(${this.columns}, 1fr)`
        };
        gap: ${this.gap};
        align-items: start;
      }

      ::slotted(bridge-pricing-card) {
        opacity: 0;
        transform: translateY(20px);
        transition: var(--transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .pricing-table {
          grid-template-columns: 1fr;
          gap: 20px;
        }
      }
    `;
  }

  getTemplate() {
    return `
      <div class="pricing-container">
        <div class="pricing-table">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

class BridgePricingCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
      "title",
      "price",
      "period",
      "currency",
      "featured",
      "badge",
      "variant",
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get title() {
    return this.getAttribute("title") || "";
  }

  get price() {
    return this.getAttribute("price") || "0";
  }

  get period() {
    return this.getAttribute("period") || "month";
  }

  get currency() {
    return this.getAttribute("currency") || "$";
  }

  get featured() {
    return this.hasAttribute("featured");
  }

  get badge() {
    return this.getAttribute("badge") || "POPULAR";
  }

  get variant() {
    return this.getAttribute("variant") || "card";
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (e) => {
      if (e.target.classList.contains("pricing-button")) {
        this.dispatchEvent(
          new CustomEvent("pricing-select", {
            bubbles: true,
            detail: {
              title: this.title,
              price: this.price,
              period: this.period,
              originalEvent: e,
            },
          })
        );
      }
    });
  }

  render() {
    const styles = this.getStyles();
    const template = this.getTemplate();

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${template}
    `;
  }

  getStyles() {
    return `
      :host {
        display: block;
        height: 100%;
      }

      .pricing-card {
        background: #fff;
        border: 1px solid var(--border-color, #e5e5e5);
        border-radius: 8px;
        padding: 40px;
        text-align: center;
        position: relative;
        transition: var(--transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        height: 100%;
        display: flex;
        flex-direction: column;
        font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
      }

      .pricing-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      }

      .pricing-card.featured {
        border-color: var(--primary-color, #1abc9c);
        border-width: 2px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }

      .pricing-card.minimal {
        border: none;
        background: transparent;
        padding: 20px;
      }

      .pricing-card.outlined {
        background: transparent;
        border: 2px solid var(--primary-color, #1abc9c);
      }

      .pricing-card.gradient {
        background: linear-gradient(135deg, var(--primary-color, #1abc9c) 0%, var(--secondary-color, #2c3e50) 100%);
        color: white;
        border: none;
      }

      .pricing-badge {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color, #1abc9c);
        color: #fff;
        padding: 5px 20px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .pricing-title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--text-dark, #333333);
      }

      .pricing-card.gradient .pricing-title {
        color: white;
      }

      .pricing-price {
        font-size: 48px;
        font-weight: 700;
        margin: 20px 0;
        color: var(--text-dark, #333333);
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 5px;
      }

      .pricing-card.gradient .pricing-price {
        color: white;
      }

      .pricing-currency {
        font-size: 24px;
        font-weight: 500;
      }

      .pricing-period {
        font-size: 16px;
        font-weight: 400;
        color: var(--text-light, #777777);
      }

      .pricing-card.gradient .pricing-period {
        color: rgba(255,255,255,0.8);
      }

      .pricing-description {
        margin: 20px 0;
        color: var(--text-light, #777777);
        line-height: 1.5;
      }

      .pricing-card.gradient .pricing-description {
        color: rgba(255,255,255,0.9);
      }

      .pricing-features {
        list-style: none;
        margin: 30px 0;
        flex: 1;
      }

      .pricing-features li {
        padding: 10px 0;
        border-bottom: 1px solid var(--border-color, #e5e5e5);
        color: var(--text-dark, #333333);
        line-height: 1.4;
      }

      .pricing-card.gradient .pricing-features li {
        border-bottom-color: rgba(255,255,255,0.2);
        color: white;
      }

      .pricing-features li:last-child {
        border-bottom: none;
      }

      .pricing-features li.unavailable {
        color: var(--text-light, #777777);
        text-decoration: line-through;
        opacity: 0.5;
      }

      .pricing-features li::before {
        content: '✓';
        color: var(--primary-color, #1abc9c);
        font-weight: bold;
        margin-right: 10px;
      }

      .pricing-card.gradient .pricing-features li::before {
        color: #4fd1c7;
      }

      .pricing-features li.unavailable::before {
        content: '✗';
        color: var(--accent-color, #e74c3c);
      }

      .pricing-button {
        background: var(--primary-color, #1abc9c);
        color: #fff;
        border: 2px solid var(--primary-color, #1abc9c);
        padding: 15px 30px;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        text-decoration: none;
        display: inline-block;
        margin-top: 20px;
      }

      .pricing-button:hover {
        background: transparent;
        color: var(--primary-color, #1abc9c);
      }

      .pricing-card.featured .pricing-button {
        background: var(--primary-color, #1abc9c);
        transform: scale(1.05);
      }

      .pricing-card.gradient .pricing-button {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.5);
        color: white;
      }

      .pricing-card.gradient .pricing-button:hover {
        background: white;
        color: var(--primary-color, #1abc9c);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .pricing-card {
          padding: 30px 20px;
        }

        .pricing-price {
          font-size: 40px;
        }

        .pricing-title {
          font-size: 20px;
        }
      }
    `;
  }

  getTemplate() {
    const title = this.title;
    const price = this.price;
    const period = this.period;
    const currency = this.currency;
    const featured = this.featured;
    const badge = this.badge;
    const variant = this.variant;

    return `
      <div class="pricing-card ${variant} ${featured ? "featured" : ""}">
        ${featured ? `<div class="pricing-badge">${badge}</div>` : ""}

        <h3 class="pricing-title">${title}</h3>

        <div class="pricing-price">
          <span class="pricing-currency">${currency}</span>
          <span>${price}</span>
          <span class="pricing-period">/${period}</span>
        </div>

        <div class="pricing-description">
          <slot name="description"></slot>
        </div>

        <ul class="pricing-features">
          <slot name="features"></slot>
        </ul>

        <slot name="button">
          <button class="pricing-button">Choose Plan</button>
        </slot>
      </div>
    `;
  }
}

customElements.define("bridge-pricing", BridgePricing);
customElements.define("bridge-pricing-card", BridgePricingCard);
