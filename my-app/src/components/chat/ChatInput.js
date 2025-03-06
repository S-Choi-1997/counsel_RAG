import React from 'react';

function ChatInput({ input, setInput, handleSendMessage, loading }) {
  return (
    <div className="p-4 bg-gray-100 flex items-center rounded-b-lg">
      <input
        type="text"
        placeholder="AI 비서에게 명령이나 질문을 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleSendMessage(); }}
        className="flex-grow p-3 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        disabled={loading}
      />
      <button 
        onClick={handleSendMessage}
        className={`px-4 py-3 rounded-lg flex items-center ${
          loading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
        }`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            처리 중...
          </span>
        ) : (
          <>
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            전송
          </>
        )}
      </button>
    </div>
  );
}

export default ChatInput;