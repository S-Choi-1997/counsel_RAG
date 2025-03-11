// src/context/AppContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';
import { getSyncStatus } from '../services/googleService';
import { formatDateToString } from '../utils/dateUtils';
import { 
  mapAppointmentsFromAPI, 
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

  // 선택된 날짜의 예약 정보 로드
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const formattedDate = formatDateToString(selectedDate);
        const response = await api.get(`/api/appointments?date=${formattedDate}`);
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
          const dummyData = getDummyAppointmentsByDate(selectedDate);
          setAppointments(dummyData);
          setCurrentClientIndex(dummyData.length > 0 ? 0 : -1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

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
    setSyncState
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