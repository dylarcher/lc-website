class BridgeInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
      "type",
      "placeholder",
      "label",
      "required",
      "disabled",
      "value",
      "error",
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

  get type() {
    return this.getAttribute("type") || "text";
  }

  get placeholder() {
    return this.getAttribute("placeholder") || "";
  }

  get label() {
    return this.getAttribute("label") || "";
  }

  get required() {
    return this.hasAttribute("required");
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  get value() {
    return this.getAttribute("value") || "";
  }

  set value(val) {
    this.setAttribute("value", val);
    const input = this.shadowRoot.querySelector("input, textarea");
    if (input) {
      input.value = val;
    }
  }

  get error() {
    return this.getAttribute("error") || "";
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector("input, textarea");

    input.addEventListener("input", (e) => {
      this.value = e.target.value;
      this.dispatchEvent(
        new CustomEvent("bridge-input", {
          bubbles: true,
          detail: { value: e.target.value, originalEvent: e },
        })
      );
    });

    input.addEventListener("change", (e) => {
      this.dispatchEvent(
        new CustomEvent("bridge-change", {
          bubbles: true,
          detail: { value: e.target.value, originalEvent: e },
        })
      );
    });

    input.addEventListener("focus", (e) => {
      this.dispatchEvent(
        new CustomEvent("bridge-focus", {
          bubbles: true,
          detail: { originalEvent: e },
        })
      );
    });

    input.addEventListener("blur", (e) => {
      this.dispatchEvent(
        new CustomEvent("bridge-blur", {
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
        display: block;
        margin-bottom: var(--bridge-spacing-xl, 1.5rem);
      }

      .form-group {
        position: relative;
      }

      .form-label {
        display: block;
        margin-bottom: var(--bridge-spacing-sm, 0.5rem);
        font-weight: var(--bridge-font-medium, 500);
        color: var(--bridge-text-dark, #333333);
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
      }

      .required::after {
        content: '*';
        color: var(--bridge-accent, #e74c3c);
        margin-left: var(--bridge-spacing-xs, 0.25rem);
      }

      .form-control {
        width: 100%;
        padding: var(--bridge-padding-md, var(--bridge-spacing-sm, 0.75rem) var(--bridge-spacing-md, 1rem));
        border: 1px solid var(--bridge-border-light, #e5e5e5);
        border-radius: var(--bridge-radius-sm, 4px);
        font-size: var(--bridge-font-size-base, 1rem);
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        transition: var(--bridge-transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        background: var(--bridge-bg-white, #fff);
      }

      .form-control:focus {
        outline: none;
        border-color: var(--bridge-primary, #1abc9c);
        box-shadow: var(--bridge-focus-ring, 0 0 0 3px rgba(26, 188, 156, 0.1));
      }

      .form-control:disabled {
        background: var(--bridge-bg-light, #f8f8f8);
        cursor: not-allowed;
        opacity: var(--bridge-opacity-disabled, 0.6);
      }

      .form-control.error {
        border-color: var(--bridge-accent, #e74c3c);
      }

      .form-control.error:focus {
        border-color: var(--bridge-accent, #e74c3c);
        box-shadow: var(--bridge-error-ring, 0 0 0 3px rgba(231, 76, 60, 0.1));
      }

      .error-message {
        display: block;
        margin-top: var(--bridge-spacing-sm, 0.375rem);
        font-size: var(--bridge-font-size-sm, 0.875rem);
        color: var(--bridge-accent, #e74c3c);
      }

      textarea.form-control {
        resize: vertical;
        min-height: var(--bridge-textarea-min-height, 6.25rem);
      }
    `;
  }

  getTemplate() {
    const inputType = this.type;
    const placeholder = this.placeholder;
    const label = this.label;
    const required = this.required;
    const disabled = this.disabled;
    const value = this.value;
    const error = this.error;
    const hasError = error ? "error" : "";

    const inputElement =
      inputType === "textarea"
        ? `<textarea class="form-control ${hasError}" placeholder="${placeholder}" ${
            required ? "required" : ""
          } ${disabled ? "disabled" : ""}>${value}</textarea>`
        : `<input type="${inputType}" class="form-control ${hasError}" placeholder="${placeholder}" value="${value}" ${
            required ? "required" : ""
          } ${disabled ? "disabled" : ""}>`;

    return `
      <div class="form-group">
        ${
          label
            ? `<label class="form-label ${
                required ? "required" : ""
              }">${label}</label>`
            : ""
        }
        ${inputElement}
        ${error ? `<span class="error-message">${error}</span>` : ""}
      </div>
    `;
  }
}

customElements.define("bridge-input", BridgeInput);
