import type { DictionaryApiResponse, SearchRequest, SearchResponse } from '@/types/dictionaryType'; 
import apiClient from './apiConfig';


//API để tra cứu từ điển
export const searchDictionary = async (searchData: SearchRequest): Promise<SearchResponse | undefined> => {
    try {
        // Endpoint: GET /api/search/jisho?q={content}
        const response = await apiClient.get<DictionaryApiResponse>(`/search/jisho?q=${encodeURIComponent(searchData.content)}`);
        
        return { results: response.data.data }; // Trả về SearchResponse 
    } catch (error: unknown) {
        console.log("Error detected when searching dictionary: ", error);
    }
};

