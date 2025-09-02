import Utils from '../utils.js';
import NotesApi from '../data/remote/notes-api.js';

const home = async () => {
  let notesData = [];
  let currentNotes = [];
  let currentViewMode = 'active';

  const colors = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];

  const showLoading = () => {
    const container = document.querySelector('notes-container');
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner">⏳</div>
          <div class="loading-text">Loading notes...</div>
        </div>
      `;
    }
  };

  const loadNotes = async (currentViewMode = 'active') => {
    try {
      console.log('View mode changed to:', currentViewMode);
      showLoading();
      const notes =
        currentViewMode === 'active'
          ? await NotesApi.getNotes()
          : await NotesApi.getArchivedNotes();
      console.log('Notes loaded successfully:', notes);
      return notes;
    } catch (error) {
      console.error('Failed to load notes:', error);
      window.Swal.fire({
        icon: 'error',
        title: 'Failed to Load Notes',
        text: error.message,
        footer: 'Please check your internet connection',
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Try Again',
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });

      return [];
    }
  };

  const showSuccessNotification = (message) => {
    window.Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
    });
  };

  const showErrorNotification = (title, message) => {
    window.Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#e74c3c',
    });
  };

  const renderNotes = (currentViewMode = 'active') => {
    const container = document.querySelector('notes-container');

    if (!container) {
      console.error('Element with id "notes-container" not found in the DOM.');
      return;
    }

    container.setAttribute('gutter', '24');
    Utils.emptyElement(container);

    const filteredNotes =
      currentViewMode === 'archived'
        ? currentNotes.filter((note) => note.archived)
        : currentNotes.filter((note) => !note.archived);

    if (currentNotes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-text">No notes yet</div>
          <div class="empty-state-subtext">Click "Add Note" to create your first note</div>
        </div>
      `;
      AOS.refresh();

      return;
    }

    currentNotes.forEach((note, index) => {
      const noteCard = document.createElement('note-card');

      noteCard.id = note.id;
      noteCard.title = note.title;
      noteCard.body = note.body;
      noteCard.category = note.category || 'PERSONAL';
      noteCard.color = note.color || colors[index % colors.length];
      noteCard.createdAt = note.createdAt;
      noteCard.archived = note.archived;

      container.appendChild(noteCard);
    });

    setTimeout(() => {
      AOS.refresh();
    }, 100);
  };

  const setupEventListeners = () => {
    document.addEventListener('note-save', async (event) => {
      try {
        showLoading();
        const newNote = event.detail;
        const response = await NotesApi.createNote(newNote);

        if (response.status === 'fail') {
          throw new Error(response.message || 'Failed to create note');
        }

        await initializeNotes();
        showSuccessNotification('Note created successfully!');
      } catch (error) {
        console.error('Failed to create note:', error);
        showErrorNotification('Failed to Create Note', error.message);
      }
    });

    document.addEventListener('view-change', async (event) => {
      try {
        showLoading();
        currentViewMode = event.detail.mode;
        await initializeNotes(currentViewMode);
        showSuccessNotification(`Viewing ${currentViewMode} notes 👀`);
      } catch (error) {
        console.error('Failed to create note:', error);
        showErrorNotification('Failed change view', error.message);
      }
    });

    document.addEventListener('note-delete', async (event) => {
      try {
        showLoading();
        const { id, title } = event.detail;

        const result = await window.Swal.fire({
          title: 'Delete Note?',
          text: `Are you sure you want to delete "${title}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#e74c3c',
          cancelButtonColor: '#95a5a6',
          confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
          await NotesApi.deleteNote(id);
          await initializeNotes();
          showSuccessNotification('Note deleted successfully!');
        }
      } catch (error) {
        console.error('Failed to delete note:', error);
        showErrorNotification('Failed to Delete Note', error.message);
      }
    });

    document.addEventListener('note-archive', async (event) => {
      try {
        showLoading();
        const { id, archived } = event.detail;

        if (archived) {
          await NotesApi.unarchiveNote(id);
        } else {
          await NotesApi.archiveNote(id);
        }

        await initializeNotes(currentViewMode);

        const message = archived ? 'Note unarchived!' : 'Note archived!';
        showSuccessNotification(message);
      } catch (error) {
        console.error('Failed to toggle archive:', error);
        const action = archived ? 'unarchive' : 'archive';
        showErrorNotification(`Failed to ${action} note`, error.message);
      }
    });

    document.addEventListener('note-click', (event) => {
      console.log('Note clicked:', event.detail);
    });
  };

  const initializeNotes = async (currentViewMode = 'active') => {
    try {
      notesData = await loadNotes(currentViewMode);

      currentNotes = [...notesData];
      renderNotes(currentViewMode);
    } catch (error) {
      console.error('Error initializing notes:', error);
      showErrorNotification(`Error initializing notes:`, error.message);
    }
  };

  setupEventListeners();
  await initializeNotes();
};

export default home;
