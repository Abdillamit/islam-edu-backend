import { Language } from '@prisma/client';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from '../constants/app.constants';

export function resolveLanguage(input?: string): Language {
  if (!input) {
    return DEFAULT_LANGUAGE;
  }

  const normalized = input.trim().toLowerCase() as Language;
  return SUPPORTED_LANGUAGES.includes(normalized)
    ? normalized
    : DEFAULT_LANGUAGE;
}

export function pickTranslation<T extends { lang: Language }>(
  translations: T[],
  lang: Language,
): T | null {
  if (translations.length === 0) {
    return null;
  }

  return (
    translations.find((translation) => translation.lang === lang) ??
    translations.find((translation) => translation.lang === DEFAULT_LANGUAGE) ??
    translations[0]
  );
}
