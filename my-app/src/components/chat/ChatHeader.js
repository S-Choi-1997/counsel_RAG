import React from 'react';

function ChatHeader() {
  return (
    <div className="bg-blue-600 text-white p-4 font-bold flex items-center rounded-t-lg">
      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      AI 비서 어시스턴트
    </div>
  );
}

export default ChatHeader;