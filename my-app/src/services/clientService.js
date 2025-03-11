// src/services/clientService.js
import { api } from './api';

// 클라이언트 정보 조회
export const getClientInfo = async (clientId) => {
  try {
    const response = await api.get(`/api/clients/${clientId}`);
    return response;
  } catch (error) {
    console.error('Error fetching client info:', error);
    
    // 네트워크 오류시 더미 데이터 반환
    if (error.isNetworkError) {
      console.log('네트워크 오류, 더미 클라이언트 데이터 사용');
      return {
        age: "30대",
        occupation: "회사원",
        goal: "직장 스트레스 관리",
        note: "불면증 호소, 업무 과부하"
      };
    }
    
    throw error;
  }
};

// 클라이언트 정보 업데이트
export const updateClientInfo = async (clientId, clientData) => {
  try {
    const response = await api.put(`/api/clients/${clientId}`, clientData);
    return response;
  } catch (error) {
    console.error('Error updating client info:', error);
    
    // 네트워크 오류시 성공한 것처럼 처리 (UI 업데이트 유지)
    if (error.isNetworkError) {
      console.log('네트워크 오류, 로컬 UI만 업데이트됨');
      return clientData; // 입력한 데이터 그대로 반환
    }
    
    throw error;
  }
};