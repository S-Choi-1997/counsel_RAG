import React, { useState } from 'react';
import { formatDateString, formatDateToString } from '../../utils/dateUtils';
import { useAppContext } from '../../context/AppContext';

function AppointmentList({ selectedDate, appointments, currentClientIndex, onClientSelect }) {
  // 모달 상태 관리
  const [showAddModal, setShowAddModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  
  const { 
    getSessionTypeStyle, 
    getCompletionStatusColor, 
    getNoteStatusColor, 
    getPaymentStatusColor,
    addAppointment,
    deleteAppointment
  } = useAppContext();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0 flex-grow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDateString(selectedDate, { month: 'long', day: 'numeric' })} 예약 고객
        </h3>
        
        {/* 추가/삭제 버튼 */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-1 rounded-full hover:bg-gray-100 text-blue-600"
            title="고객 추가"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button 
            onClick={() => appointments.length > 0 && setAppointmentToDelete(appointments[currentClientIndex])}
            className={`p-1 rounded-full hover:bg-gray-100 text-red-600 ${appointments.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="현재 고객 삭제"
            disabled={appointments.length === 0}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-2 overflow-y-auto max-h-64">
        {appointments.length > 0 ? (
          appointments.map((apt, index) => (
            <div 
              key={apt.id} 
              className={`p-2 rounded-md border-l-4 border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors
                ${currentClientIndex === index ? 'bg-blue-50 shadow' : 'bg-white'}`}
              onClick={() => onClientSelect(index)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 font-bold rounded py-1 px-2 text-xs mr-2">
                    {apt.startTime} → {apt.endTime}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{apt.clientName}</p>
                    <div className="flex space-x-1 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getSessionTypeStyle(apt.sessionType)}`}>
                        {apt.sessionType} {apt.sessionDuration}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPaymentStatusColor(apt.isPaid)}`}>
                        {apt.isPaid ? "결제완료" : "미결제"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full text-center ${getCompletionStatusColor(apt.isCompleted)}`}>
                    {apt.isCompleted ? "상담완료" : "상담전"}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full text-center ${getNoteStatusColor(apt.isNoteCompleted)}`}>
                    {apt.isNoteCompleted ? "정리완료" : "정리전"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            예약된 고객이 없습니다.
          </div>
        )}
      </div>
      
      {/* 고객 추가 모달 */}
      {showAddModal && (
        <AddAppointmentModal 
          selectedDate={selectedDate}
          onClose={() => setShowAddModal(false)}
          onSave={(newAppointment) => {
            addAppointment(newAppointment);
            setShowAddModal(false);
          }}
        />
      )}
      
      {/* 고객 삭제 확인 모달 */}
      {appointmentToDelete && (
        <DeleteConfirmModal
          appointment={appointmentToDelete}
          onClose={() => setAppointmentToDelete(null)}
          onConfirm={() => {
            deleteAppointment(appointmentToDelete.id);
            setAppointmentToDelete(null);
          }}
        />
      )}
    </div>
  );
}

function AddAppointmentModal({ selectedDate, onClose, onSave }) {
  const [formData, setFormData] = useState({
    clientName: '',
    startTime: '09:00',
    endTime: '09:30',
    sessionType: '전화상담',
    notes: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 필수 정보 검증
    if (!formData.clientName || !formData.startTime || !formData.endTime) {
      alert('고객명과 시간을 입력해주세요.');
      return;
    }
    
    // 시간 유효성 검증
    const start = formData.startTime.split(':').map(Number);
    const end = formData.endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    
    if (endMinutes <= startMinutes) {
      alert('종료 시간은 시작 시간보다 뒤여야 합니다.');
      return;
    }
    
    // 새 예약 데이터 생성
    const newAppointment = {
      clientName: formData.clientName,
      date: formatDateToString(selectedDate),
      startTime: formData.startTime,
      endTime: formData.endTime,
      sessionType: formData.sessionType,
      sessionDuration: `${endMinutes - startMinutes}분`,
      notes: formData.notes,
      isCompleted: false,
      isNoteCompleted: false,
      isPaid: false
    };
    
    onSave(newAppointment);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">새 예약 추가</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">고객명</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">시작 시간</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">종료 시간</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">상담 유형</label>
            <select
              name="sessionType"
              value={formData.sessionType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="전화상담">전화상담</option>
              <option value="카톡상담">카톡상담</option>
              <option value="기타">기타</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">메모</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ appointment, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4">예약 삭제 확인</h3>
        
        <p className="mb-6">
          <strong>{appointment.clientName}</strong>님의 
          <strong> {appointment.startTime}</strong> 예약을 삭제하시겠습니까?
        </p>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentList;