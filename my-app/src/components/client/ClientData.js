import React from 'react';

function ClientData() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        고객 데이터
      </h3>
      
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">구분</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">정보</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="py-2 px-3 text-xs font-medium text-gray-900 whitespace-nowrap">연령대</td>
              <td className="py-2 px-3 text-xs text-gray-500">30대</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-xs font-medium text-gray-900 whitespace-nowrap">직업</td>
              <td className="py-2 px-3 text-xs text-gray-500">회사원</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-xs font-medium text-gray-900 whitespace-nowrap">상담 목표</td>
              <td className="py-2 px-3 text-xs text-gray-500">직장 스트레스 관리</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-xs font-medium text-gray-900 whitespace-nowrap">특이사항</td>
              <td className="py-2 px-3 text-xs text-gray-500">불면증 호소, 업무 과부하</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientData;