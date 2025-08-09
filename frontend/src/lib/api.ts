import apiClient from "./apiConfig";
import { ReadingContent } from "@/types/readingType";

export const getReadingById = async (readingId: string): Promise<ReadingContent | undefined> => {
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
    try {
        const response = await apiClient.post<ReadingContent>(`/readings/${readingId}/submit`, {
      user_answers: userAnswers,
    });
    return response.data;
    
    } catch(error) {
        console.log("Error Submitting Answers ", error);
    }
}