import React from 'react';

function NoteEditor({ client = {}, selectedNoteDate, noteContent = "", setNoteContent = () => {}, onSave = () => {}, 
                      noteDates = [], onDateSelect = () => {} }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-grow flex flex-col">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        상담 메모
      </h3>
      
      <div className="flex justify-between items-center mb-3">
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
        </div>
        
        {/* 동기화 상태 표시 */}
        <div className="text-xs text-gray-500 flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          저장됨
        </div>
      </div>
      
      <div className="flex-grow flex flex-col">
        <textarea
          className="w-full border rounded-md p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm resize-none min-h-[200px]"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder={`${client?.clientName || "고객"}님 상담 메모를 입력하세요...`}
        ></textarea>
        
        <div className="flex justify-end mt-3 space-x-2">
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
    </div>
  );
}

export default NoteEditor;