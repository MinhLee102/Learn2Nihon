export interface DictionaryExample {
  jp?: string; 
  vi?: string; 
}

export interface DictionaryMeaningDetail {
  meaning: string; // Nghĩa tiếng Việt
  examples: DictionaryExample[]; // Danh sách các câu ví dụ
}

export interface DictionaryEntry {
  id: number; // <-- ID là number
  word: string; // Từ tiếng Nhật
  phonetic?: string; // <-- Thay thế hiragana/katakana bằng phonetic
  han_viet?: string; // Hán Việt
  pronunciation?: string; // Phát âm
  type_word?: string; // <-- Thay thế part_of_speech bằng type_word
  meanings: DictionaryMeaningDetail[]; 
}


// Kiểu dữ liệu cho response từ API tra cứu
export interface SearchResponse {
  results: DictionaryEntry[]; // Các kết quả tìm được
}

// Kiểu dữ liệu cho request gửi đến API tra cứu
export type SearchType = 'vocabulary' | 'kanji' | 'phrase' | 'grammar';
export type DictionaryDirection = 'jp-vi' | 'vi-jp' | 'jp-jp';

export interface SearchRequest {
  content: string; // Nội dung người dùng nhập
  type: SearchType; // Loại tra cứu (từ vựng, kanji...)
  direction: DictionaryDirection; // Hướng tra cứu (Nhật-Việt, Việt-Nhật...)
}