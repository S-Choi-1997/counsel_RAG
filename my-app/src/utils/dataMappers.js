// src/utils/dataMappers.js

// 백엔드 API 응답을 프론트엔드 형식으로 변환하는 매핑 함수들

// 예약 데이터 매핑
  export const mapAppointmentFromAPI = (apiData) => {
    if (!apiData) return null;
    
    // 백엔드 응답 로깅 추가 - 디버깅 용도
    console.log('Mapping appointment data:', apiData);
    
    // 세션 타입 확인 - 더 상세한 로깅
    const sessionTypeField = apiData.sessionType || apiData.serviceType; 
    console.log('Session type field:', sessionTypeField);
    
    // 응답에 세션 타입이 없는 경우 기본값 제공
    const defaultSessionType = "전화상담";
    
    return {
      id: apiData.id,
      clientId: apiData.clientId,
      clientName: apiData.clientName,
      counselorId: apiData.counselorId,
      counselorName: apiData.counselorName,
      date: apiData.date,
      startTime: apiData.startTime,
      endTime: apiData.endTime,
      // 타입을 더 명시적으로 처리하고 기본값 설정
      sessionType: sessionTypeField || defaultSessionType,
      // 원본 필드도 보존 (UI에서 필요한 경우를 위해)
      serviceType: apiData.serviceType || defaultSessionType,
      sessionDuration: apiData.sessionDuration || "20분",
      status: apiData.status,
      notes: apiData.notes,
      isCompleted: apiData.isCompleted ?? (apiData.status === 'COMPLETED'),
      isNoteCompleted: apiData.isNoteCompleted ?? false,
      isPaid: apiData.isPaid ?? false,
      amount: apiData.amount || '0',
      history: apiData.history || ''
    };
  };
  
  // 예약 데이터 배열 매핑
  export const mapAppointmentsFromAPI = (apiDataArray) => {
    if (!apiDataArray || !Array.isArray(apiDataArray)) return [];
    return apiDataArray.map(item => mapAppointmentFromAPI(item));
  };
  
  // 프론트엔드 예약 데이터를 백엔드 API 요청 형식으로 변환
  export const mapAppointmentToAPI = (formData) => {
    return {
      id: formData.id,
      clientId: formData.clientId,
      clientName: formData.clientName,
      counselorId: formData.counselorId,
      counselorName: formData.counselorName,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      // 백엔드에서는 serviceType 필드명 사용
      serviceType: formData.sessionType,
      status: formData.status || (formData.isCompleted ? 'COMPLETED' : 'PENDING'),
      notes: formData.notes || ''
    };
  };
  
  // 노트 데이터 매핑
  export const mapNoteFromAPI = (apiData) => {
    if (!apiData) return null;
    
    return {
      id: apiData.id,
      clientId: apiData.clientId,
      counselorId: apiData.counselorId,
      date: apiData.date,
      content: apiData.content || '',
      summary: apiData.summary || '',
      // 선택적 필드들
      tags: apiData.tags || [],
      actionItems: apiData.actionItems || []
    };
  };
  
  // 노트 데이터를 백엔드 API 요청 형식으로 변환
  export const mapNoteToAPI = (formData) => {
    return {
      id: formData.id,
      clientId: formData.clientId,
      counselorId: formData.counselorId,
      date: formData.date,
      content: formData.content,
      summary: formData.summary || '',
      tags: formData.tags || [],
      actionItems: formData.actionItems || []
    };
  };
  
  // 채팅 메시지 매핑
  export const mapChatMessageFromAPI = (apiData) => {
    if (!apiData) return null;
    
    return {
      id: apiData.id,
      content: apiData.content,
      sender: apiData.sender,
      timestamp: apiData.timestamp || new Date().toISOString()
    };
  };
  
  // 채팅 메시지를 백엔드 API 요청 형식으로 변환
  export const mapChatMessageToAPI = (messageData) => {
    return {
      content: messageData.content,
      sender: messageData.sender
    };
  };
  
  // 동기화 상태 매핑
  export const mapSyncStatusFromAPI = (apiData) => {
    if (!apiData) return null;
    
    return {
      calendarConnected: apiData.calendarConnected || false,
      sheetsConnected: apiData.sheetsConnected || false,
      lastCalendarSync: apiData.lastCalendarSync,
      lastSheetsSync: apiData.lastSheetsSync,
      isSyncing: apiData.isSyncing || false
    };
  };
  
  // 통계 데이터 매핑
  export const mapStatisticsFromAPI = (apiData) => {
    if (!apiData) return null;
    
    return {
      totalClients: apiData.totalClients || 0,
      newClients: apiData.newClients || 0,
      completedSessions: apiData.completedSessions || 0,
      retention: apiData.retention || '0%',
      revenue: apiData.revenue || '0원',
      // 백엔드에서 topTimeSlot이 없을 경우, timeSlotDistribution에서 계산
      topTimeSlot: apiData.topTimeSlot || calculateTopTimeSlot(apiData.timeSlotDistribution)
    };
  };
  
  // 가장 많은 예약이 있는 시간대 계산
  const calculateTopTimeSlot = (timeSlotDistribution) => {
    if (!timeSlotDistribution || Object.keys(timeSlotDistribution).length === 0) {
      return 'N/A';
    }
    
    let maxSlot = '';
    let maxCount = 0;
    
    Object.entries(timeSlotDistribution).forEach(([slot, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxSlot = slot;
      }
    });
    
    return maxSlot;
  };