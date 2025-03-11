import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getClientInfo, updateClientInfo } from '../../services/clientService';

function ClientProfile({ client }) {
  const [isEditMode, setIsEditMode] = useState(false);
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
  const [sessionCount, setSessionCount] = useState("0회차");
  
  // 클라이언트 데이터 상태 추가
  const [clientData, setClientData] = useState({
    age: "",
    occupation: "",
    goal: "",
    note: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
      setSessionCount(client.sessionCount || "0회차"); // 추가된 부분
      
      // 새 고객을 선택하면 편집 모드 종료
      setIsEditMode(false);
      
      // 클라이언트 상세 정보 로드
      loadClientInfo(client.clientId);
    }
  }, [client]);

  // 클라이언트 상세 정보 로드 함수
  const loadClientInfo = async (clientId) => {
    if (!clientId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getClientInfo(clientId);
      setClientData({
        age: response.age || "",
        occupation: response.occupation || "",
        goal: response.goal || "",
        note: response.note || ""
      });
    } catch (err) {
      console.error('클라이언트 정보 로드 실패:', err);
      setError('클라이언트 정보를 로드할 수 없습니다.');
      
      // 네트워크 오류시 더미 데이터 사용 (선택적)
      if (err.isNetworkError) {
        setClientData({
          age: "30대",
          occupation: "회사원",
          goal: "직장 스트레스 관리",
          note: "불면증 호소, 업무 과부하"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 모든 정보 저장
  const handleSaveAll = async () => {
    if (!client || !client.id) return;
    
    setIsSaving(true);
    try {
      // 예약 정보 업데이트
      updateAppointment(client.id, {
        amount,
        isPaid,
        isCompleted,
        isNoteCompleted,
        sessionType,
        sessionDuration,
        startTime,
        endTime,
        sessionCount
      });
      
      // 클라이언트 상세 정보 업데이트
      if (client.clientId) {
        await updateClientInfo(client.clientId, clientData);
      }
      
      setSaveSuccess(true);
      
      // 3초 후 성공 메시지 사라짐
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      // 편집 모드 종료
      setIsEditMode(false);
    } catch (error) {
      console.error("정보 저장 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    if (isEditMode && !isSaving) {
      // 편집 모드에서 일반 모드로 변경 시 저장
      handleSaveAll();
    } else {
      // 일반 모드에서 편집 모드로 변경
      setIsEditMode(true);
    }
  };

  // 클라이언트 데이터 입력 변경 처리
  const handleClientDataChange = (field, value) => {
    setClientData(prev => ({
      ...prev,
      [field]: value
    }));
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
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          현재 고객 정보
        </h3>
        
        <button 
          onClick={toggleEditMode}
          className={`px-3 py-1 text-sm rounded ${
            isEditMode 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={isSaving}
        >
          {isSaving ? "저장 중..." : isEditMode ? "저장" : "수정"}
        </button>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              {client.clientName[0]}
            </div>
            <div>
              <h4 className="font-bold text-lg">{client.clientName}</h4>
              {isEditMode ? (
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
                </div>
              ) : (
                <div className="flex flex-col mt-1">
                  <span className={`text-xs px-2 py-1 inline-block rounded-full w-fit ${getSessionTypeStyle(sessionType)}`}>
                    {sessionType} {sessionDuration}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-500">예약 시간</p>
            {isEditMode ? (
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
              </div>
            ) : (
              <p className="font-medium">{startTime} → {endTime}</p>
            )}
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-gray-500">상담 완료</p>
                {isEditMode ? (
                  <div 
                    onClick={() => setIsCompleted(!isCompleted)}
                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                      isCompleted ? "bg-green-400" : "bg-gray-300"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full bg-white transform transition-transform duration-300 ${
                      isCompleted ? "translate-x-5" : ""
                    }`} />
                  </div>
                ) : (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    getCompletionStatusColor(isCompleted)
                  }`}>
                    {isCompleted ? "완료" : "미완료"}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs font-medium text-gray-500">상담 정리</p>
                {isEditMode ? (
                  <div 
                    onClick={() => setIsNoteCompleted(!isNoteCompleted)}
                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                      isNoteCompleted ? "bg-green-400" : "bg-gray-300"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full bg-white transform transition-transform duration-300 ${
                      isNoteCompleted ? "translate-x-5" : ""
                    }`} />
                  </div>
                ) : (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    getNoteStatusColor(isNoteCompleted)
                  }`}>
                    {isNoteCompleted ? "완료" : "미완료"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-gray-500">결제 금액</p>
                {isEditMode ? (
                  <input 
                    type="text" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-24 text-sm p-1 border rounded text-right"
                    placeholder="금액 입력"
                  />
                ) : (
                  <p className="font-medium text-right">{amount}원</p>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs font-medium text-gray-500">결제 상태</p>
                {isEditMode ? (
                  <div 
                    onClick={() => setIsPaid(!isPaid)}
                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                      isPaid ? "bg-green-400" : "bg-gray-300"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full bg-white transform transition-transform duration-300 ${
                      isPaid ? "translate-x-5" : ""
                    }`} />
                  </div>
                ) : (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    getPaymentStatusColor(isPaid)
                  }`}>
                    {isPaid ? "결제완료" : "미결제"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-500">상담 회차</p>
            <p className="font-medium">3회차</p>
          </div>
        </div>
        
        {/* 고객 데이터 */}
        <div className="bg-white p-3 rounded border border-gray-200 mb-3">
          <p className="text-sm font-medium mb-2">고객 데이터</p>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-1 font-medium text-gray-500 w-1/4">연령대</td>
                  <td className="py-1">
                    {isEditMode ? (
                      <input 
                        type="text" 
                        value={clientData.age} 
                        onChange={(e) => handleClientDataChange('age', e.target.value)}
                        className="w-full text-sm p-1 border rounded"
                      />
                    ) : (
                      clientData.age
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 font-medium text-gray-500">직업</td>
                  <td className="py-1">
                    {isEditMode ? (
                      <input 
                        type="text" 
                        value={clientData.occupation} 
                        onChange={(e) => handleClientDataChange('occupation', e.target.value)}
                        className="w-full text-sm p-1 border rounded"
                      />
                    ) : (
                      clientData.occupation
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 font-medium text-gray-500">상담 목표</td>
                  <td className="py-1">
                    {isEditMode ? (
                      <input 
                        type="text" 
                        value={clientData.goal} 
                        onChange={(e) => handleClientDataChange('goal', e.target.value)}
                        className="w-full text-sm p-1 border rounded"
                      />
                    ) : (
                      clientData.goal
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-medium text-gray-500">특이사항</td>
                  <td className="py-1">
                    {isEditMode ? (
                      <input 
                        type="text" 
                        value={clientData.note} 
                        onChange={(e) => handleClientDataChange('note', e.target.value)}
                        className="w-full text-sm p-1 border rounded"
                      />
                    ) : (
                      clientData.note
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        
        {saveSuccess && (
          <div className="mt-2 bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded text-sm">
            모든 정보가 성공적으로 저장되었습니다!
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientProfile;