// Bridge Contact Form Component
// Complete contact form with validation and submission handling

class BridgeContactForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.formData = {};
    this.isSubmitting = false;
  }

  static get observedAttributes() {
    return ['action', 'method', 'ajax'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(e);
      });
    }

    // Listen for input changes
    this.addEventListener('input', (e) => {
      this.handleInputChange(e);
    });

    this.addEventListener('blur', (e) => {
      this.validateField(e.target);
    });
  }

  handleInputChange(e) {
    const field = e.target;
    if (field.name) {
      this.formData[field.name] = field.value;
      this.clearFieldError(field);
    }
  }

  validateField(field) {
    if (!field.name) return true;

    const errors = [];
    const value = field.value.trim();

    // Required validation
    if (field.hasAttribute('required') && !value) {
      errors.push(`${this.getFieldLabel(field)} is required`);
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push('Please enter a valid email address');
      }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        errors.push('Please enter a valid phone number');
      }
    }

    // Min length validation
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
      errors.push(`${this.getFieldLabel(field)} must be at least ${minLength} characters`);
    }

    // Show/hide errors
    if (errors.length > 0) {
      this.showFieldError(field, errors[0]);
      return false;
    } else {
      this.clearFieldError(field);
      return true;
    }
  }

  getFieldLabel(field) {
    return field.getAttribute('label') || field.name || 'Field';
  }

  showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
    field.classList.add('error');
  }

  clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
    field.classList.remove('error');
  }

  async handleSubmit(e) {
    if (this.isSubmitting) return;

    const formElement = e.target;
    const formData = new FormData(formElement);
    
    // Validate all fields
    const fields = formElement.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showFormMessage('Please correct the errors above', 'error');
      return;
    }

    this.isSubmitting = true;
    this.updateSubmitButton(true);

    try {
      // Dispatch form submit event
      const submitEvent = new CustomEvent('bridge-form-submit', {
        detail: { 
          formData: Object.fromEntries(formData.entries()),
          form: formElement
        },
        bubbles: true,
        cancelable: true
      });
      
      const eventResult = this.dispatchEvent(submitEvent);
      
      // If event was cancelled, don't submit
      if (!eventResult) {
        return;
      }

      // Handle AJAX submission
      if (this.getAttribute('ajax') === 'true') {
        await this.submitAjax(formData);
      } else {
        // Regular form submission
        formElement.submit();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showFormMessage('An error occurred. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
      this.updateSubmitButton(false);
    }
  }

  async submitAjax(formData) {
    const action = this.getAttribute('action') || '/contact';
    const method = this.getAttribute('method') || 'POST';

    try {
      const response = await fetch(action, {
        method: method,
        body: formData
      });

      if (response.ok) {
        this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        this.resetForm();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }

  showFormMessage(message, type = 'info') {
    let messageElement = this.shadowRoot.querySelector('.form-message');
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'form-message';
      const form = this.shadowRoot.querySelector('form');
      form.appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    messageElement.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 5000);
  }

  updateSubmitButton(submitting) {
    const submitButton = this.shadowRoot.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = submitting;
      const originalText = submitButton.dataset.originalText || submitButton.textContent;
      if (!submitButton.dataset.originalText) {
        submitButton.dataset.originalText = originalText;
      }
      submitButton.textContent = submitting ? 'Sending...' : originalText;
    }
  }

  resetForm() {
    const form = this.shadowRoot.querySelector('form');
    if (form) {
      form.reset();
      this.formData = {};
      
      // Clear all errors
      const errorElements = form.querySelectorAll('.field-error');
      errorElements.forEach(el => el.remove());
      
      const errorFields = form.querySelectorAll('.error');
      errorFields.forEach(field => field.classList.remove('error'));
    }
  }

  render() {
    const action = this.getAttribute('action') || '#';
    const method = this.getAttribute('method') || 'POST';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .contact-form {
          background: var(--bridge-bg-white, #ffffff);
          padding: var(--bridge-spacing-lg, 3rem);
          border-radius: var(--bridge-radius-lg, 1rem);
          box-shadow: var(--bridge-shadow-md, 0 4px 6px rgba(0,0,0,0.1));
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: var(--bridge-spacing-md, 2rem);
        }

        ::slotted(bridge-form-row) {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--bridge-spacing-md, 2rem);
        }

        ::slotted(bridge-input) {
          width: 100%;
        }

        .form-actions {
          display: flex;
          gap: var(--bridge-spacing-sm, 1rem);
          justify-content: flex-end;
          margin-top: var(--bridge-spacing-md, 2rem);
        }

        .submit-button {
          background: var(--bridge-primary, #1abc9c);
          color: var(--bridge-text-white, #ffffff);
          border: none;
          padding: var(--bridge-spacing-sm, 1rem) var(--bridge-spacing-lg, 3rem);
          border-radius: var(--bridge-radius-md, 0.5rem);
          font-size: 1rem;
          font-weight: var(--bridge-font-medium, 500);
          cursor: pointer;
          transition: var(--bridge-transition-base, all 0.3s ease);
          outline: none;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--bridge-secondary, #2c3e50);
          transform: translateY(-2px);
          box-shadow: var(--bridge-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button:focus {
          box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.3);
        }

        .form-message {
          padding: var(--bridge-spacing-sm, 1rem);
          border-radius: var(--bridge-radius-md, 0.5rem);
          margin-bottom: var(--bridge-spacing-md, 2rem);
          display: none;
        }

        .form-message.success {
          background: rgba(26, 188, 156, 0.1);
          color: var(--bridge-primary, #1abc9c);
          border: 1px solid rgba(26, 188, 156, 0.3);
        }

        .form-message.error {
          background: rgba(231, 76, 60, 0.1);
          color: var(--bridge-accent, #e74c3c);
          border: 1px solid rgba(231, 76, 60, 0.3);
        }

        .form-message.info {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
          border: 1px solid rgba(52, 152, 219, 0.3);
        }

        /* Field Error Styles */
        ::slotted(.field-error) {
          color: var(--bridge-accent, #e74c3c);
          font-size: 0.875rem;
          margin-top: var(--bridge-spacing-xs, 0.5rem);
        }

        ::slotted(input.error), 
        ::slotted(textarea.error) {
          border-color: var(--bridge-accent, #e74c3c) !important;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .contact-form {
            padding: var(--bridge-spacing-md, 2rem);
          }

          ::slotted(bridge-form-row) {
            grid-template-columns: 1fr;
            gap: var(--bridge-spacing-sm, 1rem);
          }

          .form-actions {
            justify-content: stretch;
          }

          .submit-button {
            width: 100%;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .submit-button {
            transition: background-color 0.2s ease;
          }
          
          .submit-button:hover:not(:disabled) {
            transform: none;
          }
        }
      </style>
      
      <div class="contact-form">
        <form action="${action}" method="${method}" novalidate>
          <div class="form-content">
            <slot></slot>
          </div>
          
          <div class="form-actions">
            <slot name="actions">
              <button type="submit" class="submit-button">
                Send Message
              </button>
            </slot>
          </div>
        </form>
      </div>
    `;
  }
}

// Bridge Form Row Component
class BridgeFormRow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--bridge-spacing-md, 2rem);
          margin-bottom: var(--bridge-spacing-md, 2rem);
        }

        @media (max-width: 768px) {
          :host {
            grid-template-columns: 1fr;
            gap: var(--bridge-spacing-sm, 1rem);
          }
        }
      </style>
      
      <slot></slot>
    `;
  }
}

customElements.define('bridge-contact-form', BridgeContactForm);
customElements.define('bridge-form-row', BridgeFormRow);