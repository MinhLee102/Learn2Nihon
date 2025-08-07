'use client';

import React from 'react';
import { useLayout } from '@/context/LayoutContext';
import Link from 'next/link';

export default function Vocabulary() {
  const { isSidebarExtended } = useLayout();

  const lessons = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <main
      className={`flex-1 p-4 pt-20 
        transition-all duration-300 ease-in-out
        ${isSidebarExtended ? 'md:ml-64' : 'md:ml-20'} 
        overflow-y-auto
      `}
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {lessons.map((lesson) => (
          <Link
            href={`/vocabulary/${lesson}`} //Bài số mấy
            key={lesson}
            className="block bg-white shadow rounded-xl p-4 hover:bg-blue-100 transition"
          >
            <h2 className="text-lg font-semibold">Bài {lesson}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
