// Bridge Button Element
// Replaces WordPress button functionality with web components

import { Assets } from '../shared/helpers/asset-helper.js';

class BridgeButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["variant", "disabled", "size", "aria-label", "aria-describedby", "role"];
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

  get variant() {
    return this.getAttribute("variant") || "primary";
  }

  get size() {
    return this.getAttribute("size") || "medium";
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector("button");
    button.addEventListener("click", (e) => {
      if (this.disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      this.dispatchEvent(
        new CustomEvent("bridge-button-click", {
          bubbles: true,
          detail: { originalEvent: e },
        })
      );
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
        display: inline-block;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 2px solid transparent;
        border-radius: var(--bridge-radius-button, var(--bridge-radius-md, 0.5rem));
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        font-weight: var(--bridge-font-medium, 500);
        text-decoration: none;
        cursor: pointer;
        transition: var(--bridge-transition-base, all 0.3s ease);
        background: none;
        outline: none;
      }

      button:focus-visible {
        outline: 2px solid var(--primary-color, #1abc9c);
        outline-offset: 2px;
      }

      /* Sizes */
      button.small {
        padding: var(--bridge-padding-xs, 0.25rem 0.5rem);
        font-size: 0.875rem;
      }

      button.medium {
        padding: var(--bridge-padding-sm, 0.5rem 1rem);
        font-size: 1rem;
      }

      button.large {
        padding: var(--bridge-padding-md, 1rem 1.5rem);
        font-size: 1.125rem;
      }

      /* Variants */
      button.primary {
        background: var(--bridge-primary, var(--primary-color, #1abc9c));
        color: var(--bridge-text-white, #fff);
        border-color: transparent;
      }

      button.primary:hover:not(:disabled) {
        background: transparent;
        border-color: var(--bridge-primary, var(--primary-color, #1abc9c));
        color: var(--bridge-primary, var(--primary-color, #1abc9c));
      }

      button.outline {
        background: transparent;
        border-color: var(--bridge-primary, var(--primary-color, #1abc9c));
        color: var(--bridge-primary, var(--primary-color, #1abc9c));
      }

      button.outline:hover:not(:disabled) {
        background: var(--bridge-primary, var(--primary-color, #1abc9c));
        color: var(--bridge-text-white, #fff);
      }

      button.secondary {
        background: var(--bridge-secondary, var(--secondary-color, #2c3e50));
        color: var(--bridge-text-white, #fff);
        border-color: transparent;
      }

      button.secondary:hover:not(:disabled) {
        background: transparent;
        border-color: var(--secondary-color, #2c3e50);
        color: var(--secondary-color, #2c3e50);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
  }

  getTemplate() {
    const sizeClass = this.size;
    const variantClass = this.variant;
    const disabledAttr = this.disabled ? "disabled" : "";

    return `
      <button class="${variantClass} ${sizeClass}" ${disabledAttr}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("bridge-button", BridgeButton);
