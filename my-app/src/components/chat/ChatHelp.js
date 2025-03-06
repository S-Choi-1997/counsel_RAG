import React from 'react';

function ChatHelp() {
  return (
    <div className="bg-blue-50 p-3 m-4 rounded-md border border-blue-100 text-sm">
      <p className="font-medium mb-1">🔍 AI 비서가 도와드릴 수 있는 일:</p>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>"오후 3시에 김영희님 초기상담 예약해줘"</li>
        <li>"다음 상담 일정 알려줘"</li>
        <li>"박민수님 이전 상담 내용 요약해줘"</li>
        <li>"이 상담 내용 기록하고 스프레드시트에 저장해줘"</li>
        <li>"이번 달 통계 정리해줘"</li>
      </ul>
    </div>
  );
}

export default ChatHelp;