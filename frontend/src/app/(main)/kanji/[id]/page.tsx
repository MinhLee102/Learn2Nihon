'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Kanji } from '@/types/kanjiType';

export default function LessonPage() {
  const { id } = useParams();
  const jlpt_level = "N" + id;
   
  const [kanji, setKanji] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!jlpt_level) return;

    const fetchKanji = async () => {
      try {
        setLoading(true);
        console.log(jlpt_level + ":  JLPT LEVEL HEREE")
        const res = await fetch(`http://127.0.0.1:8000/kanji/20random/${jlpt_level}`);
        const data = await res.json();
        setKanji(data);
      } catch (err) {
        console.error('Lỗi khi fetch vocabularies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKanji();
  }, [jlpt_level]);

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
        Bài luyện tập Kanji mức độ {jlpt_level} — Từ {currentIndex + 1}/{kanji.length}
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
