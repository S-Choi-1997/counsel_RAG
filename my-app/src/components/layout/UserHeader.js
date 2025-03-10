import React from 'react';
import SyncStatusIndicator from '../common/SyncStatusIndicator';
import { useAppContext } from '../../context/AppContext';
import { formatDateString } from '../../utils/dateUtils';

function UserHeader({ user, currentDate, appointmentsCount }) {
  const { syncState, currentClient } = useAppContext();
  
  // user가 null이면 기본값 설정
  if (!user) {
    return <div className="p-4 text-center text-gray-500">로그인 정보를 불러오는 중...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-gray-800">
              {formatDateString(currentDate, { year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              총 {appointmentsCount}건
            </span>
          </div>
          <p className="text-sm text-gray-500">현재 시간: {new Date().toLocaleTimeString('ko-KR')}</p>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
            {user?.name?.slice(0, 1) || "?"}
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name || "Guest"}</p>
            <p className="text-xs text-green-600">온라인</p>
          </div>
        </div>
      </div>
      
      {currentClient && (
        <div className="bg-blue-50 p-2 rounded-md mt-2 mb-2 border border-blue-100">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">현재 고객: <span className="text-blue-700">{currentClient.clientName}</span></p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {currentClient.type}
            </span>
          </div>
        </div>
      )}
      
      {/* 동기화 상태 표시 추가 */}
      <div className="mt-1 border-t pt-2 border-gray-100">
        <SyncStatusIndicator syncState={syncState} />
      </div>
    </div>
  );
}

// 기본값 설정
UserHeader.defaultProps = {
  user: { name: "Guest" },
  currentDate: new Date(),
  appointmentsCount: 0
};

export default UserHeader;