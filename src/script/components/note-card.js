class NoteCard extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _id = '';
  _title = '';
  _body = '';
  _color = 'yellow';
  _createdAt = new Date().toISOString();
  _archived = false;

  static get observedAttributes() {
    return ['title', 'body', 'category', 'color', 'created-at', 'archived'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  connectedCallback() {
    this.render();
    this._attachEventListeners();
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        animation: fadeIn 0.5s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .note-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        min-height: 220px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        display: grid;
        grid-template-rows: auto auto 1fr auto;
        gap: 0.75rem;
        height: 100%;
      }

      .note-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      }

      /* Color Themes */
      .note-card.yellow { 
        background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
        border: 2px solid #ffd93d;
      }
      
      .note-card.pink { 
        background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
        border: 2px solid #f48fb1;
      }
      
      .note-card.blue { 
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        border: 2px solid #64b5f6;
      }
      
      .note-card.green { 
        background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
        border: 2px solid #81c784;
      }
      
      .note-card.purple { 
        background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
        border: 2px solid #ba68c8;
      }
      
      .note-card.orange { 
        background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
        border: 2px solid #ffb74d;
      }

      .note-category {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #636e72;
        opacity: 0.7;
      }

      .note-title {
        font-size: 18px;
        font-weight: 700;
        color: #2d3436;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .note-content {
        font-size: 14px;
        line-height: 1.6;
        color: #636e72;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }

      .note-footer {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 0.5rem;
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
      }

      .note-time {
        font-size: 12px;
        color: #636e72;
        opacity: 0.7;
        display: flex;
        align-items: center;
        gap: 6px;
      }   
        
      .note-actions {
          display: grid;
          grid-template-columns: repeat(2, auto);
          gap: 0.5rem;
      }

      .note-action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.3s ease;
          opacity: 0.6;
          font-size: clamp(1rem, 1.5vw, 1.125rem);
      }

      .note-action-btn:hover {
          opacity: 1;
          transform: scale(1.2);
      }

      /* Archived state */
      :host([archived="true"]) .note-card {
        opacity: 0.6;
        filter: grayscale(50%);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .note-card {
          padding: 16px;
          min-height: 180px;
        }

        .note-title {
          font-size: 16px;
        }

        .note-content {
          font-size: 13px;
          -webkit-line-clamp: 3;
        }
      }

      /* Focus state for accessibility */
      .note-card:focus {
        outline: 3px solid #667eea;
        outline-offset: 2px;
      }

      /* Loading state */
      :host([loading]) .note-card {
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `;
  }

  set id(value) {
    this._id = value;
    this.setAttribute('data-id', value);
  }

  get id() {
    return this._id;
  }

  set title(value) {
    this._title = value;
    this.render();
  }

  get title() {
    return this._title;
  }

  set body(value) {
    this._body = value;
    this.render();
  }

  get body() {
    return this._body;
  }

  set color(value) {
    const validColors = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
    if (validColors.includes(value)) {
      this._color = value;
      this.render();
    }
  }

  get color() {
    return this._color;
  }

  set createdAt(value) {
    this._createdAt = value;
    this.render();
  }

  get createdAt() {
    return this._createdAt;
  }

  set archived(value) {
    this._archived = value === true || value === 'true';
    this.setAttribute('archived', this._archived);
    this.render();
  }

  get archived() {
    return this._archived;
  }

  _formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const time = date.toLocaleString('en-US', options);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    if (diffDays < 7) {
      return `🕐 ${time}, ${dayName}`;
    } else if (diffDays < 30) {
      return `🕐 ${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    } else {
      return `🕐 ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  }

  _attachEventListeners() {
    this._removeEventListeners();

    const card = this._shadowRoot.querySelector('.note-card');
    const archiveBtn = this._shadowRoot.querySelector('.archive-btn');
    const deleteBtn = this._shadowRoot.querySelector('.delete-btn');

    this._boundCardClick = this._handleCardClick.bind(this);
    this._boundArchiveClick = this._handleArchiveClick.bind(this);
    this._boundDeleteClick = this._handleDeleteClick.bind(this);

    if (card) {
      card.addEventListener('click', this._boundCardClick);
    }

    if (archiveBtn) {
      archiveBtn.addEventListener('click', this._boundArchiveClick);
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', this._boundDeleteClick);
    }
  }

  _removeEventListeners() {
    const card = this._shadowRoot.querySelector('.note-card');
    const archiveBtn = this._shadowRoot.querySelector('.archive-btn');
    const deleteBtn = this._shadowRoot.querySelector('.delete-btn');

    if (card && this._boundCardClick) {
      card.removeEventListener('click', this._boundCardClick);
    }

    if (archiveBtn && this._boundArchiveClick) {
      archiveBtn.removeEventListener('click', this._boundArchiveClick);
    }

    if (deleteBtn && this._boundDeleteClick) {
      deleteBtn.removeEventListener('click', this._boundDeleteClick);
    }
  }

  _handleCardClick(e) {
    if (e.target.closest('.note-action-btn')) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('note-click', {
        detail: {
          id: this._id,
          title: this._title,
          body: this._body,
          color: this._color,
          createdAt: this._createdAt,
          archived: this._archived,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleArchiveClick(e) {
    e.stopPropagation();

    const card = this._shadowRoot.querySelector('.note-card');

    this.dispatchEvent(
      new CustomEvent('note-archive', {
        detail: {
          id: this._id,
          archived: this._archived,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleDeleteClick(e) {
    e.stopPropagation();

    this.dispatchEvent(
      new CustomEvent('note-delete', {
        detail: {
          id: this._id,
          title: this._title,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    this._updateStyle();
    this._removeEventListeners();

    this._shadowRoot.innerHTML = '';
    this._shadowRoot.appendChild(this._style);

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="note-card ${this._color}" tabindex="0">
        <div class="note-title">${this._title}</div>
        <div class="note-content">${this._body.replace(/\n/g, '<br>')}</div>
        <div class="note-footer">
          <div class="note-time">${this._formatDate(this._createdAt)}</div>
           <div class="note-actions">
              <button class="note-action-btn archive-btn" title="${this._archived ? 'Unarchive' : 'Archive'}">
                  ${this._archived ? '📥' : '📦'}
              </button>
              <button class="note-action-btn delete-btn" title="Delete">
                  🗑️
              </button>
          </div>
        </div>
      </div>
    `;

    this._shadowRoot.appendChild(container);
    this._attachEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'title':
        this.title = newValue;
        break;
      case 'body':
        this.body = newValue;
        break;
      case 'color':
        this.color = newValue;
        break;
      case 'created-at':
        this.createdAt = newValue;
        break;
      case 'archived':
        this.archived = newValue;
        break;
    }
  }

  updateNote(data) {
    if (data.title) this.title = data.title;
    if (data.body) this.body = data.body;
    if (data.color) this.color = data.color;
    if (data.createdAt) this.createdAt = data.createdAt;
    if (data.archived !== undefined) this.archived = data.archived;
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      body: this._body,
      color: this._color,
      createdAt: this._createdAt,
      archived: this._archived,
    };
  }
}

customElements.define('note-card', NoteCard);
