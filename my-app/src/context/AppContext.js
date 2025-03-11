// src/context/AppContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';
import { getSyncStatus } from '../services/googleService';
import { formatDateToString } from '../utils/dateUtils';
import { 
  createAppointment as apiCreateAppointment,
  deleteAppointment as apiDeleteAppointment
} from '../services/appointmentService';
import { 
  mapAppointmentsFromAPI, 
  mapAppointmentFromAPI,
  mapAppointmentToAPI,
  mapStatisticsFromAPI,
  mapSyncStatusFromAPI 
} from '../utils/dataMappers';
import { 
  getDummyAppointmentsByDate, 
  dummyStats, 
  dummySyncStatus 
} from '../utils/fallbackData';

// 컨텍스트 생성
const AppContext = createContext();

// 컨텍스트 프로바이더 컴포넌트
export const AppProvider = ({ children }) => {
  // 상담 예약 및 고객 데이터
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [currentClientIndex, setCurrentClientIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(navigator.onLine);

  // 동기화 관련 상태
  const [syncState, setSyncState] = useState({
    calendarConnected: false,
    sheetsConnected: false,
    lastCalendarSync: null,
    lastSheetsSync: null,
    isSyncing: false
  });

  // 월별 통계 데이터
  const [stats, setStats] = useState({
    totalClients: 0,
    newClients: 0,
    completedSessions: 0,
    retention: "0%",
    revenue: "0원",
    topTimeSlot: "N/A"
  });

  // 네트워크 연결 상태 모니터링
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

  // 선택된 날짜의 예약 정보 로드 함수
  const fetchAppointmentsByDate = async (date) => {
    setLoading(true);
    try {
      const formattedDate = formatDateToString(date);
      console.log(`Fetching appointments for date: ${formattedDate}`);
      
      const response = await api.get(`/api/appointments?date=${formattedDate}`);
      console.log('API response:', response);
      
      const mappedData = mapAppointmentsFromAPI(response);
      setAppointments(mappedData);
      setCurrentClientIndex(mappedData.length > 0 ? 0 : -1);
      setError(null);
    } catch (err) {
      console.error('예약 정보를 불러오는 중 오류가 발생했습니다.', err);
      setError('예약 정보를 불러오는 중 오류가 발생했습니다.');
      
      // 네트워크 오류인 경우 더미 데이터 사용
      if (err.isNetworkError) {
        console.log('네트워크 오류로 더미 데이터 사용');
        const dummyData = getDummyAppointmentsByDate(date);
        setAppointments(dummyData);
        setCurrentClientIndex(dummyData.length > 0 ? 0 : -1);
      }
    } finally {
      setLoading(false);
    }
  };

  // 페이지 최초 로드 시 예약 정보 로드
  useEffect(() => {
    // 토큰이 있을 때만 API 호출
    const token = localStorage.getItem('token');
    if (token) {
      fetchAppointmentsByDate(selectedDate);
    } else {
      console.log('인증되지 않은 상태: 더미 데이터 사용');
      const dummyData = getDummyAppointmentsByDate(selectedDate);
      setAppointments(dummyData);
      setCurrentClientIndex(dummyData.length > 0 ? 0 : -1);
      setLoading(false);
    }
  }, []); // 의존성 배열에 selectedDate 제거하여 최초 1회만 실행

  // 통계 데이터 로드
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/statistics/monthly');
        const mappedStats = mapStatisticsFromAPI(response);
        setStats(mappedStats);
      } catch (err) {
        console.error('통계 데이터를 불러오는 중 오류가 발생했습니다.', err);
        
        // 네트워크 오류인 경우 더미 데이터 사용
        if (err.isNetworkError) {
          console.log('네트워크 오류로 더미 통계 데이터 사용');
          setStats(dummyStats);
        }
      }
    };
    
    // 토큰이 있을 때만 통계 데이터 가져오기
    const token = localStorage.getItem('token');
    if (token) {
      fetchStats();
    }
  }, []);

  // 동기화 상태 주기적 확인 (5분마다)
  useEffect(() => {
    const checkSyncStatus = async () => {
      try {
        const status = await getSyncStatus();
        const mappedStatus = mapSyncStatusFromAPI(status);
        setSyncState(mappedStatus);
      } catch (err) {
        console.error('Failed to get sync status:', err);
        
        // 네트워크 오류인 경우 더미 데이터 사용
        if (err.isNetworkError) {
          console.log('네트워크 오류로 더미 동기화 상태 사용');
          setSyncState(dummySyncStatus);
        }
      }
    };
    
    // 토큰이 있을 때만 동기화 상태를 확인
    const token = localStorage.getItem('token');
    if (token) {
      // 초기 로드
      checkSyncStatus();
      
      // 5분마다 업데이트
      const interval = setInterval(checkSyncStatus, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // 고객 선택 함수
  const selectClient = (index) => {
    if (index >= 0 && index < appointments.length) {
      setCurrentClientIndex(index);
    }
  };

  // 날짜 선택 함수
  const selectDate = (date) => {
    setSelectedDate(date);
    
    // 토큰이 있을 때만 API 호출
    const token = localStorage.getItem('token');
    if (token) {
      fetchAppointmentsByDate(date);
    } else {
      console.log('인증되지 않은 상태: 더미 데이터 사용');
      const dummyData = getDummyAppointmentsByDate(date);
      setAppointments(dummyData);
      setCurrentClientIndex(dummyData.length > 0 ? 0 : -1);
    }
  };

  // 상담 종류에 따른 색상 및 스타일 지정
  const getSessionTypeStyle = (sessionType) => {
    switch(sessionType) {
      case "카톡상담": return "bg-yellow-100 text-yellow-800";
      case "전화상담": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // 상담 완료 상태 색상
  const getCompletionStatusColor = (isCompleted) => {
    return isCompleted ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };
  
  // 상담 정리 상태 색상
  const getNoteStatusColor = (isNoteCompleted) => {
    return isNoteCompleted ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
  };
  
  // 결제 상태 색상 지정 함수
  const getPaymentStatusColor = (isPaid) => {
    return isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // 예약 상태 업데이트 함수
  const updateAppointment = async (appointmentId, updatedData) => {
    try {
      // 낙관적 UI 업데이트
      setAppointments(prevAppointments => 
        prevAppointments.map(apt => 
          apt.id === appointmentId ? { ...apt, ...updatedData } : apt
        )
      );
      
      // API 호출 (실제 서버 업데이트)
      if (isConnected) {
        // 상태 업데이트인 경우
        if (updatedData.status) {
          await api.put(`/api/appointments/${appointmentId}/status`, { status: updatedData.status });
        }
        // 그 외의 업데이트 (추후 추가)
      }
    } catch (error) {
      console.error('예약 업데이트 실패:', error);
      // 실패 시 원래 상태로 롤백 (필요한 경우)
    }
  };

  // 예약 추가 함수
  const addAppointment = async (newAppointmentData) => {
    try {
      // 낙관적 UI 업데이트 (임시 ID로 추가)
      const tempId = `temp-${Date.now()}`;
      const tempAppointment = { 
        ...newAppointmentData, 
        id: tempId,
        status: 'PENDING' 
      };
      
      setAppointments(prev => [...prev, tempAppointment]);
      setCurrentClientIndex(appointments.length); // 새 고객 선택
      
      // 토큰 확인
      const token = localStorage.getItem('token');
      
      if (token && isConnected) {
        // API 호출을 통한 실제 데이터 저장
        const apiData = mapAppointmentToAPI(newAppointmentData);
        const response = await apiCreateAppointment(apiData);
        const createdAppointment = mapAppointmentFromAPI(response);
        
        // 임시 항목을 실제 항목으로 대체
        setAppointments(prev => prev.map(apt => 
          apt.id === tempId ? createdAppointment : apt
        ));
        
        return createdAppointment;
      }
      
      return tempAppointment; // 오프라인 또는 인증 안 된 상태
    } catch (err) {
      console.error('예약 추가 실패:', err);
      
      // 실패 시 UI에서 제거 (선택적)
      // setAppointments(prev => prev.filter(apt => apt.id !== `temp-${Date.now()}`));
      
      // 오류 발생 시에도 UI 업데이트는 유지 (더 나은 UX)
      return null;
    }
  };

  // 예약 삭제 함수
  const deleteAppointment = async (appointmentId) => {
    // 낙관적 UI 업데이트를 위해 삭제할 예약 정보 저장
    const deletedAppointment = appointments.find(apt => apt.id === appointmentId);
    
    try {
      // UI에서 먼저 제거
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      
      // 현재 선택된 고객이 삭제된 경우 다른 고객 선택
      if (currentClientIndex >= appointments.length - 1) {
        setCurrentClientIndex(Math.max(0, appointments.length - 2));
      }
      
      // 인증 확인 및 API 호출
      const token = localStorage.getItem('token');
      if (token && isConnected && !appointmentId.startsWith('temp-')) {
        await apiDeleteAppointment(appointmentId);
      }
      
      return true;
    } catch (err) {
      console.error('예약 삭제 실패:', err);
      
      // 오류 발생 시 롤백 (선택적)
      if (deletedAppointment) {
        setAppointments(prev => [...prev, deletedAppointment]);
      }
      
      return false;
    }
  };

  const value = {
    currentDate,
    selectedDate,
    appointments,
    currentClientIndex,
    currentClient: appointments[currentClientIndex] || null,
    stats,
    loading,
    error,
    isConnected,
    syncState,
    selectClient,
    selectDate,
    getSessionTypeStyle,
    getCompletionStatusColor,
    getNoteStatusColor,
    getPaymentStatusColor,
    updateAppointment,
    addAppointment,
    deleteAppointment,
    setSyncState,
    fetchAppointmentsByDate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 커스텀 훅
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;