'use client';

import React from 'react';
import LessonList from '@/components/LessonList';

export default function Reading() {

  return (
    <main
      className="flex-1 p-4 pt-20 
        transition-all duration-300 ease-in-out
        md:ml-20 overflow-y-auto"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <LessonList 
        title="Bài" 
        path="reading" 
        numberOfLessons={50} 
      />
    </main>
  );
}