// src/hooks/useChat.js
import { useState, useEffect } from 'react';
import { sendMessage } from '../services/chatService';
import { getDummyInitialMessage } from '../utils/fallbackData';
import { mapChatMessageFromAPI, mapChatMessageToAPI } from '../utils/dataMappers';

export const useChat = () => {
  const [messages, setMessages] = useState([
    getDummyInitialMessage()
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(navigator.onLine);

  // 네트워크 상태 모니터링
  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('api:offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('api:offline', handleOffline);
    };
  }, []);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;
    
    // 사용자 메시지 생성
    const userMessage = {
      sender: "USER",
      content: text,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    // UI에 사용자 메시지 추가
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      if (isConnected) {
        // 실제 API 호출
        const apiData = mapChatMessageToAPI({ content: text, sender: "USER" });
        const response = await sendMessage(apiData);
        const botMessage = mapChatMessageFromAPI(response);
        
        setMessages(prev => [...prev, botMessage]);
        setError(null);
      } else {
        // 오프라인 응답 (더미)
        setTimeout(() => {
          const offlineResponse = {
            sender: "AI",
            content: "네트워크 연결이 원활하지 않습니다. 연결이 복구되면 정상적인 응답을 받을 수 있습니다.",
            id: Date.now() + 1,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, offlineResponse]);
        }, 500);
      }
    } catch (err) {
      setError('메시지 전송 중 오류가 발생했습니다.');
      console.error(err);
      
      // 오류 발생 시 사용자에게 알림
      const errorMessage = {
        sender: "AI",
        content: "메시지 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        id: Date.now() + 1,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      getDummyInitialMessage()
    ]);
  };

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    isConnected,
    handleSend,
    clearChat
  };
};

export default useChat;