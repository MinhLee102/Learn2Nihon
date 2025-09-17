'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLayout } from '@/context/LayoutContext';
import SearchBar from '@/components/Dictionary/SearchBar'; // <-- Import SearchBar
import ImageCard from '@/components/Dictionary/ImageCard';
import { searchDictionary } from '@/lib/dictionaryApi'; // <-- Import API tra cứu
import type { SearchRequest, SearchType, DictionaryDirection, DictionaryEntry } from '@/types/dictionaryType';

const HomePage: React.FC = () => {
  const { setHeaderTitle } = useLayout();

  const [searchResults, setSearchResults] = useState<DictionaryEntry[] | null>(null); // <-- Dùng DictionaryEntry[]
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<SearchRequest | null>(null);

  const [currentSearchType, setCurrentSearchType] = useState<SearchType>('vocabulary'); 
  const [currentDirection, setCurrentDirection] = useState<DictionaryDirection>('jp-vi'); 

  useEffect(() => {
    setHeaderTitle('Welcome to Learn2Nihon!'); 
  }, [setHeaderTitle]);

  const handleSearch = useCallback(async (searchData: SearchRequest) => {
    setLoadingSearch(true);
    setSearchError(null);
    setSearchResults(null); 
    setLastSearchQuery(searchData);

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
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        {loadingSearch && (
          <div className="text-center text-gray-600">Đang tra cứu...</div>
        )}
        {searchError && (
          <div className="text-red-600 text-center">Lỗi: {searchError}</div>
        )}
        {searchResults && searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4 w-full max-w-4xl overflow-y-auto">
            {searchResults.map((dictionaryEntry) => ( 
              <div key={dictionaryEntry.slug} className="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
                {/* Từ tiếng Nhật chính và cách đọc */}
                <div className="flex items-center mb-2">
                  <h2 className="text-4xl font-bold text-blue-700 mr-2">
                    {dictionaryEntry.japanese[0]?.word || dictionaryEntry.slug} {/* <-- Truy cập dictionaryEntry.japanese */}
                  </h2>
                  {dictionaryEntry.japanese[0]?.reading && (
                    <p className="text-lg text-gray-600">({dictionaryEntry.japanese[0].reading})</p>
                  )}
                </div>

                {/* Các nghĩa và loại từ */}
                {dictionaryEntry.senses && dictionaryEntry.senses.length > 0 && ( // Lặp qua các senses
                  <div className="mt-2 pl-4">
                    {dictionaryEntry.senses.map((sense, sIndex) => ( // <-- Lặp qua senses
                      <div key={sIndex} className="mb-1">
                        {sense.parts_of_speech && sense.parts_of_speech.length > 0 && (
                            <p className="text-sm italic text-gray-500 mb-1">({sense.parts_of_speech.join(', ')})</p>
                        )}
                        
                        { sense.vietnamese_definitions && (
                          <p className="text-lg font-semibold text-gray-800">
                          ◆  {sense.vietnamese_definitions.join('; ')} {/* <-- Hiển thị định nghĩa */}
                          </p> )}


                        { sense.english_definitions && (
                          <p className="text-lg font-semibold text-gray-800">
                          ◆  {sense.english_definitions.join('; ')} {/* <-- Hiển thị định nghĩa */}
                          </p> )}
                        
                        {/* Các câu ví dụ */}
                        {sense.source_examples && sense.source_examples.length > 0 && ( // Lặp qua ví dụ của từng sense
                          <div className="mt-4 pl-4 border-l-2 border-gray-200">
                            <h4 className="text-md text-black font-semibold mb-2">Ví dụ:</h4>
                            {sense.source_examples.map((example, eIndex) => (
                              <div key={eIndex} className="mb-2">
                                {example.jp && <p className="text-md text-gray-800">{example.jp}</p>}
                                {example.vi && <p className="text-sm italic text-gray-600">» {example.vi}</p>}
                              </div>
                            ))}
                          </div>
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

        {/* Hai tấm ảnh - Chỉ hiển thị khi chưa có kết quả tìm kiếm */}
        {(!searchResults || searchResults.length === 0) && !loadingSearch && !searchError && (
            <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-6 mt-6">
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
    </div>
  );
};

export default HomePage;