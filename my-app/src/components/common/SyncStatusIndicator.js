import React from 'react';
import { triggerFullSync } from '../../services/googleService';

function SyncStatusIndicator({ syncState }) {
  const { calendarConnected, sheetsConnected, lastCalendarSync, lastSheetsSync, isSyncing } = syncState || {};
  
  const handleSyncClick = async () => {
    if (isSyncing) return; // 이미 동기화 중이면 무시
    
    try {
      await triggerFullSync();
      // 동기화 상태는 컨텍스트에서 자동으로 업데이트됨
    } catch (error) {
      console.error('동기화 요청 실패:', error);
    }
  };
  
  return (
    <div className="flex items-center text-xs">
      {isSyncing ? (
        <div className="flex items-center text-blue-500">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          동기화 중...
        </div>
      ) : (
        <div className="flex space-x-3">
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-1 ${calendarConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-gray-600">캘린더</span>
            {lastCalendarSync && <span className="ml-1 text-gray-500">({formatSyncTime(lastCalendarSync)})</span>}
          </div>
          
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-1 ${sheetsConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-gray-600">시트</span>
            {lastSheetsSync && <span className="ml-1 text-gray-500">({formatSyncTime(lastSheetsSync)})</span>}
          </div>
          
          <button 
            onClick={handleSyncClick}
            className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            disabled={isSyncing}
          >
            동기화
          </button>
        </div>
      )}
    </div>
  );
}

// 동기화 시간을 상대적으로 표시 (예: "5분 전")
function formatSyncTime(timestamp) {
  if (!timestamp) return '';
  
  const now = new Date();
  const syncTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - syncTime) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  
  return syncTime.toLocaleDateString('ko-KR');
}

export default SyncStatusIndicator;