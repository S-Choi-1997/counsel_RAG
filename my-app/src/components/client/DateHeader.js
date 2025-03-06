import React from 'react';

function DateHeader({ currentDate, appointmentsCount }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">
          {currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          총 {appointmentsCount}건
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1">현재 시간: {new Date().toLocaleTimeString('ko-KR')}</p>
    </div>
  );
}

export default DateHeader;