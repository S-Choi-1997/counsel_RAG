import { useState } from 'react';
import { sendMessage } from '../services/chatService';

export const useChat = () => {
  const [messages, setMessages] = useState([
    { sender: "AI", content: "안녕하세요, 상담 어시스턴트입니다. 무엇을 도와드릴까요?", id: 1, timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;
    
    const userMessage = {
      sender: "USER",
      content: text,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await sendMessage(text);
      
      setMessages(prev => [...prev, {
        sender: "AI",
        content: response.content,
        id: response.id || Date.now() + 1,
        timestamp: response.timestamp || new Date().toISOString()
      }]);
      setError(null);
    } catch (err) {
      setError('메시지 전송 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { sender: "AI", content: "안녕하세요, 상담 어시스턴트입니다. 무엇을 도와드릴까요?", id: 1, timestamp: new Date().toISOString() }
    ]);
  };

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    handleSend,
    clearChat
  };
};

export default useChat;