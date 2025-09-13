import apiClient from "./apiConfig";
import type { ChatbotResponse, SpeechToTextResponse } from '@/types/chatBotType'; 

export const sendChatMessageToAI = async (message: string): Promise<ChatbotResponse | undefined> => {
    try {
        const response = await apiClient.post<ChatbotResponse>('/chatbot/send', { message });
        return response.data;

    } catch (error: unknown) {
        console.log("Không thể gửi tin nhắn đến AI. Vui lòng thử lại.", error);
    }
};

export const getAzureTranscription = async (audioBlob: Blob): Promise<SpeechToTextResponse | undefined> => {
    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.wav'); // Gửi file âm thanh

        const response = await apiClient.post<SpeechToTextResponse>('/azure/stt', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
        
    } catch (error: unknown) {
        console.log("Không thể chuyển đổi giọng nói thành văn bản. Vui lòng thử lại.", error);
    }
};