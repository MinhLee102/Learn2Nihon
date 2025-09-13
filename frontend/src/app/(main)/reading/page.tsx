'use client';

import React, { useState } from 'react';
import LessonList from '@/components/LessonList';
import { useEffect } from 'react';
import { useLayout } from '@/context/LayoutContext';
import { countReadingExercises } from '@/lib/readingApi';

export default function Reading() {
  const [totalLessons, setTotalLessons] = useState<number | null>(null);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [errorLessons, setErrorLessons] = useState<string | null>(null);

  const { setHeaderTitle } = useLayout();

  useEffect(() => {
    setHeaderTitle('Reading');

    const fetchLessonCount = async () => {
    try {
      setLoadingLessons(true);
      setErrorLessons(null);
      const count = await countReadingExercises(); 
      setTotalLessons(count);
    } catch (err: unknown) {
      console.error("Failed to fetch lesson count:", err);
      if (err instanceof Error) {
          setErrorLessons(err.message);
      } else {
          setErrorLessons("Không thể tải số lượng bài học.");
      }
      setTotalLessons(0); 
    } finally {
      setLoadingLessons(false);
    }
  };
    fetchLessonCount();
  }, [setHeaderTitle]);

  
  return (
    <main
      className="flex-1 p-4 pt-20 
        transition-all duration-300 ease-in-out
        md:ml-20 overflow-y-auto"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      {loadingLessons ? (
            <div className="text-gray-700">Đang tải số lượng bài học...</div>
        ) : errorLessons ? (
            <div className="text-red-500">Lỗi: {errorLessons}</div>
        ) : (
          <LessonList 
            title="Bài" 
            path="reading" 
            numberOfLessons={totalLessons !== null ? totalLessons : 0} 
          />
        )}
    </main>
  );
}
