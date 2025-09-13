export interface Kanji {
  id: number;
  word: string;
  kunyomi: string[] | null;
  onyomi: string[] | null;
  strokes: number;
  meaning: string;
  jlpt_level: string;
  explain: string[] | null;
}