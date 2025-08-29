export interface ReadingContent {
  id: string;
  title: string;
  content: string; 
  questions: Question[];
}

export interface Question {
  id: string;
  question_text: string;
  answers: Answer[];
  explanation?: string; 
}

export interface Answer {
  id: string;
  text: string;
  is_correct?: boolean; 
}

export interface UseReadingLogicProps {
  readingId: string; 
  initialData?: ReadingContent;
}

export interface ReadingPageProps {
  params: Promise<{ id: string }>
}


