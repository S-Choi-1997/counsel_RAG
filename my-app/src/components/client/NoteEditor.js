import React from 'react';

function NoteEditor({ client = {}, selectedNoteDate, noteContent = "", setNoteContent = () => {}, onSave = () => {}, 
                      noteDates = [], onDateSelect = () => {} }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-grow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          상담 메모
        </h3>
        
        {/* 날짜 선택 드롭다운 추가 */}
        <div className="flex items-center">
          <span className="text-sm mr-2">날짜:</span>
          <select 
            className="border rounded-md text-sm px-2 py-1"
            value={selectedNoteDate}
            onChange={(e) => onDateSelect(e.target.value)}
          >
            <option value={new Date().toISOString().split('T')[0]}>오늘</option>
            {noteDates.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
          
          {/* 동기화 상태 표시 (선택 사항) */}
          <div className="ml-2 text-xs text-gray-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            저장됨
          </div>
        </div>
      </div>
      
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