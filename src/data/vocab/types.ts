export type VocabCategory =
  | 'Algebra'
  | 'Advanced Math'
  | 'Problem-Solving and Data Analysis'
  | 'Geometry and Trigonometry'
  | 'General Math & Logic';

export type VocabPartOfSpeech = 'noun' | 'verb' | 'adjective' | 'phrase';

export interface VocabTerm {
  id: string;
  word: string;
  ipa: string;
  category: VocabCategory;
  topic: string;
  partOfSpeech: VocabPartOfSpeech;
  translationUz: string;
  translationRu: string;
  definition: string;
  example: string;
  exampleTranslationUz: string;
  exampleTranslationRu: string;
}
