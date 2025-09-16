import type { SearchRequest, SearchResponse } from '@/types/dictionaryType'; 
import apiClient from './apiConfig';


// NEW: API để tra cứu từ điển
export const searchDictionary = async (searchData: SearchRequest): Promise<SearchResponse | undefined> => {
    try {
        // Endpoint ví dụ: POST /dictionary/search
        // Backend sẽ nhận { "content": "user_input", "type": "vocabulary", "direction": "jp-vi" }
        // Và trả về { "results": [{...}] }
        const response = await apiClient.post<SearchResponse>('/dictionary/search', searchData);
        return response.data;
    } catch (error: unknown) {
        console.log("Error detected: ", error);
    }
};