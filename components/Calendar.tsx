
import React, { useState } from 'react';
import { DiaryEntry, Guardian } from '../types';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  logs: DiaryEntry[];
  guardians: Guardian[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, logs, guardians }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Padding for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10"></div>);
  }

  // Days of the month
  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(year, month, d);
    const dateStr = curDate.toDateString();
    const isSelected = selectedDate.toDateString() === dateStr;
    const isToday = today.toDateString() === dateStr;

    // Filter logs for this specific day
    const dayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === dateStr);

    days.push(
      <button
        key={d}
        onClick={() => onDateSelect(curDate)}
        className={`h-10 border-t border-gray-50 flex flex-col items-center justify-center relative transition-all ${
          isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'
        }`}
      >
        <span className={`text-[10px] font-bold ${
          isSelected ? 'text-orange-600' : isToday ? 'text-blue-500' : 'text-gray-600'
        }`}>
          {d}
        </span>
        
        {/* Event Markers - Minimalist style */}
        <div className="flex space-x-0.5 mt-0.5">
          {Array.from(new Set(dayLogs.map(l => l.type))).slice(0, 3).map((type) => {
            const typeColor = 
              type === 'MEAL' ? 'bg-amber-400' : 
              type === 'WALK' ? 'bg-emerald-500' : 
              type === 'POOP' ? 'bg-rose-400' : 
              'bg-blue-400';
            return <div key={type} className={`w-1 h-1 rounded-full ${typeColor}`} />;
          })}
        </div>

        {isSelected && (
          <div className="absolute bottom-0.5 w-0.5 h-0.5 bg-orange-500 rounded-full"></div>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-50">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-50 rounded-full text-gray-400 text-xs">❮</button>
        <h3 className="font-bold text-gray-800 text-xs">{year}년 {month + 1}월</h3>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-50 rounded-full text-gray-400 text-xs">❯</button>
      </div>
      
      <div className="grid grid-cols-7 text-center py-1 bg-gray-50/30">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <span key={day} className={`text-[8px] font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
            {day}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {days}
      </div>

      {/* Legend - Smaller */}
      <div className="px-3 py-1.5 bg-gray-50 flex justify-center gap-3 border-t border-gray-100">
        {[
          { color: 'bg-amber-400', label: '식사' },
          { color: 'bg-emerald-500', label: '산책' },
          { color: 'bg-rose-400', label: '배변' },
          { color: 'bg-blue-400', label: '기타' }
        ].map(item => (
          <div key={item.label} className="flex items-center space-x-1">
            <div className={`w-1 h-1 rounded-full ${item.color}`}></div>
            <span className="text-[8px] text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
