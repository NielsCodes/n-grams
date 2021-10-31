export type LanguageCodes = 'NL' | 'EN' | 'FR' | 'DE' | 'IT' | 'SP';

export interface LanguageModel {
  TOTAL: number;
  [key: string]: number;
}
