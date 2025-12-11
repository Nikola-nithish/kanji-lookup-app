import { describe, test, expect, beforeAll } from '@jest/globals';
import {
  romajiToKana,
  isRomaji,
  containsKanji,
  isKana,
  extractKanji,
  normalizeWidth,
  getDictionaryForm,
  normalizeInput,
  initializeTokenizer
} from '../services/normalization.js';

beforeAll(async () => {
  await initializeTokenizer();
}, 30000);

describe('Normalization Service', () => {
  describe('romajiToKana', () => {
    test('converts romaji to hiragana', () => {
      expect(romajiToKana('kaeru')).toBe('かえる');
      expect(romajiToKana('kaesu')).toBe('かえす');
      expect(romajiToKana('souji')).toBe('そうじ');
    });

    test('handles mixed case', () => {
      expect(romajiToKana('Kaeru')).toBe('かえる');
      expect(romajiToKana('KAERU')).toBe('かえる');
    });
  });

  describe('isRomaji', () => {
    test('identifies romaji text', () => {
      expect(isRomaji('kaeru')).toBe(true);
      expect(isRomaji('to return')).toBe(true);
      expect(isRomaji('souji')).toBe(true);
    });

    test('rejects non-romaji text', () => {
      expect(isRomaji('帰る')).toBe(false);
      expect(isRomaji('かえる')).toBe(false);
      expect(isRomaji('カエル')).toBe(false);
      expect(isRomaji('123')).toBe(false);
    });
  });

  describe('containsKanji', () => {
    test('detects kanji characters', () => {
      expect(containsKanji('帰')).toBe(true);
      expect(containsKanji('帰る')).toBe(true);
      expect(containsKanji('帰られました')).toBe(true);
      expect(containsKanji('掃除')).toBe(true);
    });

    test('rejects text without kanji', () => {
      expect(containsKanji('かえる')).toBe(false);
      expect(containsKanji('カエル')).toBe(false);
      expect(containsKanji('kaeru')).toBe(false);
    });
  });

  describe('isKana', () => {
    test('identifies kana-only text', () => {
      expect(isKana('かえる')).toBe(true);
      expect(isKana('カエル')).toBe(true);
      expect(isKana('そうじ')).toBe(true);
    });

    test('rejects non-kana text', () => {
      expect(isKana('帰る')).toBe(false);
      expect(isKana('kaeru')).toBe(false);
      expect(isKana('帰')).toBe(false);
    });
  });

  describe('extractKanji', () => {
    test('extracts kanji from text', () => {
      expect(extractKanji('帰')).toEqual(['帰']);
      expect(extractKanji('帰る')).toEqual(['帰']);
      expect(extractKanji('帰られました')).toEqual(['帰']);
      expect(extractKanji('掃除')).toEqual(['掃', '除']);
    });

    test('returns empty array for text without kanji', () => {
      expect(extractKanji('かえる')).toEqual([]);
      expect(extractKanji('kaeru')).toEqual([]);
    });
  });

  describe('normalizeWidth', () => {
    test('converts fullwidth ASCII to halfwidth', () => {
      expect(normalizeWidth('ａｂｃ')).toBe('abc');
      expect(normalizeWidth('１２３')).toBe('123');
    });

    test('leaves other characters unchanged', () => {
      expect(normalizeWidth('帰る')).toBe('帰る');
      expect(normalizeWidth('かえる')).toBe('かえる');
    });
  });

  describe('getDictionaryForm', () => {
    test('extracts dictionary form from conjugated verb', async () => {
      const result = await getDictionaryForm('帰られました');
      expect(result.uniqueForms).toContain('帰る');
    }, 10000);

    test('handles simple word', async () => {
      const result = await getDictionaryForm('帰る');
      expect(result.uniqueForms).toContain('帰る');
    }, 10000);

    test('handles compound word', async () => {
      const result = await getDictionaryForm('掃除');
      expect(result.tokens).toBeDefined();
      expect(result.tokens.length).toBeGreaterThan(0);
    }, 10000);
  });

  describe('normalizeInput', () => {
    test('normalizes romaji input', async () => {
      const result = await normalizeInput('kaeru');
      expect(result.isRomaji).toBe(true);
      expect(result.normalized).toBe('かえる');
    }, 10000);

    test('extracts kanji from conjugated form', async () => {
      const result = await normalizeInput('帰られました');
      expect(result.containsKanji).toBe(true);
      expect(result.kanjiChars).toContain('帰');
      expect(result.dictionaryInfo.uniqueForms).toContain('帰る');
    }, 10000);

    test('handles direct kanji input', async () => {
      const result = await normalizeInput('帰');
      expect(result.containsKanji).toBe(true);
      expect(result.kanjiChars).toContain('帰');
    }, 10000);

    test('handles compound kanji', async () => {
      const result = await normalizeInput('掃除');
      expect(result.containsKanji).toBe(true);
      expect(result.kanjiChars).toEqual(['掃', '除']);
    }, 10000);
  });
});
