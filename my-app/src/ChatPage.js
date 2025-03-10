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
import useCalendar from './hooks/useCalendar';
import { useChat } from './hooks/useChat';
import { useAppContext } from './context/AppContext';
import { useNotes } from './hooks/useNotes';

function ChatPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    currentDate, 
    selectedDate, 
    calendarDays, 
    handleDateSelect, 
    goToPreviousMonth, 
    goToNextMonth 
  } = useCalendar();
  
  // useAppContext를 컴포넌트 최상위 레벨에서 한 번만 호출
  const { 
    appointments, 
    currentClient, 
    currentClientIndex, 
    selectClient,
    getStatusColor,
    getPaymentColor,
    stats
  } = useAppContext();
  
  const { messages, input, setInput, handleSend: handleSendMessage } = useChat();
  
  // 현재 선택된 고객의 메모 관리를 위한 useNotes 훅 사용
  const { 
    noteContent, 
    setNoteContent, 
    selectedNoteDate,
    setSelectedNoteDate,
    noteDates,
    handleSaveNote
  } = useNotes(currentClient?.clientId);

  // 토큰이 없으면 로그인 페이지로 리디렉트
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  if (authLoading) {
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
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
          />
          <AppointmentList 
            selectedDate={selectedDate}
            appointments={appointments}
            currentClientIndex={currentClientIndex}
            onClientSelect={selectClient}
            getStatusColor={getStatusColor}
            getPaymentColor={getPaymentColor}
          />
          <MonthlyStats stats={stats} />
        </>
      }
      middlePanel={
        <>
          <DateHeader currentDate={currentDate} appointmentsCount={appointments.length} />
          <ClientProfile 
            client={currentClient}
            getStatusColor={getStatusColor}
            getPaymentColor={getPaymentColor}
          />
          <ClientData />
          <NoteEditor 
            client={currentClient}
            noteContent={noteContent}
            setNoteContent={setNoteContent}
            onSave={handleSaveNote}
            selectedNoteDate={selectedNoteDate}
            onDateSelect={setSelectedNoteDate}
            noteDates={noteDates}
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