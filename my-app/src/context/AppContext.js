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
        // 실제 API 호출 (개발 중에는 더미 데이터로 대체)
        // const data = await getAppointmentsByDate(selectedDate);
        // setAppointments(data);
        
        // 더미 데이터 사용
        const dummyAppointments = [
          { 
            id: 1, 
            clientId: "client1",
            time: "09:30", 
            clientName: "김무이", 
            type: "초기상담", 
            status: "예약완료", 
            payment: "결제완료",
            history: "첫 상담 예정",
            notes: ""
          },
          { 
            id: 2, 
            clientId: "client2",
            time: "11:00", 
            clientName: "이지연", 
            type: "정기상담", 
            status: "예약완료", 
            payment: "결제완료",
            history: "이전 상담: 업무 스트레스 관련 논의",
            notes: ""
          },
          { 
            id: 3, 
            clientId: "client3",
            time: "14:30", 
            clientName: "박준혁", 
            type: "정기상담", 
            status: "예약완료", 
            payment: "미결제",
            history: "이전 상담: 가족 관계 개선 논의",
            notes: ""
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

  // 상태 색상 지정 함수
  const getStatusColor = (status) => {
    switch(status) {
      case "진행중": return "bg-green-100 text-green-800";
      case "완료": return "bg-gray-100 text-gray-800";
      case "예약완료": return "bg-blue-100 text-blue-800";
      case "취소": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };
  
  // 결제 상태 색상 지정 함수
  const getPaymentColor = (payment) => {
    switch(payment) {
      case "결제완료": return "bg-green-100 text-green-800";
      case "미결제": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
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
    syncState,
    selectClient,
    selectDate,
    getStatusColor,
    getPaymentColor,
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