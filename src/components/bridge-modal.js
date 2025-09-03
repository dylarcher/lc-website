class BridgeModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.previousFocus = null;
  }

  static get observedAttributes() {
    return ["open", "title", "size", "closable"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "open") {
        if (this.isOpen) {
          this.showModal();
        } else {
          this.closeModal();
        }
      } else {
        this.render();
      }
    }
  }

  get isOpen() {
    return this.hasAttribute("open");
  }

  get title() {
    return this.getAttribute("title") || "";
  }

  get size() {
    return this.getAttribute("size") || "medium";
  }

  get closable() {
    return this.getAttribute("closable") !== "false";
  }

  open() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }

  showModal() {
    const dialog = this.shadowRoot.querySelector("dialog");
    if (dialog && !dialog.open) {
      this.previousFocus = document.activeElement;
      dialog.showModal();

      // Focus first focusable element or close button
      const firstFocusable = dialog.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }

      this.dispatchEvent(
        new CustomEvent("modal-open", {
          bubbles: true,
          detail: { modal: this },
        })
      );
    }
  }

  closeModal() {
    const dialog = this.shadowRoot.querySelector("dialog");
    if (dialog && dialog.open) {
      dialog.close();

      // Return focus to the element that opened the modal
      if (this.previousFocus) {
        this.previousFocus.focus();
      }

      this.dispatchEvent(
        new CustomEvent("modal-close", {
          bubbles: true,
          detail: { modal: this },
        })
      );
    }
  }

  setupEventListeners() {
    // Handle dialog events
    this.shadowRoot.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-close") && this.closable) {
        this.close();
      }

      // Close on backdrop click
      if (e.target.tagName === "DIALOG") {
        this.close();
      }
    });

    // Handle keyboard events
    this.shadowRoot.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.closable) {
        e.preventDefault();
        this.close();
      }

      // Trap focus within modal
      if (e.key === "Tab") {
        this.trapFocus(e);
      }
    });

    // Handle dialog close event
    this.shadowRoot.addEventListener("close", () => {
      if (this.isOpen) {
        this.removeAttribute("open");
      }
    });
  }

  trapFocus(e) {
    const dialog = this.shadowRoot.querySelector("dialog");
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
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
        --modal-small: 400px;
        --modal-medium: 600px;
        --modal-large: 800px;
        --modal-xlarge: 1000px;
      }

      dialog {
        border: none;
        border-radius: var(--bridge-radius-lg, 8px);
        box-shadow: var(--bridge-shadow-xl, 0 10px 30px rgba(0,0,0,0.3));
        padding: 0;
        background: var(--bridge-bg-white, white);
        max-height: 90vh;
        overflow: auto;
        animation: modalIn var(--bridge-transition-slow, 0.3s) ease-out;
      }

      dialog.small {
        max-width: var(--modal-small);
        width: 90%;
      }

      dialog.medium {
        max-width: var(--modal-medium);
        width: 90%;
      }

      dialog.large {
        max-width: var(--modal-large);
        width: 90%;
      }

      dialog.xlarge {
        max-width: var(--modal-xlarge);
        width: 95%;
      }

      dialog::backdrop {
        background: rgba(0,0,0,0.8);
        animation: fadeIn 0.3s ease-out;
      }

      .modal-header {
        padding: var(--bridge-spacing-2xl, 2rem) var(--bridge-spacing-3xl, 2.5rem) var(--bridge-spacing-lg, 1.25rem);
        border-bottom: 1px solid var(--bridge-border-light, #e5e5e5);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-title {
        margin: 0;
        font-size: var(--bridge-font-size-2xl, 1.5rem);
        font-weight: var(--bridge-font-semibold, 600);
        color: var(--bridge-text-dark, #333333);
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
      }

      .modal-close {
        background: none;
        border: none;
        font-size: var(--bridge-font-size-2xl, 1.5rem);
        cursor: pointer;
        color: var(--bridge-text-light, #777777);
        transition: var(--bridge-transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        padding: 0;
        width: var(--bridge-spacing-2xl, 2rem);
        height: var(--bridge-spacing-2xl, 2rem);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--bridge-radius-sm, 4px);
      }

      .modal-close:hover {
        color: var(--bridge-text-dark, #333333);
        background: var(--bridge-bg-light, #f8f8f8);
      }

      .modal-close:focus {
        outline: 2px solid var(--bridge-primary, #1abc9c);
        outline-offset: 2px;
      }

      .modal-body {
        padding: var(--bridge-spacing-2xl, 2rem) var(--bridge-spacing-3xl, 2.5rem);
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        line-height: var(--bridge-line-height-base, 1.6);
        color: var(--bridge-text-dark, #333333);
      }

      .modal-footer {
        padding: var(--bridge-spacing-lg, 1.25rem) var(--bridge-spacing-3xl, 2.5rem) var(--bridge-spacing-2xl, 2rem);
        border-top: 1px solid var(--bridge-border-light, #e5e5e5);
        display: flex;
        justify-content: flex-end;
        gap: var(--bridge-spacing-md, 1rem);
      }

      @keyframes modalIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        dialog {
          width: 95% !important;
          max-width: none !important;
          margin: var(--bridge-spacing-lg, 1.25rem);
          max-height: calc(100vh - var(--bridge-spacing-3xl, 2.5rem));
        }

        .modal-header,
        .modal-body,
        .modal-footer {
          padding-left: var(--bridge-spacing-lg, 1.25rem);
          padding-right: var(--bridge-spacing-lg, 1.25rem);
        }
      }
    `;
  }

  getTemplate() {
    const title = this.title;
    const size = this.size;
    const closable = this.closable;

    return `
      <dialog class="${size}">
        ${
          title || closable
            ? `
          <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            ${
              closable
                ? `<button class="modal-close" aria-label="Close modal">&times;</button>`
                : ""
            }
          </div>
        `
            : ""
        }

        <div class="modal-body">
          <slot></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </dialog>
    `;
  }
}

customElements.define("bridge-modal", BridgeModal);
