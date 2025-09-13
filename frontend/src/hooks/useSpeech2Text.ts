'use client';

import { useState, useRef, useCallback } from 'react';
import { getAzureTranscription } from '@/lib/chatbotApi';

interface UseAzureSpeechResult {
  isRecording: boolean;
  transcript: string;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  error: string | null;
}

const useAzureSpeech = (): UseAzureSpeechResult => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const processAudioChunk = useCallback(async (audioBlob: Blob) => {
    setError(null);
    try {
      // Gửi audio blob đến backend
      const response = await getAzureTranscription(audioBlob);
      if (response?.transcribed_text) {
        setTranscript(response.transcribed_text); 
      }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Lỗi xử lý âm thanh Azure.");
        }
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioChunk(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript(''); 
      console.log("Recording started...");
    } catch (err: unknown) {
      setError("Không thể truy cập microphone. Vui lòng cấp quyền.");
      console.error("Error accessing microphone:", err);
    }
  }, [processAudioChunk]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); 
      setIsRecording(false);
      console.log("Recording stopped.");
    }
  }, [isRecording]);

  return { isRecording, transcript, startRecording, stopRecording, error };
};

export default useAzureSpeech;