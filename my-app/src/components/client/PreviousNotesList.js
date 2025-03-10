import React from 'react';

function PreviousNotesList({ noteDates = [], selectedNoteDate, onSelectNote }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        이전 메모 목록
      </h3>
      
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">확인</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {noteDates.length > 0 ? (
              noteDates.map((date) => (
                <tr key={date} className={selectedNoteDate === date ? 'bg-blue-50' : ''}>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span className="text-sm">{date}</span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <button 
                      onClick={() => onSelectNote(date)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        selectedNoteDate === date 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedNoteDate === date ? '보는 중' : '보기'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-4 px-3 text-center text-sm text-gray-500">
                  저장된 메모가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PreviousNotesList;