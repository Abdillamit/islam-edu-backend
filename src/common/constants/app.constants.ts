import { Language } from '@prisma/client';

export const DEFAULT_LANGUAGE: Language = Language.ru;
export const SUPPORTED_LANGUAGES: ReadonlyArray<Language> = [
  Language.ky,
  Language.ru,
];
