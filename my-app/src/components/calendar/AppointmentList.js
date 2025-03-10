import React from 'react';
import { formatDateString } from '../../utils/dateUtils';
import { useAppContext } from '../../context/AppContext';

function AppointmentList({ selectedDate, appointments, currentClientIndex, onClientSelect }) {
  const { 
    getSessionTypeStyle, 
    getCompletionStatusColor, 
    getNoteStatusColor, 
    getPaymentStatusColor 
  } = useAppContext();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0 flex-grow">
      <h3 className="text-md font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {formatDateString(selectedDate, { month: 'long', day: 'numeric' })} 예약 고객
      </h3>
      
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
    </div>
  );
}

export default AppointmentList;