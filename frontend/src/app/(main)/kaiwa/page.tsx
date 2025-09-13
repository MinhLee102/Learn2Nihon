'use client'; 

import React, { useEffect } from 'react'; 
import Chatbox from '@/components/Chat/Chatbox';
import { useLayout } from '@/context/LayoutContext';

export default function ChatbotPage() { 
  const { setHeaderTitle } = useLayout(); 

  useEffect(() => {
    setHeaderTitle('Kaiwa'); 
  }, [setHeaderTitle]);

  return (
    <div className="flex flex-col flex-1 p-0 bg-gray-50 rounded-lg overflow-hidden">
      <Chatbox />
    </div>
  );
}