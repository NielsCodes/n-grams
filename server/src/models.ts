export type LanguageCode = 'NL' | 'EN' | 'FR' | 'DE' | 'IT' | 'SP';

export interface LanguageModel {
  trigrams: LanguageSubModel;
  bigrams: LanguageSubModel;
  unigrams: LanguageSubModel;
  [key: string]: LanguageSubModel;
}

export interface LanguageSubModel {
  TOTAL: number;
  [key: string]: number;
}

export interface LanguageChances {
  DE: number;
  FR: number;
  EN: number;
  IT: number;
}
