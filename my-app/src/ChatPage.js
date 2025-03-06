import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import UserHeader from './components/layout/UserHeader';
import MonthlyCalendar from './components/calendar/MonthlyCalendar';
import AppointmentList from './components/calendar/AppointmentList';
import MonthlyStats from './components/stats/MonthlyStats';
import DateHeader from './components/client/DateHeader';
import ClientProfile from './components/client/ClientProfile';
import ClientData from './components/client/ClientData';
import NoteEditor from './components/client/NoteEditor';
import ChatInterface from './components/chat/ChatInterface';
import { useAuth } from './hooks/useAuth';
import { useAppointments } from './hooks/useAppointments';
import useCalendar from './hooks/useCalendar';
import { useChat } from './hooks/useChat';
import { useAppContext } from './context/AppContext';

function ChatPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { currentDate, selectedDate, calendarDays, handleDateSelect } = useCalendar();
  const { appointments, currentClient, currentClientIndex, selectClient, saveNote, noteContent, setNoteContent } = useAppointments(selectedDate);
  const { messages, input, setInput, handleSendMessage } = useChat();
  const { getStatusColor, getPaymentColor } = useAppContext(); // 🔥 추가
  
  useEffect(() => {
    // 리디렉션 처리 로직은 useAuth 훅 내부로 이동
  }, []);

 // ✅ 토큰이 없으면 로그인 페이지로 리디렉트
  useEffect(() => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    if (!token) {
      //navigate('/login'); // 🔥 토큰이 없으면 로그인 페이지로 이동
    }
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <DashboardLayout
      leftPanel={
        <>
          <UserHeader user={user} currentDate={currentDate} />
          <MonthlyCalendar 
            currentDate={currentDate}
            selectedDate={selectedDate}
            calendarDays={calendarDays}
            onDateSelect={handleDateSelect}
          />
          <AppointmentList 
            selectedDate={selectedDate}
            appointments={appointments}
            currentClientIndex={currentClientIndex}
            onClientSelect={selectClient}
          />
          <MonthlyStats />
        </>
      }
      middlePanel={
        <>
          <DateHeader currentDate={currentDate} appointmentsCount={appointments.length} />
          <ClientProfile 
            client={currentClient}
            getStatusColor={getStatusColor}  // 🔥 추가
            getPaymentColor={getPaymentColor} // 🔥 추가 /
            />
          <ClientData />
          <NoteEditor 
            client={currentClient}
            noteContent={noteContent}
            setNoteContent={setNoteContent}
            onSave={saveNote}
          />
        </>
      }
      rightPanel={
        <ChatInterface 
          messages={messages}
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
        />
      }
    />
  );
}

export default ChatPage;