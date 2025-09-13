export interface ChatMessages {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export interface ChatbotResponse {
  response_text: string; 
}

export interface SpeechToTextResponse {
  transcribed_text: string; 
}