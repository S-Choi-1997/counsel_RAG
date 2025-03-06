import React from 'react';

function UserHeader({ user, currentDate }) {
  // user가 null이면 기본값 설정
  if (!user) {
    return <div className="p-4 text-center text-gray-500">로그인 정보를 불러오는 중...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          {currentDate?.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
        </h2>
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
  );
}

// 기본값 설정
UserHeader.defaultProps = {
  user: { name: "Guest" },
  currentDate: new Date(),
};

export default UserHeader;
