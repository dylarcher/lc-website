class BridgeProgress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["value", "max", "label", "show-percentage"];
  }

  connectedCallback() {
    this.render();
    this.setupAnimation();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      if (name === "value") {
        this.updateProgress();
      }
    }
  }

  get value() {
    return parseFloat(this.getAttribute("value")) || 0;
  }

  set value(val) {
    this.setAttribute("value", val.toString());
  }

  get max() {
    return parseFloat(this.getAttribute("max")) || 100;
  }

  get label() {
    return this.getAttribute("label") || "";
  }

  get showPercentage() {
    return this.hasAttribute("show-percentage");
  }

  get percentage() {
    return Math.round((this.value / this.max) * 100);
  }

  setupAnimation() {
    // Animate progress on intersection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateProgress();
            observer.unobserve(this);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(this);
  }

  animateProgress() {
    const progress = this.shadowRoot.querySelector("progress");
    if (!progress) return;

    const finalValue = this.value;
    progress.value = 0;

    let current = 0;
    const increment = finalValue / 60; // 60 frames for 1 second animation

    const animate = () => {
      current += increment;
      if (current >= finalValue) {
        progress.value = finalValue;
        this.updatePercentageDisplay();
      } else {
        progress.value = current;
        this.updatePercentageDisplay();
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  updateProgress() {
    const progress = this.shadowRoot.querySelector("progress");
    if (progress) {
      progress.value = this.value;
      this.updatePercentageDisplay();
    }
  }

  updatePercentageDisplay() {
    const percentageSpan = this.shadowRoot.querySelector(".percentage");
    if (percentageSpan) {
      const currentValue = this.shadowRoot.querySelector("progress").value;
      const currentPercentage = Math.round((currentValue / this.max) * 100);
      percentageSpan.textContent = `${currentPercentage}%`;
    }
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
        margin-bottom: var(--bridge-spacing-lg, 1.25rem);
      }

      .progress-container {
        width: 100%;
      }

      .progress-label {
        margin-bottom: var(--bridge-spacing-sm, 0.5rem);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        font-weight: var(--bridge-font-medium, 500);
        color: var(--bridge-text-dark, #333333);
      }

      .percentage {
        font-size: var(--bridge-font-size-sm, 0.875rem);
        color: var(--bridge-text-light, #777777);
      }

      progress {
        width: 100%;
        height: var(--bridge-spacing-sm, 0.5rem);
        appearance: none;
        -webkit-appearance: none;
        border: none;
        border-radius: var(--bridge-radius-sm, 4px);
        background: var(--bridge-bg-light, #f8f8f8);
        overflow: hidden;
      }

      progress::-webkit-progress-bar {
        background: var(--bridge-bg-light, #f8f8f8);
        border-radius: var(--bridge-radius-sm, 4px);
      }

      progress::-webkit-progress-value {
        background: var(--bridge-primary, #1abc9c);
        border-radius: var(--bridge-radius-sm, 4px);
        transition: width var(--bridge-transition-base, 0.3s ease);
      }

      progress::-moz-progress-bar {
        background: var(--bridge-primary, #1abc9c);
        border-radius: var(--bridge-radius-sm, 4px);
      }

      /* Custom styling for better cross-browser support */
      .progress-wrapper {
        position: relative;
        width: 100%;
        height: var(--bridge-spacing-sm, 0.5rem);
        background: var(--bridge-bg-light, #f8f8f8);
        border-radius: var(--bridge-radius-sm, 4px);
        overflow: hidden;
      }
    `;
  }

  getTemplate() {
    const label = this.label;
    const showPercentage = this.showPercentage;
    const value = this.value;
    const max = this.max;
    const percentage = this.percentage;

    return `
      <div class="progress-container">
        ${
          label || showPercentage
            ? `
          <div class="progress-label">
            <span>${label}</span>
            ${
              showPercentage
                ? `<span class="percentage">${percentage}%</span>`
                : ""
            }
          </div>
        `
            : ""
        }
        <progress value="${value}" max="${max}">${percentage}%</progress>
      </div>
    `;
  }
}

customElements.define("bridge-progress", BridgeProgress);
