import { useState, useEffect } from 'react';
import { getAppointmentsByDate, createAppointment, updateAppointmentStatus } from '../services/appointmentService';

export const useAppointments = (initialDate = new Date()) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getAppointmentsByDate(selectedDate);
        setAppointments(data);
        if (data.length > 0) {
          setCurrentAppointment(data[0]);
        } else {
          setCurrentAppointment(null);
        }
        setError(null);
      } catch (err) {
        setError('예약 정보를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  const addAppointment = async (newAppointmentData) => {
    setLoading(true);
    try {
      const createdAppointment = await createAppointment(newAppointmentData);
      setAppointments(prev => [...prev, createdAppointment]);
      return createdAppointment;
    } catch (err) {
      setError('예약 추가 중 오류가 발생했습니다.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    setLoading(true);
    try {
      const updatedAppointment = await updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(prev => prev.map(apt =>
        apt.id === appointmentId ? updatedAppointment : apt
      ));
      if (currentAppointment?.id === appointmentId) {
        setCurrentAppointment(updatedAppointment);
      }
      return updatedAppointment;
    } catch (err) {
      setError('예약 상태 업데이트 중 오류가 발생했습니다.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectAppointment = (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setCurrentAppointment(appointment);
    }
  };

  return {
    appointments,
    currentAppointment,
    selectedDate,
    loading,
    error,
    setSelectedDate,
    addAppointment,
    updateStatus,
    selectAppointment
  };
};

export default useAppointments;