import React from 'react';

function ChatMessage({ message }) {
  const isAI = message.sender === 'AI';
  
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
          AI
        </div>
      )}
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          isAI 
            ? 'bg-blue-50 text-gray-800 border border-blue-100' 
            : 'bg-blue-600 text-white'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default ChatMessage;