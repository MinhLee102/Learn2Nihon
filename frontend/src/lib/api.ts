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

export const countReadingExercises = async (): Promise<number> => {
    try {
        const response = await apiClient.get<number>('/readings/count');
        console.log(`Number of reading exer: ${response.data}`);
        return response.data;
    } catch {
        console.error("Error detected: Can not get total numbers of reading exercises");
        return 0;
    }
}