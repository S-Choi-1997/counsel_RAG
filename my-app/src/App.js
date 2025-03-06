import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LoginPage from './LoginPage';
import ChatPage from './ChatPage';
import LoginSuccess from "./LoginSuccess";
import { useAuth } from './hooks/useAuth';

function OAuth2RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔗 현재 URL:", window.location.href);  // 👉 현재 URL 로그
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log("✅ 토큰 발견:", token);  // 👉 토큰이 정상적으로 넘어오는지 확인
      localStorage.setItem('token', token);
      navigate('/login-success');
    }
  }, [location]);

  return <div>🔄 로그인 중...</div>;
}

function App() {
  //const [user, setUser] = useState(null);
  const { user, loading } = useAuth();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     fetch('http://localhost:8080/auth/me', {
  //       method: "GET",
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //         "Content-Type": "application/json"
  //       },
  //       mode: "cors"  // 🔥 추가!
  //     })
  //       .then((res) => res.json())
  //       .then((data) => setUser(data))
  //       .catch(() => localStorage.removeItem('token'));
  //   }
  // }, []);

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/chat" 
            element={user ? <ChatPage user={user} /> : <Navigate to="/login" replace />} 
          />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
