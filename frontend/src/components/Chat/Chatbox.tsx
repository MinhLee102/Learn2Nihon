'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sendChatMessageToAI } from '@/lib/chatbotApi'; // API gửi tin nhắn
import useAzureSpeech from '@/hooks/useSpeech2Text'; // Hook voice-to-text
import ChatBubble from './ChatBubble'; // Component tin nhắn
import type { ChatMessages } from '@/types/chatBotType'; // Import type
import Picture from '../Picture';


const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessages[]>([]);
    const [currentInput, setCurrentInput] = useState<string>('');
    const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { isRecording, transcript, startRecording, stopRecording, error: speechError } = useAzureSpeech();

    useEffect(() => {
        if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (transcript && isRecording) {
        setCurrentInput(transcript);
        }
        if (inputRef.current && !isLoadingAIResponse) { 
            inputRef.current.focus();
        }
    }, [transcript, isRecording, isLoadingAIResponse]);


  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    const newUserMessage: ChatMessages = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentInput(''); 
    setIsLoadingAIResponse(true); 

    try {
      const aiResponse = await sendChatMessageToAI(messageText, sessionId);
      
      const newAIMessage: ChatMessages = {
        id: Date.now().toString() + '-ai',
        text: aiResponse?.response || "Xin lỗi, tôi không hiểu. Bạn có thể nói rõ hơn không?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAIMessage]);
      // Cập nhật state sessionId với giá trị mới nhận được từ backend
      setSessionId(aiResponse.session_id);

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '-error',
          text: "Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoadingAIResponse(false); 
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [sessionId]);

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(currentInput);
  };

  const handleVoiceButtonClick = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
      if (currentInput.trim()) {
        await handleSendMessage(currentInput);
      }
      setCurrentInput('');
    } else {
      setCurrentInput(''); 
      await startRecording();
    }
  }, [isRecording, stopRecording, startRecording, currentInput, handleSendMessage]);

  return (
    <div className="flex flex-col h-[calc(100vh-90px)] bg-white rounded-2xl shadow-md">
        {/* Vùng hiển thị lịch sử chat */}
        <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
                Hãy bắt đầu trò chuyện với AI của Learn2Nihon!
            </div>
            )}
            {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
            ))}
            {isLoadingAIResponse && (
            <ChatBubble message={{ id: 'ai-loading', text: "AI đang suy nghĩ...", isUser: false, timestamp: new Date() }} />
            )}
            {speechError && (
            <div className="text-red-500 text-center p-2">Lỗi Voice Input: {speechError}</div>
            )}  
        </div>

        {/* Vùng nhập liệu */}
        <form onSubmit={handleInputSubmit} className="border-t border-gray-200 text-black flex p-2 pt-4 items-center bg-white rounded-2xl py-2">
            <button
            type="button"
            onClick={handleVoiceButtonClick}
            className={`p-2 rounded-full mr-2 transition-colors ${isRecording ? 'bg-red-500 text-black' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            disabled={isLoadingAIResponse}
            >
            {isRecording ? <Picture url='/rec-button.png' width={20} height={20} alt='recording' /> : 
            <Picture url= '/microphone.png' width={20} height={20} alt='micro'/>}

            </button>
            <input
            type="text"
            ref={inputRef}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={isRecording ? "Đang nghe..." : "Bạn muốn nói về chủ đề gì hôm nay..."}
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoadingAIResponse || isRecording} // Disable khi AI đang trả lời hoặc đang ghi âm
            />
            <button
            type="submit"
            className="p-2 bg-blue-500 text-black rounded-full ml-2 hover:bg-blue-600 transition-colors"
            aria-label="Send message"
            disabled={!currentInput.trim() || isLoadingAIResponse}
            >
            <Picture url='/send.png' width={20} height={20} alt='send' />
            </button>
        </form>
      </div>
  );
};

export default Chatbot;