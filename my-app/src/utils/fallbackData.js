// src/utils/fallbackData.js

// API 연결 실패시 사용할 더미 데이터

// 예약 더미 데이터
export const dummyAppointments = [
    { 
      id: "dummy1", 
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
      history: "첫 상담 예정",
      date: new Date().toISOString().split('T')[0]
    },
    { 
      id: "dummy2", 
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
      history: "이전 상담: 업무 스트레스 관련 논의",
      date: new Date().toISOString().split('T')[0]
    },
    { 
      id: "dummy3", 
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
      history: "이전 상담: 가족 관계 개선 논의",
      date: new Date().toISOString().split('T')[0]
    }
  ];
  
  // 날짜에 맞는 예약 반환
  export const getDummyAppointmentsByDate = (date) => {
    const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
    return dummyAppointments.map(apt => ({ ...apt, date: dateStr }));
  };
  
  // 메모 더미 데이터
  export const dummyNotes = {
    "client1": {
      "2023-02-15": "첫 상담. 스트레스 관리에 어려움을 겪고 있음. 수면 장애 호소.",
      "2023-02-22": "두 번째 상담. 명상 기법 연습 시작. 수면에 약간 개선이 있음.",
      "2023-03-01": "세 번째 상담. 직장에서 갈등 상황 발생. 대응 방법 논의."
    },
    "client2": {
      "2023-03-10": "첫 상담. 가족관계 문제로 상담 시작. 의사소통 패턴 분석.",
      "2023-03-17": "두 번째 상담. 배우자와의 갈등 상황 논의. 효과적인 대화법 연습."
    },
    "client3": {
      "2023-03-05": "첫 상담. 학업 스트레스와 진로 불안으로 상담 시작."
    }
  };
  
  // 고객별 메모 날짜 목록
  export const getDummyNoteDates = (clientId) => {
    return dummyNotes[clientId] 
      ? Object.keys(dummyNotes[clientId]).sort((a, b) => b.localeCompare(a))
      : [];
  };
  
  // 특정 날짜의 메모 내용
  export const getDummyNoteContent = (clientId, date) => {
    return dummyNotes[clientId] && dummyNotes[clientId][date]
      ? dummyNotes[clientId][date]
      : '';
  };
  
  // 채팅 더미 메시지
  export const getDummyInitialMessage = () => {
    return { 
      sender: "AI", 
      content: "안녕하세요, 상담 어시스턴트입니다. 무엇을 도와드릴까요?", 
      id: "dummy-init", 
      timestamp: new Date().toISOString() 
    };
  };
  
  // 동기화 상태 더미 데이터
  export const dummySyncStatus = {
    calendarConnected: false,
    sheetsConnected: false,
    lastCalendarSync: null,
    lastSheetsSync: null,
    isSyncing: false
  };
  
  // 통계 더미 데이터
  export const dummyStats = {
    totalClients: 28,
    newClients: 8,
    completedSessions: 42,
    retention: "78%",
    revenue: "4,850,000원",
    topTimeSlot: "17:00-19:00"
  };
  
  // 고객 프로필 더미 데이터
  export const dummyClientProfile = {
    age: "30대",
    occupation: "회사원",
    goal: "직장 스트레스 관리",
    note: "불면증 호소, 업무 과부하"
  };
  
  // 사용자 정보 더미 데이터
  export const dummyUserInfo = {
    id: "dummy-user",
    name: "상담사",
    email: "counselor@example.com"
  };