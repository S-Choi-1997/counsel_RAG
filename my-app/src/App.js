// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// 네트워크 상태 확인
const checkConnection = () => {
  return navigator.onLine;
};

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // 8초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  config => {
    // 'token'으로 통일 (App.js와 일치)
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 네트워크 연결 확인
    if (!checkConnection()) {
      // 오프라인일 경우 요청 취소 (fallback 로직으로 넘어감)
      return Promise.reject(new Error('Network is offline'));
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    // 응답 데이터만 반환
    return response.data;
  },
  error => {
    // 오류 로깅
    console.error('API request error:', error);
    
    // 401 오류 처리 (인증 만료)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication token expired'));
    }
    
    // 네트워크 오류 또는 서버 접속 불가 상태
    if (!error.response || error.code === 'ECONNABORTED') {
      // 전역 이벤트 발생 (앱에서 감지할 수 있음)
      window.dispatchEvent(new CustomEvent('api:offline', { 
        detail: { endpoint: error.config?.url }
      }));
    }
    
    return Promise.reject(error);
  }
);

// API 메서드
export const api = {
  get: async (endpoint, options = {}) => {
    try {
      return await axiosInstance.get(endpoint, options);
    } catch (error) {
      // 네트워크 오류 플래그 추가
      error.isNetworkError = !error.response;
      throw error;
    }
  },
  
  post: async (endpoint, data, options = {}) => {
    try {
      return await axiosInstance.post(endpoint, data, options);
    } catch (error) {
      error.isNetworkError = !error.response;
      throw error;
    }
  },
  
  put: async (endpoint, data, options = {}) => {
    try {
      return await axiosInstance.put(endpoint, data, options);
    } catch (error) {
      error.isNetworkError = !error.response;
      throw error;
    }
  },
  
  delete: async (endpoint, options = {}) => {
    try {
      return await axiosInstance.delete(endpoint, options);
    } catch (error) {
      error.isNetworkError = !error.response;
      throw error;
    }
  },
};

export default api;