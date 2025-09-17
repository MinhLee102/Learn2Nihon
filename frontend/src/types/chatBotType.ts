

export interface ChatMessages {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export interface ChatbotResponse {
  response: string; 
  session_id: string;
}

export interface SpeechToTextResponse {
  transcription: string; 
}