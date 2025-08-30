'use client';

import React from 'react';
import Link from 'next/link';

interface LessonListProps {
  title: string;
  path: string;
  numberOfLessons: number;
}

export default function LessonList({ title, path, numberOfLessons }: LessonListProps) {
  const lessons = Array.from({ length: numberOfLessons }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> 
      {lessons.map((lesson) => (
        <Link
          href={`/${path}/${lesson}`}
          key={lesson}
          className="block bg-white shadow rounded-xl p-4 hover:bg-blue-100 transition text-black"
        >
          <h2 className="text-lg font-semibold">{title} {lesson}</h2>
        </Link>
      ))}
    </div>
  );
}