import React from 'react';


function MonthlyStats({ stats = {}}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0">
      <h3 className="text-md font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        월별 통계
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">총 고객</p>
          <p className="text-md font-bold">{stats.totalClients}명</p>
        </div>
        <div className="bg-green-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">상담 완료</p>
          <p className="text-md font-bold">{stats.completedSessions}회</p>
        </div>
        <div className="bg-yellow-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">신규 고객</p>
          <p className="text-md font-bold">{stats.newClients}명</p>
        </div>
        <div className="bg-red-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">재방문율</p>
          <p className="text-md font-bold">{stats.retention}</p>
        </div>
        <div className="bg-purple-50 p-2 rounded-md col-span-2">
          <p className="text-xs text-gray-500">월 수익</p>
          <p className="text-md font-bold">{stats.revenue}</p>
        </div>
      </div>
    </div>
  );
}

export default MonthlyStats;