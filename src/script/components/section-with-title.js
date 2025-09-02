class SectionWithTitle extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _title = 'NEED SECTION TITLE';
  _viewMode = 'active';

  static get observedAttributes() {
    return ['title'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');

    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      
      .title-section {
        font-size: 20px;
        font-weight: 600;
        color: #636e72;
      }

      .view-toggle {
        display: flex;
        gap: 8px;
        background: white;
        padding: 4px;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      
      .toggle-btn {
        padding: 8px 16px;
        border: none;
        background: transparent;
        color: #636e72;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;
      }
      
      .toggle-btn:hover {
        background: #f1f3f5;
      }
      
      .toggle-btn.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }
      
      .toggle-btn.active .notes-count {
        background: rgba(255, 255, 255, 0.3);
      }
      
      @media (max-width: 768px) {
        .section-header {
          flex-direction: column;
          gap: 16px;
          align-items: flex-start;
        }
        
        .view-toggle {
          width: 100%;
          justify-content: center;
        }
      }
    `;
  }

  connectedCallback() {
    this._attachEventListeners();
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  _attachEventListeners() {
    const activeBtn = this._shadowRoot.querySelector('#activeBtn');
    const archivedBtn = this._shadowRoot.querySelector('#archivedBtn');

    if (activeBtn) {
      activeBtn.addEventListener('click', () =>
        this._handleViewChange('active')
      );
    }

    if (archivedBtn) {
      archivedBtn.addEventListener('click', () =>
        this._handleViewChange('archived')
      );
    }
  }

  _removeEventListeners() {
    const activeBtn = this._shadowRoot.querySelector('#activeBtn');
    const archivedBtn = this._shadowRoot.querySelector('#archivedBtn');

    if (activeBtn) {
      activeBtn.removeEventListener('click', this._handleViewChange);
    }

    if (archivedBtn) {
      archivedBtn.removeEventListener('click', this._handleViewChange);
    }
  }

  _handleViewChange(mode) {
    if (this._viewMode === mode) return;

    this._viewMode = mode;
    this._updateButtonStates();

    this.dispatchEvent(
      new CustomEvent('view-change', {
        detail: { mode },
        bubbles: true,
        composed: true,
      })
    );
  }

  _updateButtonStates() {
    const activeBtn = this._shadowRoot.querySelector('#activeBtn');
    const archivedBtn = this._shadowRoot.querySelector('#archivedBtn');

    if (activeBtn && archivedBtn) {
      activeBtn.classList.toggle('active', this._viewMode === 'active');
      archivedBtn.classList.toggle('active', this._viewMode === 'archived');
    }
  }

  updateCounts(activeCount = 0, archivedCount = 0) {
    const activeCountEl = this._shadowRoot.querySelector('#activeCount');
    const archivedCountEl = this._shadowRoot.querySelector('#archivedCount');

    if (activeCountEl) {
      activeCountEl.textContent = activeCount;
    }

    if (archivedCountEl) {
      archivedCountEl.textContent = archivedCount;
    }
  }

  render() {
    this._shadowRoot.innerHTML = '';
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <section id="notes" class="notes-section">
        <div class="section-header">
          <div class="title-section">
            <h2>${this.title}</h2>
          </div>
          <div class="view-toggle">
            <button id="activeBtn" class="toggle-btn active">
              📝 Active
              <span class="notes-count" id="activeCount"></span>
            </button>
            <button id="archivedBtn" class="toggle-btn">
              📦 Archived
              <span class="notes-count" id="archivedCount"></span>
            </button>
          </div>
        </div>
        <div>
          <slot></slot>
        </div>
      </section>
    `;

    this._attachEventListeners();
    this._updateButtonStates();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'title') {
      this._title = newValue;
      const titleElement = this._shadowRoot.querySelector('.title-section h2');
      if (titleElement) {
        titleElement.textContent = newValue;
      }
    }
  }
}

customElements.define('section-with-title', SectionWithTitle);
