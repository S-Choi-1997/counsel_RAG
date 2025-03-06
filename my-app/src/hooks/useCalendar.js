import { useState, useEffect } from 'react';

const useCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);

    const handleDateSelect = (dateObj) => {
        // dateObj로부터 새 Date 객체 생성
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dateObj.day);
        setSelectedDate(newDate);
    };

    useEffect(() => {
        // 현재 월의 첫째 날
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        // 현재 월의 마지막 날
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // 달력의 첫째 날 (이전 달의 날짜들 포함)
        const firstDayOfCalendar = new Date(firstDayOfMonth);
        // 첫째 날의 요일에 맞춰 이전 달의 날짜들 표시
        firstDayOfCalendar.setDate(1 - firstDayOfMonth.getDay());
        
        // 달력의 마지막 날 (다음 달의 날짜들 포함)
        const lastDayOfCalendar = new Date(lastDayOfMonth);
        // 마지막 날의 요일에 맞춰 다음 달의 날짜들 표시
        lastDayOfCalendar.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));
        
        const days = [];
        let currentDay = new Date(firstDayOfCalendar);
        
        // 달력의 모든 날짜에 대해
        while (currentDay <= lastDayOfCalendar) {
            days.push({
                day: currentDay.getDate(),
                currentMonth: currentDay.getMonth() === currentDate.getMonth(),
                hasAppointment: false, // 예약 정보는 별도로 업데이트해야 함
                date: new Date(currentDay) // 날짜 전체 정보 저장
            });
            
            currentDay.setDate(currentDay.getDate() + 1);
        }

        // 임시로 더미 데이터로 예약 정보 표시 (실제 구현에서는 API 호출 필요)
        // 현재 월의 10일, 15일, 20일, 25일에 예약이 있다고 가정
        const updatedDays = days.map(day => {
            const hasAppointment = day.currentMonth && 
                [10, 15, 20, 25].includes(day.day);
            return { ...day, hasAppointment };
        });
        
        setCalendarDays(updatedDays);
    }, [currentDate]);

    // 이전 달로 이동
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() - 1);
            return newDate;
        });
    };

    // 다음 달로 이동
    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + 1);
            return newDate;
        });
    };

    return { 
        currentDate, 
        selectedDate, 
        calendarDays, 
        handleDateSelect,
        goToPreviousMonth,
        goToNextMonth
    };
};

export default useCalendar;