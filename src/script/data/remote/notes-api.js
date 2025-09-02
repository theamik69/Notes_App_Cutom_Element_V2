const BASE_URL = 'https://notes-api.dicoding.dev/v2';

class NotesApi {
  static async getNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();

      const { data: notes } = responseJson;

      return notes;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  }

  static async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();

      const { data: notes } = responseJson;

      return notes;
    } catch (error) {
      console.error('Error fetching archived notes:', error);
      throw new Error(`Failed to fetch archived notes: ${error.message}`);
    }
  }

  static async getNoteById(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();
      const { data: note } = responseJson;

      return note;
    } catch (error) {
      console.error('Error fetching note by ID:', error);
      throw new Error(`Failed to fetch note: ${error.message}`);
    }
  }

  static async createNote(note) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      };

      const response = await fetch(`${BASE_URL}/notes`, options);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('Error create note:', error);
      throw new Error(`Failed to create note: ${error.message}`);
    }
  }

  static async archiveNote(note_id) {
    try {
      const options = {
        method: 'POST',
      };

      const response = await fetch(
        `${BASE_URL}/notes/${note_id}/archive`,
        options
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('Error archiving note:', error);
      throw new Error(`Failed to archive note: ${error.message}`);
    }
  }

  static async unarchiveNote(note_id) {
    try {
      const options = {
        method: 'POST',
      };

      const response = await fetch(
        `${BASE_URL}/notes/${note_id}/unarchive`,
        options
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('Error archiving note:', error);
      throw new Error(`Failed to archive note: ${error.message}`);
    }
  }

  static async deleteNote(note_id) {
    try {
      const options = {
        method: 'DELETE',
      };

      const response = await fetch(`${BASE_URL}/notes/${note_id}`, options);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error(`Failed to delete note: ${error.message}`);
    }
  }
}

export default NotesApi;
