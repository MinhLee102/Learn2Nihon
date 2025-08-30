import apiClient from "./apiConfig";
import { ReadingContent } from "@/types/readingType";

export const getReadingById = async (readingId: string): Promise<ReadingContent | undefined> => {
    if (!readingId || isNaN(parseInt(readingId, 10))) {
    console.error("Invalid reading ID detected on server:", readingId);
    return undefined; // Không gọi API nếu ID không hợp lệ
  }
    
    try {
        const response = await apiClient.get<ReadingContent>(`/readings/${readingId}`);

        console.log(response.data);

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
    try {
        const response = await apiClient.post<ReadingContent>(`/answers/${readingId}`, {
      user_answers: userAnswers,
    });
    return response.data;
    
    } catch(error) {
        console.log("Error Submitting Answers ", error);
    }
}