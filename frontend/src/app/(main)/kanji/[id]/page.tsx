'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Kanji {
  id: number;
  word: string;
  kunyomi: string[] | null;
  onyomi: string[] | null;
  strokes: number;
  meaning: string;
  lesson: number;
  jlpt_level: string | null;
  explain: string[] | null;
}

export default function LessonPage() {
  const { lesson } = useParams();
  const [kanji, setKanji] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!lesson) return;

    const fetchKanji = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/kanji/lesson/${lesson}`);
        const data = await res.json();
        setKanji(data);
      } catch (err) {
        console.error('Lỗi khi fetch kanji:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKanji();
  }, [lesson]);

  const [isHiding, setIsHiding] = useState(false);

  const handleNext = () => {
    setIsHiding(true);
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % kanji.length);
      setIsHiding(false);
    }, 150);
  };

  const handlePrev = () => {
    setIsHiding(true);
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + kanji.length) % kanji.length);
      setIsHiding(false);
    }, 150);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === ' ') setFlipped((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, );

  if (loading) {
    return (
      <div className="p-4 pt-20 text-black">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (kanji.length === 0) {
    return (
      <div className="p-4 pt-20 text-black">
        <p>Không có từ vựng trong bài học này.</p>
      </div>
    );
  }

  const kanji_word = kanji[currentIndex];

  return (
    <div className="p-4 pt-20 flex flex-col items-center text-black">
      <h1 className="text-xl font-bold mb-6">
        Bài học số {lesson} — Từ {currentIndex + 1}/{kanji.length}
      </h1>

      {/* Container flashcard + nút */}
      <div className="flex items-center justify-center relative w-full max-w-[90vw]">
        {/* Nút trái */}
        <button
          onClick={handlePrev}
          className="absolute left-0 p-3 bg-gray-300 rounded-full hover:bg-gray-400 text-2xl z-10"
        >
          ◀
        </button>

        {/* Flashcard */}
        <div
          className="cursor-pointer perspective w-[60vw] aspect-[4/3] max-w-[800px]"
          onClick={() => !isHiding && setFlipped((prev) => !prev)}
        >
          <div
            className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
              flipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front */}
            <div className="absolute w-full h-full bg-white text-black rounded-xl shadow flex flex-col items-center justify-center p-6 backface-hidden">
              {!isHiding && (
                <>
                  <h2 className="text-4xl font-bold">{kanji_word.word}</h2>
                  {kanji_word.kunyomi && (
                    <p className="italic text-gray-700 mt-2">Kun: {kanji_word.kunyomi.join(', ')}</p>
                  )}

                  {kanji_word.onyomi && (
                    <p className="italic text-gray-700 mt-2">On: {kanji_word.onyomi.join(', ')}</p>
                  )}
                </>
              )}
            </div>

            {/* Back */}
            <div className="absolute w-full h-full bg-gray-100 text-black rounded-xl shadow flex flex-col items-center justify-center p-6 rotate-y-180 backface-hidden">
              {!isHiding && (
                <>
                  <h2 className="text-4xl font-bold">{kanji_word.word}</h2>

                  <p className="text-lg font-semibold">{kanji_word.meaning}</p>
                  {kanji_word.explain && (
                    <p className="text-sm mt-2 text-gray-700">{kanji_word.explain.join('; ')}</p>
                  )}

                </>
              )}
            </div>
          </div>
        </div>

        {/* Nút phải */}
        <button
          onClick={handleNext}
          className="absolute right-0 p-3 bg-gray-300 rounded-full hover:bg-gray-400 text-2xl z-10"
        >
          ▶
        </button>
      </div>

      {/* Danh sách từ vựng cuộn dọc */}
      <div className="mt-6 w-full max-w-[90vw] max-h-[200px] overflow-y-auto border rounded-lg p-2">
        <div className="flex flex-col gap-2">
          {kanji.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentIndex(index);
                setFlipped(false);
              }}
              className={`px-4 py-2 text-left rounded-lg ${
                index === currentIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <span className="font-semibold">{item.word}</span>
              {item.kunyomi && (
                <span className="ml-2 italic text-gray-600">{item.kunyomi}</span>
              )}

              {item.onyomi && (
                <span className="ml-2 italic text-gray-600">{item.onyomi}</span>
              )}

            </button>
          ))}
        </div>
      </div>

      {/* CSS bổ sung */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
