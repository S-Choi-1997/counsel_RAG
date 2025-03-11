import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LoginSuccess from './LoginSuccess';
import ChatPage from './ChatPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/chat" /> : <LoginPage />} />
        <Route path="/oauth2/redirect" element={<LoginSuccess />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;