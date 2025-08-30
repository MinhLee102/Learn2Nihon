'use client';

import { useEffect } from 'react';
import { useLayout } from '@/context/LayoutContext';
import useReadingLogic from '@/hooks/useReading';
import type { ReadingContent } from '@/types/readingType';

interface ReadingInteractionProps {
    initialReadingData: ReadingContent; 
}

const ReadingInteraction: React.FC<ReadingInteractionProps> = ({ initialReadingData }) => {
    const { setHeaderTitle } = useLayout();

    // Dùng initialReadingData để khởi tạo hook. Hook sẽ tự quản lý state và fetch lại nếu cần.
    const {
        readingData, // Đây sẽ là state trong hook, khởi tạo từ initialReadingData
        userAnswers,
        isSubmitted,
        isLoading,
        error,
        allQuestionsAnswered,
        handleAnswerSelect,
        handleSubmit,
        handleComplete,
    } = useReadingLogic({ readingId: initialReadingData.id, initialData: initialReadingData }); 

    useEffect(() => {
        setHeaderTitle('Reading');
    }, [setHeaderTitle, readingData]);

    if (error) { 
        return <div className="text-red-600">Lỗi tương tác: {error}</div>;
    }
    
    if (!readingData) {
        return <div className="text-gray-600">Không thể tải dữ liệu tương tác.</div>;
    }

    const isSubmitting = isLoading && !isSubmitted; 

    return (
        <div className="flex flex-col space-y-6"> 
            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{readingData.title}</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{readingData.content}</p>
            </div>

            {readingData.questions.map((question, qIndex) => (
                <div key={question.id} className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Question {qIndex + 1}: {question.question_text}
                    </h3>
                    <div className="space-y-3">
                        {question.answers.map((answer, aIndex) => {
                            const isSelected = userAnswers[question.id] === answer.id;
                            const isCorrect = answer.is_correct;
                            
                            let answerClass = 'border border-gray-300 text-gray-800';
                            
                            if (isSubmitted) {
                                if (isCorrect) {
                                    answerClass = 'bg-green-400 text-white font-medium';
                                } else if (isSelected && !isCorrect) {
                                    answerClass = 'bg-red-400 text-white font-medium';
                                } else if (isCorrect && !isSelected) {
                                    answerClass = 'bg-green-400 text-white font-medium';
                                }
                            } else {
                                if (isSelected) {
                                    answerClass = 'bg-[#7289DA] text-white font-medium';
                                }
                            }

                            return (
                                <div
                                    key={answer.id}
                                    className={`
                                        p-3 rounded-md cursor-pointer transition-all duration-200
                                        hover:bg-blue-500 hover:text-white
                                        ${answerClass}
                                        ${isSubmitted ? 'pointer-events-none' : ''}
                                    `}
                                    onClick={() => handleAnswerSelect(question.id, answer.id)}
                                >
                                    <span className="font-semibold mr-2">{aIndex + 1}.</span> {answer.answer_text}
                                </div>
                            );
                        })}
                    </div>

                    {isSubmitted && question.explanation && (
                        <div className="mt-6 p-4 bg-gray-50 border-l-4 border-gray-200 rounded-md text-gray-700">
                            <p className="font-semibold mb-2">Lời giải thích:</p>
                            <p>{question.explanation}</p>
                        </div>
                    )}
                </div>
            ))}

            <div className="flex justify-end space-x-4 mb-8">
                {isSubmitting && ( 
                    <span className="text-gray-500 flex items-center">Đang nộp...</span>
                )}
                {!isSubmitted && (
                    <button
                        onClick={handleSubmit}
                        disabled={!allQuestionsAnswered || isSubmitting}
                        className={`
                            px-6 py-3 rounded-md font-semibold text-white transition-colors duration-200
                            ${allQuestionsAnswered && !isSubmitting ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}
                        `}
                    >
                        Nộp bài
                    </button>
                )}
                {isSubmitted && (
                    <button
                        onClick={handleComplete}
                        className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors duration-200"
                    >
                        Hoàn tất
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReadingInteraction;