import {api} from './api';

export const sendMessage = async (content) => {
  try {
    const response = await api.post('/api/chat/send', { content });
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const summarizeNote = async (noteContent, clientName) => {
  try {
    const response = await api.post('/api/chat/summarize', {
      content: noteContent,
      clientName
    });
    return response;
  } catch (error) {
    console.error('Error summarizing note:', error);
    throw error;
  }
};

export const getPreviousSessionSummary = async (clientId) => {
  try {
    const response = await api.get(`/api/chat/sessions/${clientId}/summary`);
    return response;
  } catch (error) {
    console.error('Error fetching previous session summary:', error);
    throw error;
  }
};