import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

function ChatMessages({ messages }) {
  const messagesEndRef = useRef(null);
  
  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;