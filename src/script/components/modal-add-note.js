class ModalAddNote extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _isOpen = false;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  connectedCallback() {
    this.render();
    this._attachEventListeners();
    this._setupKeyboardShortcuts();
  }

  disconnectedCallback() {
    this._removeEventListeners();
    this._removeKeyboardShortcuts();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
      }

      :host([open]) {
        display: block;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .modal-content {
        background: white;
        border-radius: 20px;
        padding: 32px;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .modal-header {
        font-size: 24px;
        font-weight: 700;
        color: #2d3436;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .modal-header::before {
        content: '✨';
        font-size: 28px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #636e72;
        margin-bottom: 8px;
      }

      .form-input, 
      .form-textarea {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        transition: all 0.3s ease;
        box-sizing: border-box;
      }

      .form-input:focus, 
      .form-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-textarea {
        min-height: 120px;
        resize: vertical;
      }
      
      /* Modal Buttons */
      .modal-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
      }

      .btn {
        padding: 12px 24px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        font-family: inherit;
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      .btn:active {
        transform: translateY(0);
      }

      .btn-cancel {
        background: #e9ecef;
        color: #636e72;
      }

      .btn-cancel:hover {
        background: #dee2e6;
      }

      .btn-save {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .btn-save:hover {
        background: linear-gradient(135deg, #5a6fe8, #6b42a0);
      }

      .btn-save:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Error State */
      .form-input.error,
      .form-textarea.error {
        border-color: #e74c3c;
      }

      .error-message {
        color: #e74c3c;
        font-size: 12px;
        margin-top: 4px;
        display: none;
      }

      .error-message.show {
        display: block;
      }

      /* Responsive */
      @media (max-width: 480px) {
        .modal-content {
          padding: 24px;
        }

        .modal-header {
          font-size: 20px;
        }

        .modal-buttons {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    `;
  }

  open() {
    this._isOpen = true;
    this.setAttribute('open', '');
    this._focusFirstInput();

    this.dispatchEvent(
      new CustomEvent('modal-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  close() {
    this._isOpen = false;
    this.removeAttribute('open');
    this._resetForm();

    this.dispatchEvent(
      new CustomEvent('modal-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  _focusFirstInput() {
    setTimeout(() => {
      const firstInput = this._shadowRoot.querySelector('#noteTitle');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  _resetForm() {
    const titleInput = this._shadowRoot.querySelector('#noteTitle');
    const contentInput = this._shadowRoot.querySelector('#noteContent');

    if (titleInput) titleInput.value = '';
    if (contentInput) contentInput.value = '';

    this._clearErrors();
  }

  _clearErrors() {
    const inputs = this._shadowRoot.querySelectorAll(
      '.form-input, .form-textarea'
    );
    const errorMessages = this._shadowRoot.querySelectorAll('.error-message');

    inputs.forEach((input) => input.classList.remove('error'));
    errorMessages.forEach((msg) => msg.classList.remove('show'));
  }

  _validateForm() {
    const titleInput = this._shadowRoot.querySelector('#noteTitle');
    const contentInput = this._shadowRoot.querySelector('#noteContent');
    const titleError = this._shadowRoot.querySelector('#titleError');
    const contentError = this._shadowRoot.querySelector('#contentError');

    let isValid = true;

    this._clearErrors();

    if (!titleInput.value.trim()) {
      titleInput.classList.add('error');
      titleError.classList.add('show');
      isValid = false;
    }

    if (!contentInput.value.trim()) {
      contentInput.classList.add('error');
      contentError.classList.add('show');
      isValid = false;
    }

    return isValid;
  }

  _handleSave() {
    if (!this._validateForm()) {
      return;
    }

    const titleInput = this._shadowRoot.querySelector('#noteTitle');
    const contentInput = this._shadowRoot.querySelector('#noteContent');

    const noteData = {
      title: titleInput.value.trim(),
      body: contentInput.value.trim(),
    };

    this.dispatchEvent(
      new CustomEvent('note-save', {
        detail: noteData,
        bubbles: true,
        composed: true,
      })
    );

    this.close();
  }

  _generateId() {
    return (
      'notes-' +
      Math.random().toString(36).substr(2, 9) +
      '-' +
      Date.now().toString(36)
    );
  }

  _attachEventListeners() {
    const overlay = this._shadowRoot.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close();
        }
      });
    }

    const cancelBtn = this._shadowRoot.querySelector('.btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    const saveBtn = this._shadowRoot.querySelector('.btn-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this._handleSave());
    }

    const inputs = this._shadowRoot.querySelectorAll(
      '.form-input, .form-textarea'
    );
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.classList.remove('show');
        }
      });
    });
  }

  _setupKeyboardShortcuts() {
    this._keyboardHandler = (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.close();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && this._isOpen) {
        this._handleSave();
      }
    };

    document.addEventListener('keydown', this._keyboardHandler);
  }

  _removeKeyboardShortcuts() {
    if (this._keyboardHandler) {
      document.removeEventListener('keydown', this._keyboardHandler);
    }
  }

  render() {
    this._updateStyle();

    this._shadowRoot.innerHTML = '';
    this._shadowRoot.appendChild(this._style);

    const template = document.createElement('template');
    template.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">Create New Note</div>
          
          <div class="form-group">
            <label class="form-label" for="noteTitle">Title</label>
            <input 
              type="text" 
              class="form-input" 
              id="noteTitle" 
              placeholder="Enter note title"
              maxlength="100"
            >
            <div class="error-message" id="titleError">Please enter a title</div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="noteContent">Content</label>
            <textarea 
              class="form-textarea" 
              id="noteContent" 
              placeholder="Write your note here..."
              maxlength="1000"
            ></textarea>
            <div class="error-message" id="contentError">Please enter content</div>
          </div>
                    
          <div class="modal-buttons">
            <button class="btn btn-cancel">Cancel</button>
            <button class="btn btn-save">Save Note</button>
          </div>
        </div>
      </div>
    `;

    this._shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('modal-add-note', ModalAddNote);

export default ModalAddNote;
