import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSyncStatus } from '../services/googleService';

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

  // 동기화 관련 상태 추가
  const [syncState, setSyncState] = useState({
    calendarConnected: false,
    sheetsConnected: false,
    lastCalendarSync: null,
    lastSheetsSync: null,
    isSyncing: false
  });

  // 월별 통계 데이터
  const [stats] = useState({
    totalClients: 28,
    newClients: 8,
    completedSessions: 42,
    retention: "78%",
    revenue: "4,850,000원",
    topTimeSlot: "17:00-19:00"
  });

  // 선택된 날짜의 예약 정보 로드
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        // 더미 데이터 사용
        const dummyAppointments = [
          { 
            id: 1, 
            clientId: "client1",
            startTime: "09:30", 
            endTime: "09:50",
            clientName: "김무이", 
            sessionType: "카톡상담", 
            sessionDuration: "20분",
            isCompleted: true, 
            isNoteCompleted: true,
            isPaid: true,
            amount: "25900",
            history: "첫 상담 예정"
          },
          { 
            id: 2, 
            clientId: "client2",
            startTime: "11:00", 
            endTime: "11:30",
            clientName: "이지연", 
            sessionType: "전화상담", 
            sessionDuration: "30분",
            isCompleted: true, 
            isNoteCompleted: false,
            isPaid: true,
            amount: "44900",
            history: "이전 상담: 업무 스트레스 관련 논의"
          },
          { 
            id: 3, 
            clientId: "client3",
            startTime: "14:30", 
            endTime: "14:50",
            clientName: "박준혁", 
            sessionType: "전화상담", 
            sessionDuration: "20분",
            isCompleted: false, 
            isNoteCompleted: false,
            isPaid: false,
            amount: "29900",
            history: "이전 상담: 가족 관계 개선 논의"
          }
        ];
        
        setAppointments(dummyAppointments);
        setCurrentClientIndex(0);
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

  // 동기화 상태 주기적 확인 (5분마다)
  useEffect(() => {
    const checkSyncStatus = async () => {
      try {
        const status = await getSyncStatus();
        setSyncState(status);
      } catch (err) {
        console.error('Failed to get sync status:', err);
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
  }, []);

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
  const updateAppointment = (appointmentId, updatedData) => {
    setAppointments(prevAppointments => 
      prevAppointments.map(apt => 
        apt.id === appointmentId ? { ...apt, ...updatedData } : apt
      )
    );
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