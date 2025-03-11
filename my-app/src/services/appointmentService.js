// src/services/appointmentService.js
import { api } from './api';
import { formatDateToString } from '../utils/dateUtils';
import { getDummyAppointmentsByDate } from '../utils/fallbackData';

export const getAppointmentsByDate = async (date) => {
  const formattedDate = formatDateToString(date);
  try {
    const response = await api.get(`/api/appointments?date=${formattedDate}`);
    return response;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    
    // 네트워크 오류인 경우 더미 데이터 반환
    if (error.isNetworkError) {
      console.log('Network error, using fallback appointment data');
      return getDummyAppointmentsByDate(date);
    }
    
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/api/appointments', appointmentData);
    return response;
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    // 네트워크 오류인 경우 더미 데이터 반환
    if (error.isNetworkError) {
      console.log('Network error, using dummy data for created appointment');
      return {
        ...appointmentData,
        id: `dummy-${Date.now()}`
      };
    }
    
    throw error;
  }
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await api.put(`/api/appointments/${appointmentId}/status`, { status });
    return response;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

export const getClientAppointments = async (clientId) => {
  try {
    const response = await api.get(`/api/clients/${clientId}/appointments`);
    return response;
  } catch (error) {
    console.error('Error fetching client appointments:', error);
    throw error;
  }
};

// appointmentService.js에 추가
export const getMonthlyAppointments = async (startDate, endDate) => {
  const formattedStartDate = formatDateToString(startDate);
  const formattedEndDate = formatDateToString(endDate);
  
  try {
    const response = await api.get(`/api/appointments/monthly?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
    return response;
  } catch (error) {
    console.error('Error fetching monthly appointments:', error);
    
    // 네트워크 오류인 경우 더미 데이터 반환
    if (error.isNetworkError) {
      console.log('Network error, using fallback monthly appointment data');
      // 날짜 범위에 맞는 더미 데이터 생성 (실제 구현 필요)
      return getDummyAppointmentsByDate(startDate);
    }
    
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    await api.delete(`/api/appointments/${appointmentId}`);
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    
    // 네트워크 오류인 경우에도 UI에서는 삭제된 것처럼 표시
    if (error.isNetworkError) {
      console.log('Network error, but appointment will be removed from UI');
      return true;
    }
    
    throw error;
  }
};