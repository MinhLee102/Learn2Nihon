export interface DictionaryExample {
  jp?: string; 
  vi?: string; 
}

export interface DictionarySense {
  english_definitions?: string[];
  vietnamese_definitions?: string[]; // Các định nghĩa tiếng Việt
  parts_of_speech: string[]; // Các loại từ
  source_examples: DictionaryExample[]; // Các câu ví dụ
  links: unknown[]; 
  tags: string[];
  restrictions: string[];
  see_also: string[];
  source: unknown[];
  info: unknown[];
  sentences?: unknown[];
}

// Kiểu dữ liệu cho response từ API tra cứu
export interface DictionaryJapaneseWord {
  word?: string; // Từ tiếng Nhật 
  reading?: string; // Cách đọc (hiragana/katakana)
}

export interface DictionaryEntry {
  slug: string; // "nhật-bản"
  is_common?: boolean;
  tags?: string[]; 
  jlpt?: string[]; 
  japanese: DictionaryJapaneseWord[]; // Có thể có nhiều cách viết/đọc
  senses: DictionarySense[]; // Có thể có nhiều nghĩa
  attribution?: unknown;
}

export interface DictionaryApiResponse {
  meta: {
    status: number;
    source: string;
  };
  data: DictionaryEntry[]; // Mảng các kết quả từ điển
}

export interface SearchResponse {
  results: DictionaryEntry[]; 
}

export type SearchType = 'vocabulary' | 'kanji' | 'phrase' | 'grammar';
export type DictionaryDirection = 'jp-vi' | 'vi-jp' | 'jp-jp';

export interface SearchRequest {
  content: string; 
  type: SearchType;
  direction: DictionaryDirection; 
}

