'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLayout } from '@/context/LayoutContext';
import SearchBar from '@/components/Dictionary/SearchBar'; // <-- Import SearchBar
import ImageCard from '@/components/Dictionary/ImageCard';
import { searchDictionary } from '@/lib/dictionaryApi'; // <-- Import API tra cứu
import type { SearchRequest, SearchType, DictionaryDirection, DictionaryEntry } from '@/types/dictionaryType';

const HomePage: React.FC = () => {
  const { setHeaderTitle } = useLayout();

  const [searchResults, setSearchResults] = useState<DictionaryEntry[] | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<SearchRequest | null>(null); // Lưu lại query để hiển thị

  const [currentSearchType, setCurrentSearchType] = useState<SearchType>('vocabulary');
  const [currentDirection, setCurrentDirection] = useState<DictionaryDirection>('jp-vi');

  useEffect(() => {
    setHeaderTitle('Welcome to Learn2Nihon!'); 
  }, [setHeaderTitle]);

  const handleSearch = useCallback(async (searchData: SearchRequest) => {
    setLoadingSearch(true);
    setSearchError(null);
    setSearchResults(null);
    setLastSearchQuery(searchData); // Lưu query

    try {
      const response = await searchDictionary(searchData);
      if (response?.results) {
        setSearchResults(response.results);
      } else {
        setSearchResults([]);
        setSearchError("Không tìm thấy kết quả nào.");
      }
    } catch (err: unknown) {
      console.error("Error searching dictionary:", err);
      if (err instanceof Error) {
        setSearchError(err.message);
      } else {
        setSearchError("Đã xảy ra lỗi không xác định khi tra cứu.");
      }
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  const handleSearchTypeChange = useCallback((type: SearchType) => {
    setCurrentSearchType(type);
    setSearchResults(null);
  }, []);

  const handleDirectionChange = useCallback((direction: DictionaryDirection) => {
    setCurrentDirection(direction);
    setSearchResults(null);
  }, []);


  return (
    <div className="container mx-auto p-4 flex flex-col space-y-6 h-full">
      {/* Thanh Search */}
      <SearchBar
        onSearch={handleSearch}
        currentSearchType={currentSearchType}
        currentDirection={currentDirection}
        onSearchTypeChange={handleSearchTypeChange}
        onDirectionChange={handleDirectionChange}
        isLoading={loadingSearch}
      />

      {/* Hiển thị kết quả tìm kiếm (nếu có) */}
      {loadingSearch && (
        <div className="text-center text-gray-600">Đang tra cứu...</div>
      )}
      {searchError && (
        <div className="text-red-600 text-center">Lỗi: {searchError}</div>
      )}
      {searchResults && searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <h3 className="text-xl font-semibold mb-4">Kết quả tra cứu cho `{lastSearchQuery?.content}`:</h3> {/* <-- Hiển thị từ khóa tìm kiếm */}
          {searchResults.map((entry) => (
            <div key={entry.id} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
              <p className="text-2xl font-bold text-blue-700">{entry.word}</p> {/* <-- Dùng entry.word */}
              {entry.phonetic && <p className="text-gray-600">({entry.phonetic})</p>} {/* <-- Dùng entry.phonetic */}
              {entry.pronunciation && <p className="text-sm italic text-gray-500">Phát âm: {entry.pronunciation}</p>}
              {entry.han_viet && <p className="text-sm italic text-gray-500">Hán Việt: {entry.han_viet}</p>}
              {entry.type_word && <p className="text-sm italic text-gray-500">Loại từ: {entry.type_word}</p>} {/* <-- Dùng entry.type_word */}

              {entry.meanings && entry.meanings.length > 0 && ( // Lặp qua các nghĩa
                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                  {entry.meanings.map((meaningDetail, mIndex) => (
                    <div key={mIndex} className="mb-2"> {/* mIndex là ok cho key tạm thời nếu không có id */}
                      <p className="text-gray-800 font-medium">{mIndex + 1}. {meaningDetail.meaning}</p> {/* <-- Dùng meaningDetail.meaning */}
                      {meaningDetail.examples && meaningDetail.examples.length > 0 && ( // Lặp qua các ví dụ
                        <ul className="list-disc list-inside text-sm text-gray-700 mt-1 pl-4">
                          {meaningDetail.examples.map((example, eIndex) => (
                            <li key={eIndex}>
                              {example.jp && <span>{example.jp}</span>}
                              {example.jp && example.vi && <span> - </span>}
                              {example.vi && <span className="italic">{example.vi}</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {searchResults && searchResults.length === 0 && !loadingSearch && !searchError && (
          <div className="text-center text-gray-600 mt-4">Không tìm thấy kết quả nào cho `{lastSearchQuery?.content || 'từ khóa'}`</div>
      )}


      {!searchResults && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          {/* Quote Card */}
          <div className="w-full max-w-4xl rounded-3xl p-4 bg-white">
              <ImageCard
              imageUrl="/quote.jpg"
              altText="Mount Fuji with Cherry Blossoms"
              />
          </div>

          {/* Sakura Card */}
          <div className="w-full max-w-4xl rounded-3xl p-4 bg-white">
              <ImageCard
              imageUrl="/sakura.jpg"
              altText="Mount Fuji with Cherry Blossoms"
              />
          </div>
        </div>  
      )}
    </div>
  );
};

export default HomePage;