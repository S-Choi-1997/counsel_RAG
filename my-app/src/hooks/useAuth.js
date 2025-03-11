// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 토큰 확인 및 사용자 정보 로드
    const checkAuth = async () => {
      try {
        // URL에서 토큰 추출 (리디렉션에서 왔을 경우)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          localStorage.setItem('token', token);
          // 현재 URL에서 토큰 파라미터 제거
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // 저장된 토큰 가져오기
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
          setLoading(false);
          return;
        }
        
        // 사용자 정보 가져오기
        const response = await fetch('http://localhost:8080/auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
            console.log('인증 오류');
          // 인증 오류 시 토큰 제거
          localStorage.removeItem('token');
          setError('인증이 만료되었습니다.');
        }
      } catch (err) {
        console.error('인증 확인 중 오류:', err);
        setError('인증 확인 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // 구글 로그인 함수
  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, error, loginWithGoogle, logout };
};

export default useAuth;