import React from 'react';

function MonthlyCalendar({ currentDate, selectedDate, calendarDays, onDateSelect }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0">
      <h3 className="text-md font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        월간 예약 정보
      </h3>
      
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
              ${day.currentMonth && selectedDate.getDate() === day.day ? 'bg-blue-500 text-white' : ''}
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