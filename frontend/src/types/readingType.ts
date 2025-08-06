export interface ReadingContent {
  id: number;
  title: string;
  content: string; 
  questions: Question[];
}

export interface Question {
  id: string;
  question_text: string;
  answers: Answer[];
  explanation?: string; 
  user_selected_answer_id?: string; 
}

export interface Answer {
  id: string;
  text: string;
  is_correct?: boolean; 
}

export interface UseReadingLogicProps {
  readingId: number; 
}


