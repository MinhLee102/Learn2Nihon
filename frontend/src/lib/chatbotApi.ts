// lib/chatbotApi.ts

import apiClient from './apiConfig'; // Import axios instance đã được cấu hình
import type { ChatbotResponse, SpeechToTextResponse } from "@/types/chatBotType";

/**
 * Gửi audio blob đến backend để chuyển đổi thành văn bản.
 * Sử dụng apiClient với header 'multipart/form-data'.
 * @param audioBlob Dữ liệu âm thanh từ microphone.
 * @returns Một object chứa văn bản đã được phiên âm.
 */
export const getAzureTranscription = async (audioBlob: Blob): Promise<SpeechToTextResponse> => {
    const formData = new FormData();
    // Tên 'audio' phải khớp với tham số trong endpoint FastAPI
    formData.append('audio', audioBlob, 'user_audio.wav'); 

    try {
        // Sử dụng apiClient.post
        // URL '/azure/stt' sẽ được tự động nối với baseURL ('/api' hoặc 'http://nginx/api')
        const response = await apiClient.post<{ transcription: string }>('/azure/stt', formData, {
            // Quan trọng: Phải ghi đè header mặc định ('application/json') 
            // thành 'multipart/form-data' cho việc upload file.
            // Axios sẽ tự động xử lý header này khi bạn truyền FormData.
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Với axios, dữ liệu trả về nằm trong response.data
        return { transcription: response.data.transcription };

    } catch (error) {
        console.error('Lỗi khi gọi API Speech-to-Text:', error);
        // Trả về một giá trị mặc định để không làm crash app
        return { transcription: '' }; 
    }
};

/**
 * Gửi tin nhắn văn bản đến AI và nhận phản hồi.
 * Sử dụng apiClient với header 'application/json' mặc định.
 * @param message Nội dung tin nhắn của người dùng.
 * @param sessionId ID của phiên trò chuyện (nếu có).
 * @returns Một object chứa phản hồi của AI và session ID.
 */
export const sendChatMessageToAI = async (message: string, sessionId: string | null): Promise<ChatbotResponse> => {
    try {
        // Dùng apiClient.post. Header 'application/json' đã được cấu hình mặc định.
        // URL '/chatbot/send' sẽ được tự động nối với baseURL.
        const response = await apiClient.post<ChatbotResponse>('/chatbot/send', {
            message: message,
            session_id: sessionId,
        });

        // Dữ liệu trả về từ backend đã khớp với type ChatbotResponse
        return response.data;

    } catch (error) {
        console.error('Lỗi khi gọi API Chatbot:', error);
        // Trả về một thông báo lỗi và session ID hiện tại để duy trì phiên
        return {
            response: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
            session_id: sessionId || '',
        };
    }
};