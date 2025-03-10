import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

function ClientProfile({ client }) {
  const [amount, setAmount] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isNoteCompleted, setIsNoteCompleted] = useState(false);
  const [sessionType, setSessionType] = useState("전화상담");
  const [sessionDuration, setSessionDuration] = useState("20분");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const { 
    getSessionTypeStyle, 
    getCompletionStatusColor, 
    getNoteStatusColor, 
    getPaymentStatusColor,
    updateAppointment
  } = useAppContext();
  
  // 상담 유형 옵션
  const sessionTypes = ["카톡상담", "전화상담", "기타"];
  const durationOptions = ["20분", "30분", "40분", "60분"];

  // 클라이언트 정보가 변경될 때 상태 업데이트
  useEffect(() => {
    if (client) {
      setAmount(client.amount || "");
      setIsPaid(client.isPaid || false);
      setIsCompleted(client.isCompleted || false);
      setIsNoteCompleted(client.isNoteCompleted || false);
      setSessionType(client.sessionType || "전화상담");
      setSessionDuration(client.sessionDuration || "20분");
      setStartTime(client.startTime || "");
      setEndTime(client.endTime || "");
    }
  }, [client]);

  // 결제 정보 저장
  const handleSavePayment = async () => {
    if (!client || !client.id) return;
    
    setIsSaving(true);
    try {
      // 결제 정보 업데이트
      updateAppointment(client.id, {
        amount,
        isPaid
      });
      
      setSaveSuccess(true);
      
      // 3초 후 성공 메시지 사라짐
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("결제 정보 저장 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 상담 상태 업데이트
  const handleUpdateSessionInfo = async () => {
    if (!client || !client.id) return;
    
    setIsSaving(true);
    try {
      updateAppointment(client.id, {
        sessionType,
        sessionDuration,
        startTime,
        endTime
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("상담 정보 업데이트 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 상담 완료 상태 변경
  const handleCompletionToggle = () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    
    if (client && client.id) {
      updateAppointment(client.id, { isCompleted: newStatus });
    }
  };

  // 상담 정리 상태 변경
  const handleNoteCompletionToggle = () => {
    const newStatus = !isNoteCompleted;
    setIsNoteCompleted(newStatus);
    
    if (client && client.id) {
      updateAppointment(client.id, { isNoteCompleted: newStatus });
    }
  };

  // 결제 상태 변경
  const handlePaymentStatusToggle = () => {
    const newStatus = !isPaid;
    setIsPaid(newStatus);
    
    if (client && client.id) {
      updateAppointment(client.id, { isPaid: newStatus });
    }
  };

  if (!client) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0">
        <p className="text-center text-gray-500">선택된 고객이 없습니다.</p>
      </div>
    );
  }

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
              <div className="flex items-center space-x-2">
                <select 
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-1"
                >
                  {sessionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select 
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-1"
                >
                  {durationOptions.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
                <button 
                  onClick={handleUpdateSessionInfo}
                  className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded hover:bg-blue-600"
                >
                  변경
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className={`text-xs px-2 py-1 rounded-full ${getSessionTypeStyle(sessionType)}`}>
              {sessionType} {sessionDuration}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-500">예약 시간</p>
            <div className="flex items-center mt-1">
              <input 
                type="text" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-16 text-sm p-1 border rounded"
                placeholder="00:00"
              />
              <span className="mx-1">→</span>
              <input 
                type="text" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-16 text-sm p-1 border rounded"
                placeholder="00:00"
              />
              <button 
                className="ml-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded hover:bg-blue-600"
                onClick={handleUpdateSessionInfo}
              >
                저장
              </button>
            </div>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-gray-500">상담 완료</p>
                <div 
                  onClick={handleCompletionToggle}
                  className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                    isCompleted ? "bg-green-400" : "bg-gray-300"
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full bg-white transform transition-transform duration-300 ${
                    isCompleted ? "translate-x-5" : ""
                  }`} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-gray-500">상담 정리</p>
                <div 
                  onClick={handleNoteCompletionToggle}
                  className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                    isNoteCompleted ? "bg-green-400" : "bg-gray-300"
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full bg-white transform transition-transform duration-300 ${
                    isNoteCompleted ? "translate-x-5" : ""
                  }`} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <div className="flex justify-between items-center">
              <input 
                type="text" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="w-2/3 text-sm p-1 border rounded"
                placeholder="결제 금액"
              />
              <div 
                onClick={handlePaymentStatusToggle}
                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                  isPaid ? "bg-green-400" : "bg-gray-300"
                }`}
              >
                <div className={`h-4 w-4 rounded-full bg-white transform transition-transform duration-300 ${
                  isPaid ? "translate-x-5" : ""
                }`} />
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs font-medium text-gray-500">결제 금액</p>
              <div className="flex items-center">
                <span className={`text-xs px-1.5 py-0.5 rounded-full mr-1 ${
                  getPaymentStatusColor(isPaid)
                }`}>
                  {isPaid ? "결제완료" : "미결제"}
                </span>
                <button 
                  onClick={handleSavePayment} 
                  disabled={isSaving}
                  className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded hover:bg-blue-600"
                >
                  {isSaving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
            {saveSuccess && (
              <p className="text-xs text-green-600 mt-1 text-right">
                정보가 저장되었습니다!
              </p>
            )}
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-500">상담 회차</p>
            <p className="font-medium">3회차</p>
          </div>
        </div>
        
        {/* 고객 데이터 */}
        <ClientInfo />
      </div>
    </div>
  );
}

// 고객 정보 컴포넌트
function ClientInfo() {
  const clientData = {
    age: "30대",
    occupation: "회사원",
    goal: "직장 스트레스 관리",
    note: "불면증 호소, 업무 과부하"
  };

  return (
    <div className="bg-white p-3 rounded border border-gray-200 mb-3">
      <p className="text-sm font-medium mb-2">고객 데이터</p>
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b">
            <td className="py-1 font-medium text-gray-500 w-1/4">연령대</td>
            <td className="py-1">{clientData.age}</td>
          </tr>
          <tr className="border-b">
            <td className="py-1 font-medium text-gray-500">직업</td>
            <td className="py-1">{clientData.occupation}</td>
          </tr>
          <tr className="border-b">
            <td className="py-1 font-medium text-gray-500">상담 목표</td>
            <td className="py-1">{clientData.goal}</td>
          </tr>
          <tr>
            <td className="py-1 font-medium text-gray-500">특이사항</td>
            <td className="py-1">{clientData.note}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ClientProfile;