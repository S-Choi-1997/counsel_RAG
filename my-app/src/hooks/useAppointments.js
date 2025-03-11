// src/hooks/useAppointments.js
import { useState, useEffect } from 'react';
import { getAppointmentsByDate, createAppointment, updateAppointmentStatus } from '../services/appointmentService';
import { getDummyAppointmentsByDate } from '../utils/fallbackData';
import { mapAppointmentsFromAPI, mapAppointmentToAPI } from '../utils/dataMappers';

export const useAppointments = (initialDate = new Date()) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [isConnected, setIsConnected] = useState(navigator.onLine);

  // 네트워크 상태 모니터링
  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('api:offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('api:offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getAppointmentsByDate(selectedDate);
        const mappedData = mapAppointmentsFromAPI(data);
        setAppointments(mappedData);
        
        if (mappedData.length > 0) {
          setCurrentAppointment(mappedData[0]);
        } else {
          setCurrentAppointment(null);
        }
        
        setError(null);
      } catch (err) {
        console.error('예약 정보를 불러오는 중 오류가 발생했습니다.', err);
        setError('예약 정보를 불러오는 중 오류가 발생했습니다.');
        
        // 네트워크 오류시 더미 데이터 사용
        if (err.isNetworkError) {
          console.log('네트워크 오류로 더미 예약 데이터 사용');
          const dummyData = getDummyAppointmentsByDate(selectedDate);
          setAppointments(dummyData);
          
          if (dummyData.length > 0) {
            setCurrentAppointment(dummyData[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  const addAppointment = async (newAppointmentData) => {
    setLoading(true);
    try {
      // 데이터 매핑
      const apiData = mapAppointmentToAPI(newAppointmentData);
      
      // 낙관적 UI 업데이트 (임시 ID로 추가)
      const tempId = `temp-${Date.now()}`;
      const tempAppointment = { ...newAppointmentData, id: tempId };
      setAppointments(prev => [...prev, tempAppointment]);
      
      // 실제 API 호출 (연결 가능한 경우)
      if (isConnected) {
        const createdAppointment = await createAppointment(apiData);
        const mappedAppointment = mapAppointmentsFromAPI([createdAppointment])[0];
        
        // 임시 항목을 실제 항목으로 대체
        setAppointments(prev => prev.map(apt => 
          apt.id === tempId ? mappedAppointment : apt
        ));
        
        return mappedAppointment;
      }
      
      return tempAppointment;
    } catch (err) {
      setError('예약 추가 중 오류가 발생했습니다.');
      console.error(err);
      
      // 실패 시 UI에서 제거
      setAppointments(prev => prev.filter(apt => apt.id !== `temp-${Date.now()}`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    setLoading(true);
    try {
      // 낙관적 UI 업데이트
      setAppointments(prev => prev.map(apt =>
        apt.id === appointmentId 
          ? { ...apt, status: newStatus, isCompleted: newStatus === 'COMPLETED' } 
          : apt
      ));
      
      // 현재 선택된 예약도 업데이트
      if (currentAppointment?.id === appointmentId) {
        setCurrentAppointment(prev => ({
          ...prev,
          status: newStatus,
          isCompleted: newStatus === 'COMPLETED'
        }));
      }
      
      // 실제 API 호출 (연결 가능한 경우)
      if (isConnected) {
        const updatedAppointment = await updateAppointmentStatus(appointmentId, newStatus);
        const mappedAppointment = mapAppointmentsFromAPI([updatedAppointment])[0];
        
        // 업데이트된 데이터로 다시 설정
        setAppointments(prev => prev.map(apt =>
          apt.id === appointmentId ? mappedAppointment : apt
        ));
        
        if (currentAppointment?.id === appointmentId) {
          setCurrentAppointment(mappedAppointment);
        }
        
        return mappedAppointment;
      }
      
      // 오프라인 상태에서는 로컬 업데이트된 객체 반환
      return appointments.find(apt => apt.id === appointmentId);
    } catch (err) {
      setError('예약 상태 업데이트 중 오류가 발생했습니다.');
      console.error(err);
      
      // 에러 발생 시 롤백 (필요한 경우)
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
    isConnected,
    setSelectedDate,
    addAppointment,
    updateStatus,
    selectAppointment
  };
};

export default useAppointments;