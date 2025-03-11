// src/hooks/useNotes.js
import { useState, useEffect } from 'react';
import { saveNote, getNotesByClientId, getNoteByClientIdAndDate } from '../services/noteService';
import { formatDateToString } from '../utils/dateUtils';
import { getDummyNoteDates, getDummyNoteContent } from '../utils/fallbackData';
import { mapNoteToAPI, mapNoteFromAPI } from '../utils/dataMappers';

export const useNotes = (clientId) => {
  const [noteContent, setNoteContent] = useState("");
  const [selectedNoteDate, setSelectedNoteDate] = useState(formatDateToString(new Date()));
  const [noteDates, setNoteDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ status: 'idle', lastSync: null });
  const [isConnected, setIsConnected] = useState(navigator.onLine);

  // 네트워크 상태 모니터링
  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('api:offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('api:offline', handleOffline);
    };
  }, []);

  // 특정 고객의 모든 메모 날짜 로드
  useEffect(() => {
    if (clientId) {
      setLoading(true);
      getNotesByClientId(clientId)
        .then(data => {
          // 날짜만 추출하여 저장
          const dates = Array.isArray(data) ? data : [];
          setNoteDates(dates.sort().reverse());
          setLoading(false);
        })
        .catch(err => {
          console.error('메모 날짜 목록 로드 오류:', err);
          setLoading(false);
          
          // 네트워크 오류시 더미 데이터 사용
          if (err.isNetworkError) {
            console.log('네트워크 오류로 더미 노트 날짜 데이터 사용');
            const dummyDates = getDummyNoteDates(clientId);
            setNoteDates(dummyDates);
          }
        });
    }
  }, [clientId]);

  // 선택된 날짜의 메모 로드
  useEffect(() => {
    if (clientId && selectedNoteDate) {
      setLoading(true);
      getNoteByClientIdAndDate(clientId, selectedNoteDate)
        .then(data => {
          const mappedNote = mapNoteFromAPI(data);
          setNoteContent(mappedNote?.content || "");
          setLoading(false);
        })
        .catch(err => {
          console.error('메모 내용 로드 오류:', err);
          setNoteContent("");
          setLoading(false);
          
          // 네트워크 오류시 더미 데이터 사용
          if (err.isNetworkError) {
            console.log('네트워크 오류로 더미 노트 내용 데이터 사용');
            const dummyContent = getDummyNoteContent(clientId, selectedNoteDate);
            setNoteContent(dummyContent);
          }
        });
    }
  }, [clientId, selectedNoteDate]);

  // 메모 저장 함수
  const handleSaveNote = async () => {
    if (!clientId) return;
    
    setSyncStatus({ status: 'syncing', lastSync: null });
    
    try {
      // API 요청 데이터 준비
      const noteData = mapNoteToAPI({
        clientId,
        date: selectedNoteDate,
        content: noteContent,
        summary: ''  // 백엔드에서 자동으로 생성되므로 빈 값으로 전송
      });
      
      if (isConnected) {
        // 실제 API 호출
        await saveNote(noteData);
      } else {
        // 오프라인 상태에서는 로컬 저장 (후에 동기화 필요)
        console.log('오프라인 상태: 노트 로컬 저장 (추후 동기화 필요)');
        // localStorage 활용 코드 추가 가능
      }
      
      // 해당 날짜가 noteDates에 없으면 추가
      if (!noteDates.includes(selectedNoteDate)) {
        setNoteDates(prev => [selectedNoteDate, ...prev].sort().reverse());
      }
      
      setSyncStatus({ 
        status: 'synced', 
        lastSync: new Date().toLocaleTimeString('ko-KR') 
      });
    } catch (error) {
      console.error('Failed to save note:', error);
      setSyncStatus({ status: 'failed', lastSync: null });
    }
  };

  return {
    noteContent,
    setNoteContent,
    selectedNoteDate,
    setSelectedNoteDate,
    noteDates,
    handleSaveNote,
    loading,
    syncStatus,
    isConnected
  };
};

export default useNotes;