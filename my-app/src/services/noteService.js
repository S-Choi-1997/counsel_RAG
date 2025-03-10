import { api } from './api';

export const saveNote = async (clientId, date, content) => {
  try {
    const response = await api.post('/api/notes', {
      clientId,
      date,
      content
    });
    return response;
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

export const getNotesByClientId = async (clientId) => {
  try {
    const response = await api.get(`/api/notes/client/${clientId}`);
    return response;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getNoteByClientIdAndDate = async (clientId, date) => {
  try {
    const response = await api.get(`/api/notes/client/${clientId}/date/${date}`);
    return response;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

export const syncNotesToSpreadsheet = async () => {
  try {
    const response = await api.post('/api/notes/sync');
    return response;
  } catch (error) {
    console.error('Error syncing notes to spreadsheet:', error);
    throw error;
  }
};