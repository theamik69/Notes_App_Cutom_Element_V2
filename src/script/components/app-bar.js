class AppBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
      }

      :host > div {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;    
      }
      
      .app-title {
        font-size: 28px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 12px;
      }
        
      .logo {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        padding: 0;
        margin: 0;
        line-height: 1;       
        overflow: hidden;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .add-note-btn {
        background: linear-gradient(135deg, #667eea, #8e64b8);
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .add-note-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
      }
      
      .add-note-btn:active {
        transform: translateY(0);
      }

      @media (max-width: 480px) {
        .app-title span {
          display: none;
        }
        
        .add-note-btn span:not(:first-child) {
          display: none;
        }
        
        .add-note-btn {
          padding: 12px;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          justify-content: center;
        }
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
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

  _attachEventListeners() {
    const addNoteBtn = this._shadowRoot.querySelector('.add-note-btn');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', this._handleAddNote.bind(this));
    }
  }

  _removeEventListeners() {
    const addNoteBtn = this._shadowRoot.querySelector('.add-note-btn');
    if (addNoteBtn) {
      addNoteBtn.removeEventListener('click', this._handleAddNote);
    }
  }

  _handleAddNote() {
    let modal = document.querySelector('modal-add-note');

    if (!modal) {
      modal = document.createElement('modal-add-note');
      document.body.appendChild(modal);
    }

    modal.open();

    this.dispatchEvent(
      new CustomEvent('add-note-click', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _setupKeyboardShortcuts() {
    this._keyboardHandler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        this._handleAddNote();
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
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `  
    <div>    
        <div class="app-title">
            <div class="logo">📝</div>
            <span>MY NOTES</span>
        </div>
        <div class="header-actions">
            <button class="add-note-btn" title="Add New Note (Ctrl/Cmd + N)">
                <span>+</span>
                <span>Add Note</span>
            </button>
        </div>
    </div>
    `;
  }
}

customElements.define('app-bar', AppBar);

export default AppBar;
