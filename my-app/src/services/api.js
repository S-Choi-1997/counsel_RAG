const API_BASE_URL = 'http://localhost:8080';

async function request(endpoint, options = {}) {
  // 'token'으로 통일 (App.js와 일치)
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  const config = {
    ...options,
    headers,
    mode: 'cors', // CORS 설정 추가
    credentials: 'include' // 쿠키 포함 (필요한 경우)
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication token expired');
    }
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// named export
export const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint, data, options = {}) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    
  put: (endpoint, data, options = {}) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    
  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};

// default export로도 동시에 내보내기 (선택사항)
export default api;