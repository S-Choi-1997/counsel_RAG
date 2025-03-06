import React from 'react';
import ChatHeader from './ChatHeader';
import ChatHelp from './ChatHelp';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

function ChatInterface({ messages, input, setInput, handleSendMessage, loading, error }) {
  return (
    <>
      <ChatHeader />
      <ChatHelp />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-2 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <ChatMessages messages={messages} />
      <ChatInput 
        input={input} 
        setInput={setInput} 
        handleSendMessage={handleSendMessage}
        loading={loading}
      />
    </>
  );
}

export default ChatInterface;