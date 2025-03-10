import { api } from './api';

// 구글 서비스 연동 상태 확인
export const getSyncStatus = async () => {
  try {
    const response = await api.get('/api/google/sync/status');
    return response;
  } catch (error) {
    console.error('Error fetching sync status:', error);
    throw error;
  }
};

// 수동 동기화 요청
export const triggerCalendarSync = async () => {
  try {
    const response = await api.post('/api/google/calendar/sync');
    return response;
  } catch (error) {
    console.error('Error triggering calendar sync:', error);
    throw error;
  }
};

// 스프레드시트 수동 동기화 요청
export const triggerSheetsSync = async () => {
  try {
    const response = await api.post('/api/google/sheets/sync');
    return response;
  } catch (error) {
    console.error('Error triggering sheets sync:', error);
    throw error;
  }
};

// 모든 서비스 동기화
export const triggerFullSync = async () => {
  try {
    const response = await api.post('/api/google/sync/all');
    return response;
  } catch (error) {
    console.error('Error triggering full sync:', error);
    throw error;
  }
};