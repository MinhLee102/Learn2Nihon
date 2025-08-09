'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getReadingById, submitReadingAnswers } from '@/lib/api';
import { ReadingContent } from '@/types/readingType';
import { UseReadingLogicProps } from '@/types/readingType';


const useReadingLogic = ({ readingId, initialData }: UseReadingLogicProps) => {
  const router = useRouter();

  const [readingData, setReadingData] = useState<ReadingContent | undefined>(initialData);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({}); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData || initialData.id !== readingId) {
        const fetchReading = async () => {
          try {
            setIsLoading(true);
            setError(null);
            const data = await getReadingById(readingId);
            setReadingData(data);
        } catch (err: unknown) {
          console.error("Failed to fetch reading data:", err);

          if (err instanceof Error) {
              setError(err.message || "Không thể tải bài đọc. Vui lòng thử lại sau.");
          } else {
              setError("Đã xảy ra lỗi không xác định khi tải bài đọc.");
          }

        } finally {
          setIsLoading(false);
        }
      };

      fetchReading();
    } else {
        setIsLoading(false); 
    }
  }, [readingId, initialData]);

  const allQuestionsAnswered = useMemo(() => {
    if (!readingData) return false;
    return readingData.questions.every(q => userAnswers[q.id] !== undefined);
  }, [readingData, userAnswers]);


  const handleAnswerSelect = (questionId: string, answerId: string) => {
    if (isSubmitted) return; 
    setUserAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (!readingData || !allQuestionsAnswered) return;

    try {
      setIsLoading(true);
      setError(null);

      const submittedData = await submitReadingAnswers(readingData.id, userAnswers);
      setReadingData(submittedData);
      setIsSubmitted(true); 
    } catch (err: unknown) {
      console.error("Failed to submit answers:", err);

      if (err instanceof Error) {
        setError(err.message || "Không thể nộp bài. Vui lòng thử lại.");
      } else {
        setError("Đã xảy ra lỗi không xác định khi nộp bài.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    router.push('/'); 
  };

  return {
    readingData,
    userAnswers,
    isSubmitted,
    isLoading,
    error,
    allQuestionsAnswered,
    handleAnswerSelect,
    handleSubmit,
    handleComplete,
  };
};

export default useReadingLogic;
