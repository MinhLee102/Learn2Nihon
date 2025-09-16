'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import useAzureSpeech from '@/hooks/useSpeech2Text';
import type { SearchRequest, SearchType, DictionaryDirection } from '@/types/dictionaryType';
import Picture from '../Picture';

interface SearchBarProps {
  onSearch: (searchData: SearchRequest) => void;
  currentSearchType: SearchType;
  currentDirection: DictionaryDirection;
  onSearchTypeChange: (type: SearchType) => void;
  onDirectionChange: (direction: DictionaryDirection) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  currentSearchType,
  currentDirection,
  onSearchTypeChange,
  onDirectionChange,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const { isRecording, transcript, startRecording, stopRecording, error: speechError } = useAzureSpeech();

  useEffect(() => {
    if (transcript && isRecording) {
      setSearchTerm(transcript);
    }
  }, [transcript, isRecording]);

  const handleTextSearchSubmit = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;

    onSearch({
      content: searchTerm.trim(),
      type: currentSearchType,
      direction: currentDirection,
    });
    inputRef.current?.focus();
  }, [searchTerm, currentSearchType, currentDirection, onSearch]);

  const handleVoiceButtonClick = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
      if (searchTerm.trim()) {
        onSearch({
          content: searchTerm.trim(),
          type: currentSearchType,
          direction: currentDirection,
        });
      }
      setSearchTerm('');
      inputRef.current?.focus();
    } else {
      setSearchTerm('');
      await startRecording();
    }
  }, [isRecording, stopRecording, startRecording, searchTerm, currentSearchType, currentDirection, onSearch]);

  const displayedSearchTypes: SearchType[] = ['vocabulary']; // CHỈ HIỂN THỊ TỪ VỰNG
  const displayedDirections: DictionaryDirection[] = ['jp-vi']; // CHỈ HIỂN THỊ NHẬT - VIỆT

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Search Input Bar */}
      <form onSubmit={handleTextSearchSubmit} className="flex items-center border border-gray-300 rounded-full 
      p-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-400 text-black">
        <button type="button" className="p-2 rounded-full text-gray-600 ml-1" onClick={handleVoiceButtonClick} disabled={isLoading}>
          {isRecording ? <Picture url="/rec-button.png" width={20} height={20} alt='microphone'/> : 
          <Picture url="/microphone.png" width={20} height={20} alt='microphone'/>}
        </button>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isRecording ? "Đang nghe..." : "日本語, nihon, Nhật Bản"}
          className="flex-1 py-2 px-3 focus:outline-none bg-transparent"
          disabled={isLoading}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-full mr-1 hover:bg-blue-600 transition-colors" disabled={!searchTerm.trim() || isLoading}>
          <Picture url='/send.png' width={20} height={20} alt='send' />
        </button>
      </form>

      {/* Speech Error Display */}
      {speechError && (
        <p className="text-red-500 text-sm mt-2 text-center">Lỗi Voice Input: {speechError}</p>
      )}

      {/* Search Type Buttons */}
      <div className="mt-4 flex flex-wrap gap-4 items-center"> {/* <-- Flex container mới, gap-4 để có khoảng cách */}
        {/* Nút Hướng (Nhật - Việt) */}
        <div className="flex flex-wrap gap-2"> {/* Giữ flex-wrap cho các nút con */}
          {displayedDirections.map((dir) => ( 
            <button
              key={dir}
              onClick={() => onDirectionChange(dir)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentDirection === dir ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              disabled={isLoading}
            >
              {dir === 'jp-vi' ? 'Nhật - Việt' : dir === 'vi-jp' ? 'Việt - Nhật' : 'Nhật - Nhật'}
            </button>
          ))}
        </div>

        {/* Nút Loại Tra Cứu (Từ vựng) */}
        <div className="flex flex-wrap gap-2"> {/* Giữ flex-wrap cho các nút con */}
          {displayedSearchTypes.map((type) => ( 
            <button
              key={type}
              onClick={() => onSearchTypeChange(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentSearchType === type ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              disabled={isLoading}
            >
              {type === 'vocabulary' ? 'Từ vựng' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;