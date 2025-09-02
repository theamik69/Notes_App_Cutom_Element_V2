# 📝 Notes App

A modern, elegant, and responsive web application for creating and managing personal notes. Built with vanilla JavaScript, Web Components, and integrated with Dicoding Notes API.

![Notes App](https://img.shields.io/badge/version-1.0.0-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Web Components](https://img.shields.io/badge/Web%20Components-Ready-green.svg)
![Webpack](https://img.shields.io/badge/Webpack-5.0-blue.svg)

## ✨ Features

### Core Features
- **Create Notes**: Add new notes with title and content
- **Delete Notes**: Remove unwanted notes with confirmation dialog
- **Archive/Unarchive**: Organize notes by archiving them
- **View Toggle**: Switch between active and archived notes
- **Real-time Sync**: All data synced with Dicoding Notes API

### UI/UX Features
- **Modern Design**: Beautiful gradients, smooth animations, and glassmorphism effects
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Color Themes**: 6 beautiful color themes for notes (Yellow, Pink, Blue, Green, Purple, Orange)
- **Loading States**: Elegant loading animations during API calls
- **Toast Notifications**: Beautiful SweetAlert2 notifications for user feedback
- **Scroll Animations**: Smooth AOS (Animate on Scroll) effects

### Technical Features
- **Web Components**: Modular architecture using Shadow DOM
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + N`: Open new note modal
  - `Escape`: Close modal
  - `Ctrl/Cmd + Enter`: Save note (when modal is open)
- **API Integration**: Full CRUD operations with REST API
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **No Dependencies**: Core functionality built with vanilla JavaScript

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations, flexbox/grid
- **JavaScript ES6+** - Modern JavaScript features
- **Web Components** - Custom Elements, Shadow DOM

### Build Tools
- **Webpack 5** - Module bundler
- **Babel** - JavaScript transpiler
- **Prettier** - Code formatter

### Libraries
- **AOS (Animate on Scroll)** - Scroll animations
- **SweetAlert2** - Beautiful alert dialogs

### API
- **Dicoding Notes API v2** - Backend service for notes storage

## 📁 Project Structure

```
notes-app/
├── dist/                         # Production build
│   ├── bundle.js                # Bundled JavaScript
│   └── index.html               # Production HTML
├── src/
│   ├── app.js                   # Main application entry
│   ├── public/                  # Static assets
│   │   └── favicon1.png         # App favicon
│   ├── script/
│   │   ├── components/          # Web Components
│   │   │   ├── app-bar.js      # Header component
│   │   │   ├── footer-bar.js   # Footer component
│   │   │   ├── modal-add-note.js # Add note modal
│   │   │   ├── note-card.js    # Note card component
│   │   │   ├── notes-container.js # Notes grid container
│   │   │   └── section-with-title.js # Section wrapper
│   │   ├── data/
│   │   │   ├── local/
│   │   │   │   └── notes-data.js # Sample local data
│   │   │   └── remote/
│   │   │       └── notes-api.js  # API service class
│   │   ├── utils.js             # Utility functions
│   │   └── view/
│   │       └── home.js          # Home view logic
│   └── styles/
│       └── style.css            # Global styles
├── .gitignore                   # Git ignore file
├── .prettierrc                  # Prettier config
├── .prettierignore              # Prettier ignore
├── index.html                   # Development HTML
├── package.json                 # Dependencies & scripts
├── webpack.common.js            # Common webpack config
├── webpack.dev.js               # Development config
└── webpack.prod.js              # Production config
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/notes-app.git
cd notes-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run development server**:
```bash
npm run start-dev
```
The app will open automatically at `http://localhost:8080`

4. **Build for production**:
```bash
npm run build
```

5. **Serve production build**:
```bash
npm start
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start-dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Serve production build locally |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 💡 Usage

### Creating a Note

1. Click the **"+ Add Note"** button or press `Ctrl/Cmd + N`
2. Enter a title (required)
3. Write your note content (required)
4. Click **"Save Note"** or press `Ctrl/Cmd + Enter`

### Managing Notes

- **View Toggle**: Switch between active and archived notes using the toggle buttons
- **Archive Note**: Click the 📦 icon to archive a note
- **Unarchive Note**: Click the 📥 icon to unarchive
- **Delete Note**: Click the 🗑️ icon to delete (with confirmation)

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Open new note modal |
| `Escape` | Close modal |
| `Ctrl/Cmd + Enter` | Save note (in modal) |

## 🔌 API Integration

The app integrates with Dicoding Notes API v2:

### Base URL
```
https://notes-api.dicoding.dev/v2
```

### Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | Get all active notes |
| GET | `/notes/archived` | Get archived notes |
| GET | `/notes/{id}` | Get note by ID |
| POST | `/notes` | Create new note |
| POST | `/notes/{id}/archive` | Archive a note |
| POST | `/notes/{id}/unarchive` | Unarchive a note |
| DELETE | `/notes/{id}` | Delete a note |

## 🎨 Components Documentation

### `<app-bar>`
Header component with app title and add note button.

### `<note-card>`
Individual note card component.

**Properties**:
- `id`: Unique note identifier
- `title`: Note title
- `body`: Note content
- `color`: Theme color
- `createdAt`: Creation timestamp
- `archived`: Archive status

### `<notes-container>`
Responsive grid container for notes.

**Attributes**:
- `gutter`: Space between notes (default: 24px)
- `column`: Number of columns (optional)
- `min-width`: Minimum card width (default: 320px)

### `<modal-add-note>`
Modal dialog for creating new notes with form validation.

### `<section-with-title>`
Section wrapper with title and view toggle functionality.

### `<footer-bar>`
Footer component with copyright and links.

## 🎯 Features in Detail

### Error Handling
- Network error detection
- User-friendly error messages
- Retry mechanisms for failed requests
- Form validation with inline errors

### Performance
- Lazy loading with Web Components
- Optimized bundle with Webpack
- Minimal external dependencies
- Efficient DOM manipulation

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus management in modals

## 🔧 Configuration

### Webpack Configuration

The project uses three webpack configs:
- `webpack.common.js` - Shared configuration
- `webpack.dev.js` - Development with hot reload
- `webpack.prod.js` - Production with optimizations

### Prettier Configuration

Code formatting rules in `.prettierrc`:
```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚧 Roadmap

- [ ] Search functionality
- [ ] Filter by color
- [ ] Sort options (date, title)
- [ ] Categories/Tags
- [ ] Edit note functionality
- [ ] Offline support with Service Worker
- [ ] PWA features
- [ ] Dark mode
- [ ] Export/Import notes
- [ ] Rich text editor
- [ ] Note sharing

## 👥 Author

**Ahmad Mishbah Khumainy**

- GitHub: [@theamik69](https://github.com/theamik69)
- LinkedIn: [Ahmad Mishbah Khumainy](https://www.linkedin.com/in/amik69/)

## 🙏 Acknowledgments

- [Dicoding](https://www.dicoding.com/) for providing the Notes API
- [AOS](https://michalsnik.github.io/aos/) for scroll animations
- [SweetAlert2](https://sweetalert2.github.io/) for beautiful alerts
- Web Components community for inspiration

---

<p align="center">
  Made by Ahmad Mishbah Khumainy
</p>

<p align="center">
  <a href="#top">⬆️ Back to top</a>
</p>