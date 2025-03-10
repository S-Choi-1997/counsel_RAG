import React from 'react';

function DateHeader({ appointmentsCount }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">
          일정 관리
        </h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          총 {appointmentsCount}건
        </span>
      </div>
    </div>
  );
}

export default DateHeader;