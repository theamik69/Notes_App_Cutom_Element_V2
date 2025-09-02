import Utils from '../utils.js';

class NotesContainer extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _column = null;
  _gutter = 24;
  _minWidth = 320;

  static get observedAttributes() {
    return ['column', 'gutter', 'min-width'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');

    this.render();
  }

  _updateStyle() {
    const gridColumns = this._column
      ? `repeat(${this._column}, 1fr)`
      : `repeat(auto-fill, minmax(${this._minWidth}px, 1fr))`;

    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
      }    

      .list {
        display: grid;
        grid-template-columns: ${gridColumns};
        gap: ${this._gutter}px;
        animation: fadeIn 0.5s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .list {
          grid-template-columns: 1fr;
        }
      }

      @media (min-width: 769px) and (max-width: 1024px) {
        .list {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }
    `;
  }

  set column(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue) && value !== null) return;

    this._column = value === null ? null : newValue;
    this._updateStyle();
  }

  get column() {
    return this._column;
  }

  set gutter(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue)) return;

    this._gutter = newValue;
    this._updateStyle();
  }

  get gutter() {
    return this._gutter;
  }

  set minWidth(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue)) return;

    this._minWidth = newValue;
    this._updateStyle();
  }

  get minWidth() {
    return this._minWidth;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);

    const container = document.createElement('div');
    container.className = 'list';
    container.innerHTML = '<slot></slot>';

    this._shadowRoot.appendChild(container);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'column':
        this.column = newValue === 'auto' ? null : newValue;
        break;
      case 'gutter':
        this.gutter = newValue;
        break;
      case 'min-width':
        this.minWidth = newValue;
        break;
    }

    if (this._shadowRoot.querySelector('.list')) {
      this._updateStyle();
    }
  }
}

customElements.define('notes-container', NotesContainer);

export default NotesContainer;
