import React from 'react';

function NoteEditor({ client = {}, noteContent = "", setNoteContent = () => {}, onSave = () => {} }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-grow">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        상담 메모
      </h3>
      
      <textarea
        className="w-full border rounded-md p-3 max-h-64 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm overflow-y-auto resize-none"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder={`${client?.clientName || "고객"}님 상담 메모를 입력하세요...`}
      ></textarea>
      
      <div className="flex justify-end mt-2 space-x-2">
        <button 
          className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
          onClick={() => setNoteContent("")}
        >
          초기화
        </button>
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          onClick={onSave}
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default NoteEditor;