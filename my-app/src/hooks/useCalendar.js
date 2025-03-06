import { useState, useEffect } from 'react';

const useCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        // 특정 월의 날짜 목록을 계산하는 로직
        const days = Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1);
        setCalendarDays(days);
    }, [currentDate]);

    return { currentDate, selectedDate, calendarDays, handleDateSelect };
};

export default useCalendar;
