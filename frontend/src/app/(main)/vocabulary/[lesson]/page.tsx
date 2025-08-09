'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Vocabulary {
  id: number;
  word: string;
  description: string | null;
  meaning: string;
  pronunciation: string;
}

export default function LessonPage() {
  const { lesson } = useParams(); // lesson là số trang
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lesson) return;

    const fetchVocabularies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/page/${lesson}?limit=10`);
        const data = await res.json();
        setVocabularies(data);
      } catch (err) {
        console.error('Lỗi khi fetch vocabularies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabularies();
  }, [lesson]);

  return (
    <div className="p-4 pt-20">
      <h1 className="text-2xl font-bold mb-4">Bài học số {lesson}</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <ul className="space-y-4">
          {vocabularies.map((vocab) => (
            <li
              key={vocab.id}
              className="p-4 bg-white rounded-xl shadow hover:bg-blue-50 transition"
            >
              <h2 className="text-xl font-semibold">{vocab.word}</h2>
              <p className="text-gray-700 italic">{vocab.pronunciation}</p>
              <p className="text-gray-900">{vocab.meaning}</p>
              {vocab.description && (
                <p className="text-sm text-gray-500 mt-1">{vocab.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
