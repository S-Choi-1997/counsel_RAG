import { useState, useEffect } from 'react';
import { saveNote, getNotesByClientId, getNoteByClientIdAndDate } from '../services/noteService';
import { formatDateToString } from '../utils/dateUtils';

export const useNotes = (clientId) => {
  const [noteContent, setNoteContent] = useState("");
  const [selectedNoteDate, setSelectedNoteDate] = useState(formatDateToString(new Date()));
  const [noteDates, setNoteDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ status: 'idle', lastSync: null });

  // 특정 고객의 모든 메모 날짜 로드
  useEffect(() => {
    if (clientId) {
      setLoading(true);
      getNotesByClientId(clientId)
        .then(data => {
          // 날짜만 추출하여 저장
          const dates = data.map(note => note.date).sort().reverse();
          setNoteDates(dates);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [clientId]);

  // 선택된 날짜의 메모 로드
  useEffect(() => {
    if (clientId && selectedNoteDate) {
      setLoading(true);
      getNoteByClientIdAndDate(clientId, selectedNoteDate)
        .then(data => {
          setNoteContent(data?.content || "");
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setNoteContent("");
          setLoading(false);
        });
    }
  }, [clientId, selectedNoteDate]);

  // 메모 저장 함수
  const handleSaveNote = async () => {
    if (!clientId) return;
    
    setSyncStatus({ status: 'syncing', lastSync: null });
    
    try {
      await saveNote(clientId, selectedNoteDate, noteContent);
      
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
    syncStatus
  };
};

export default useNotes;