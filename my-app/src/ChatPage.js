import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import UserHeader from './components/layout/UserHeader';
import MonthlyCalendar from './components/calendar/MonthlyCalendar';
import AppointmentList from './components/calendar/AppointmentList';
import MonthlyStats from './components/stats/MonthlyStats';
import ClientProfile from './components/client/ClientProfile';
import PreviousNotesList from './components/client/PreviousNotesList';
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
  
  // AppContext에서 필요한 함수와 상태 가져오기
  const { 
    appointments, 
    currentClient, 
    currentClientIndex, 
    selectClient,
    stats,
    selectDate
  } = useAppContext();
  
  const { messages, input, setInput, handleSend: handleSendMessage, loading: chatLoading } = useChat();
  
  // 현재 선택된 고객의 메모 관리를 위한 useNotes 훅 사용
  const { 
    noteContent, 
    setNoteContent, 
    selectedNoteDate,
    setSelectedNoteDate,
    noteDates,
    handleSaveNote,
    loading: notesLoading
  } = useNotes(currentClient?.clientId);

  // 토큰이 없으면 로그인 페이지로 리디렉트
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  
  // 날짜 선택과 해당 날짜의 예약 데이터 로드를 함께 처리하는 함수
  const handleDateSelectAndFetch = (dateObj) => {
    handleDateSelect(dateObj);  // 기존 캘린더 UI 업데이트
    
    // 선택된 날짜의 예약 데이터 로드
    if (dateObj.date) {
      selectDate(new Date(dateObj.date)); // AppContext의 selectDate 호출하여 예약 데이터 갱신
    } else if (dateObj.day) {
      // 이전 방식 호환성 유지 (day만 있는 경우)
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dateObj.day);
      selectDate(newDate);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <DashboardLayout
      leftPanel={
        <>
          <UserHeader 
            user={user} 
            currentDate={currentDate} 
            appointmentsCount={appointments.length} 
          />
          <MonthlyCalendar 
            currentDate={currentDate}
            selectedDate={selectedDate}
            calendarDays={calendarDays}
            onDateSelect={handleDateSelectAndFetch} // 수정된 함수 사용
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
          />
          <AppointmentList 
            selectedDate={selectedDate}
            appointments={appointments}
            currentClientIndex={currentClientIndex}
            onClientSelect={selectClient}
          />
          <MonthlyStats stats={stats} />
        </>
      }
      middlePanel={
        <>
          <ClientProfile client={currentClient} />
          <PreviousNotesList
            noteDates={noteDates}
            selectedNoteDate={selectedNoteDate}
            onSelectNote={setSelectedNoteDate}
          />
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
          loading={chatLoading}
        />
      }
    />
  );
}

export default ChatPage;