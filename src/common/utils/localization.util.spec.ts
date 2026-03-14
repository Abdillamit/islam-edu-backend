import { Language } from '@prisma/client';
import { pickTranslation, resolveLanguage } from './localization.util';

describe('localization util', () => {
  it('resolves supported languages and falls back to ru', () => {
    expect(resolveLanguage('ky')).toBe(Language.ky);
    expect(resolveLanguage('ru')).toBe(Language.ru);
    expect(resolveLanguage('en')).toBe(Language.ru);
  });

  it('picks preferred translation with ru fallback', () => {
    const translations = [
      { lang: Language.ru, value: 'ru-content' },
      { lang: Language.ky, value: 'ky-content' },
    ];

    expect(pickTranslation(translations, Language.ky)?.value).toBe(
      'ky-content',
    );
    expect(pickTranslation(translations, Language.ru)?.value).toBe(
      'ru-content',
    );
  });
});
