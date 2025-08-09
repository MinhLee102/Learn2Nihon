import apiClient from "./apiConfig";
import { ReadingContent, mockReadingData, mockSubmittedData } from "@/types/readingType";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

export const getReadingById = async (readingId: string): Promise<ReadingContent | undefined> => {
     if (USE_MOCK_API) {
        console.log(`[MOCK API] Fetching reading data for ID: ${readingId}`);
        return new Promise(resolve => {
            setTimeout(() => {
                // Giả lập tìm kiếm bài đọc theo ID trong mock data
                // Nếu bạn có nhiều bài đọc mock, bạn sẽ cần logic phức tạp hơn ở đây
                // Ví dụ: const foundMock = MOCK_READINGS_ARRAY.find(r => r.id === readingId);
                // resolve(foundMock || undefined); // Nếu không tìm thấy, trả về undefined

                // Hiện tại, chúng ta chỉ có một mockReadingData
                if (readingId === mockReadingData.id) {
                    resolve(mockReadingData);
                } else {
                    // Nếu ID không khớp, bạn có thể trả về undefined hoặc một bản sao với ID mới
                    console.warn(`[MOCK API] Reading ID '${readingId}' not found in mock data. Returning default mock.`);
                    resolve({ ...mockReadingData, id: readingId }); // Trả về mock data nhưng thay đổi ID
                }
            }, 500); // Giả lập độ trễ 0.5 giây
        });
    }
    
    try {
        const response = await apiClient.get<ReadingContent>(`/readings/${readingId}`);
        return response.data;
    } catch(error) {
        console.error(`Error detected: ${readingId}:`, error);
        return undefined;    
    }
}

export const submitReadingAnswers = async (
    readingId: string,
    userAnswers: { [key: string]: string }
): Promise<ReadingContent | undefined> => {
    if (USE_MOCK_API) {
        console.log(`[MOCK API] Submitting answers for ID: ${readingId}`, userAnswers);
        return new Promise(resolve => {
            setTimeout(() => {
                // Giả lập việc chấm điểm và trả về dữ liệu đã chấm điểm
                // Trong thực tế, bạn có thể thêm logic để "chấm" userAnswers với mock data
                // và tạo ra mockSubmittedData dựa trên đó.
                if (readingId === mockSubmittedData.id) {
                    resolve(mockSubmittedData);
                } else {
                    console.warn(`[MOCK API] Submitted Reading ID '${readingId}' not found in mock data. Returning default submitted mock.`);
                    resolve({ ...mockSubmittedData, id: readingId }); // Trả về mockSubmittedData nhưng thay đổi ID
                }
            }, 1000); // Giả lập độ trễ 1 giây
        });
    }

    try {
        const response = await apiClient.post<ReadingContent>(`/readings/${readingId}/submit`, {
      user_answers: userAnswers,
    });
    return response.data;
    
    } catch(error) {
        console.log("Error Submitting Answers ", error);
    }
}