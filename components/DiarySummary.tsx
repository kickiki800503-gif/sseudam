
import React from 'react';
import { DiaryEntry } from '../types';

interface DiarySummaryProps {
  logs: DiaryEntry[];
}

const DiarySummary: React.FC<DiarySummaryProps> = ({ logs }) => {
  const counts = logs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const summaryItems = [
    { type: 'MEAL', label: '식사', emoji: '🥘', color: 'text-amber-500', bg: 'bg-amber-50' },
    { type: 'SNACK', label: '간식', emoji: '🦴', color: 'text-orange-500', bg: 'bg-orange-50' },
    { type: 'WALK', label: '산책', emoji: '🐕', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { type: 'POOP', label: '배변', emoji: '🩹', color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-3 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">기록 요약</h4>
        <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
          총 {logs.length}건의 활동
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-1">
        {summaryItems.map((item) => (
          <div key={item.type} className={`${item.bg} rounded-xl p-2 flex flex-col items-center justify-center transition-transform hover:scale-105`}>
            <span className="text-base mb-1">{item.emoji}</span>
            <span className={`text-[8px] font-bold ${item.color}`}>{item.label}</span>
            <span className="text-xs font-black text-gray-700 mt-0.5">{counts[item.type] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiarySummary;
