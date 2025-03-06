import React from 'react';

function ClientProfile({ client = { clientName: "Unknown", type: "N/A", status: "Unknown", payment: "N/A", time: "N/A", history: "No history available." }, getStatusColor, getPaymentColor }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        현재 고객 정보
      </h3>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              {client.clientName[0]}
            </div>
            <div>
              <h4 className="font-bold text-lg">{client.clientName}</h4>
              <p className="text-sm text-blue-600">{client.type}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-xs px-2 py-1 rounded-full mb-1 ${getStatusColor(client.status)}`}>
              {client.status}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getPaymentColor(client.payment)}`}>
              {client.payment}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-500">예약 시간</p>
            <p className="font-medium">{client.time}</p>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-500">상담 회차</p>
            <p className="font-medium">3회차</p>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-500">최근 상담일</p>
            <p className="font-medium">2025-02-15</p>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-500">누적 결제</p>
            <p className="font-medium">450,000원</p>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded border border-gray-200">
          <p className="text-sm font-medium mb-1">이전 상담 내용:</p>
          <p className="text-sm text-gray-600">{client.history}</p>
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;