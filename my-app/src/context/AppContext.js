import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAppointmentsByDate } from '../services/appointmentService';
import { formatDateToString } from '../utils/dateUtils';

// 컨텍스트 생성
const AppContext = createContext();

// 컨텍스트 프로바이더 컴포넌트
export const AppProvider = ({ children }) => {
  // 상담 예약 및 고객 데이터
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [currentClientIndex, setCurrentClientIndex] = useState(0);
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 월별 통계 데이터
  const [stats, setStats] = useState({
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
            time: "09:30", 
            clientName: "김무이", 
            type: "초기상담", 
            status: "예약완료", 
            payment: "결제완료",
            history: "첫 상담 예정",
            notes: ""
          },
          // 기타 더미 데이터
        ];
        
        setAppointments(dummyAppointments);
        setCurrentClientIndex(0);
        setNoteContent(dummyAppointments[0]?.notes || "");
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

  // 고객 선택 함수
  const selectClient = (index) => {
    if (index >= 0 && index < appointments.length) {
      setCurrentClientIndex(index);
      setNoteContent(appointments[index].notes || "");
    }
  };

  // 날짜 선택 함수
  const selectDate = (date) => {
    setSelectedDate(date);
  };

  // 메모 저장 함수
  const saveNote = (content) => {
    if (appointments.length === 0) return;
    
    const updatedAppointments = [...appointments];
    updatedAppointments[currentClientIndex] = {
      ...updatedAppointments[currentClientIndex],
      notes: content
    };
    
    setAppointments(updatedAppointments);
    
    // 실제 API 호출은 여기에 구현
    // saveAppointmentNote(appointments[currentClientIndex].id, content);
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
    noteContent,
    stats,
    loading,
    error,
    setNoteContent,
    selectClient,
    selectDate,
    saveNote,
    getStatusColor,
    getPaymentColor
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