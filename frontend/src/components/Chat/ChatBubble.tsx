'use client';

import React from 'react';
import type { ChatMessages } from '@/types/chatBotType';
import ReactMarkdown from 'react-markdown';


interface ChatBubbleProps {
  message: ChatMessages;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const bubbleClass = message.isUser
    ? 'bg-blue-500 text-white self-end rounded-br-none' 
    : 'bg-gray-200 text-gray-800 self-start rounded-bl-none'; 

  return (
    <div className={`flex w-full ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-4 py-2 my-1 rounded-lg shadow-sm ${bubbleClass}`}
      >
        <div className="whitespace-pre-wrap">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>

        <span className="text-xs text-opacity-75 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>

      </div>
    </div>
  );
};

export default ChatBubble;