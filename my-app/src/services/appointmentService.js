import {api} from './api';
import { formatDateToString } from '../utils/dateUtils';

export const getAppointmentsByDate = async (date) => {
  const formattedDate = formatDateToString(date);
  try {
    const response = await api.get(`/api/appointments?date=${formattedDate}`);
    return response;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/api/appointments', appointmentData);
    return response;
  } catch (error) {
    console.error('Error creating appointment:', error);
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