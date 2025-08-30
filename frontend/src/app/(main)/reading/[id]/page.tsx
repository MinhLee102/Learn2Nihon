import { getReadingById } from '@/lib/api';
import MyWordList from '@/components/MyWordList';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Question, Answer } from '@/types/readingType';
import ReadingInteraction from './ReadingInteraction';
import { notFound } from 'next/navigation';
import { ReadingPageProps } from '@/types/readingType';

export default async function ReadingPage({ params }: ReadingPageProps) {
    
    const { id } = await params;


    if (!id || isNaN(parseInt(id, 10))) {
        notFound();
    }
    
    const readingData = await getReadingById(id);

    if (!readingData) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100vh-80px)] text-gray-600">
                Không tìm thấy bài đọc hoặc lỗi khi tải dữ liệu.
            </div>
        );
    }

 return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[calc(100vh-80px)]">
        <div className="md:col-span-1">
            <MyWordList /> 
        </div>

        <div className="md:col-span-2">
            <ReadingInteraction initialReadingData={readingData} />
        </div>
    </div>
  );
} 