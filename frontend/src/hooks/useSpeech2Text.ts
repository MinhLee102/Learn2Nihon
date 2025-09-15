
'use client';

import { useState, useRef, useCallback } from 'react';
import { getAzureTranscription } from '@/lib/chatbotApi';

interface UseAzureSpeechResult {
  isRecording: boolean;
  transcript: string; // Transcript đang được cập nhật (nếu API hỗ trợ)
  transcriptFinal: string; // Transcript cuối cùng khi ghi âm dừng
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  error: string | null;
}

const useAzureSpeech = (): UseAzureSpeechResult => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [transcriptFinal, setTranscriptFinal] = useState<string>(''); // State mới
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const processAudio = useCallback(async (audioBlob: Blob) => {
    setError(null);
    try {
      const response = await getAzureTranscription(audioBlob);
      if (response?.transcription) {
        setTranscriptFinal(response.transcription); // Cập nhật transcript cuối cùng
      } else {
        setError('Không nhận dạng được giọng nói.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi xử lý âm thanh.";
      setError(errorMessage);
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    setError(null);
    setTranscript('');
    setTranscriptFinal(''); // Reset transcript cuối cùng

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

        // 1. Thêm log để kiểm tra kích thước file audio
        console.log(`Audio blob created with size: ${audioBlob.size} bytes`);

        // 2. Thêm bộ lọc: Chỉ gửi đi nếu file audio có dung lượng hợp lệ (lớn hơn 1KB)
        if (audioBlob.size > 1000) {
            processAudio(audioBlob);
        } else {
            // Nếu file quá nhỏ, có thể người dùng chỉ bấm nhầm, không cần gửi lên server
            setError("Không thu được âm thanh. Vui lòng giữ nút và nói.");
            console.warn("Audio blob size is too small, skipping API call.");
        }

        stream.getTracks().forEach((track) => track.stop()); // Dọn dẹp stream
        audioChunksRef.current = []; // Reset chunks
      });

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started...");
    } catch (err) {
      setError("Không thể truy cập microphone. Vui lòng cấp quyền.");
      console.error("Error accessing microphone:", err);
    }
  }, [isRecording, processAudio]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped.");
    }
  }, []);

  return { isRecording, transcript, transcriptFinal, startRecording, stopRecording, error };
};

export default useAzureSpeech;