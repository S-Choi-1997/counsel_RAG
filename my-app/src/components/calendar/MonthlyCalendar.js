import React from 'react';

function MonthlyCalendar({ currentDate, selectedDate, calendarDays, onDateSelect, goToPreviousMonth, goToNextMonth }) {
  // 현재 월 표시 (예: 2025년 3월)
  const monthYear = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {monthYear}
        </h3>
        
        <div className="flex space-x-1">
          <button 
            onClick={goToPreviousMonth} 
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="이전 월"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={goToNextMonth} 
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="다음 월"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-1 text-center">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div 
            key={index}
            onClick={() => onDateSelect(day)}
            className={`
              text-center py-1.5 text-sm rounded-md cursor-pointer
              ${day.currentMonth ? '' : 'text-gray-400'}
              ${day.currentMonth && day.hasAppointment ? 'bg-blue-100' : ''}
              ${day.currentMonth && selectedDate.getDate() === day.day && 
                selectedDate.getMonth() === currentDate.getMonth() ? 'bg-blue-500 text-white' : ''}
              ${day.currentMonth && !day.hasAppointment ? 'hover:bg-gray-100' : ''}
            `}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthlyCalendar;