'use client'; 

import React, { useEffect } from 'react';
import JLPTLevelCard from '@/components/JLPTLevel';
import { useLayout } from '@/context/LayoutContext';
import type { JLPTLevel } from '@/components/JLPTLevel';

export default function KanjiPage() {
  const { setHeaderTitle } = useLayout();

  useEffect(() => {
    setHeaderTitle('Kanji');
  }, [setHeaderTitle]);

  const levels: JLPTLevel[] = ['5', '4', '3', '2', '1'];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-80px)] p-4">
      <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center max-w-2xl w-full h-full text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-8">
          Bạn muốn luyện tập Kanji của cấp độ nào?
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {levels.map((level) => (
            <JLPTLevelCard
              key={level}
              level={level}
              href={`/kanji/${level}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}