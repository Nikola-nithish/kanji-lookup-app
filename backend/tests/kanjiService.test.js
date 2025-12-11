import { describe, test, expect, beforeAll } from '@jest/globals';
import { lookupKanji } from '../services/kanjiService.js';
import { initializeTokenizer } from '../services/normalization.js';

beforeAll(async () => {
  await initializeTokenizer();
}, 30000);

describe('Kanji Lookup Service - Acceptance Criteria', () => {
  test('Case 1: Direct kanji character 帰', async () => {
    const results = await lookupKanji('帰');
    
    expect(results).toHaveLength(1);
    expect(results[0].kanji).toBe('帰');
    expect(results[0].stroke_order_svg).toBeDefined();
    expect(results[0].stroke_count).toBe(10);
    expect(results[0].onyomi).toContain('キ');
    expect(results[0].meanings).toContain('return');
    expect(results[0].example_words).toBeDefined();
    expect(results[0].example_words.some(w => w.word === '帰る')).toBe(true);
  }, 10000);

  test('Case 2: Conjugated form 帰られました returns 帰', async () => {
    const results = await lookupKanji('帰られました');
    
    expect(results.length).toBeGreaterThan(0);
    const kanjiResult = results.find(r => r.kanji === '帰');
    expect(kanjiResult).toBeDefined();
    expect(kanjiResult.stroke_order_svg).toBeDefined();
    expect(kanjiResult.onyomi).toBeDefined();
    expect(kanjiResult.kunyomi).toBeDefined();
    expect(kanjiResult.meanings).toBeDefined();
    expect(kanjiResult.example_words.some(w => w.word === '帰る')).toBe(true);
  }, 10000);

  test('Case 3: Romaji kaeru returns 帰', async () => {
    const results = await lookupKanji('kaeru');
    
    expect(results.length).toBeGreaterThan(0);
    const kanjiResult = results.find(r => r.kanji === '帰');
    expect(kanjiResult).toBeDefined();
    expect(kanjiResult.meanings).toContain('return');
  }, 10000);

  test('Case 4: English "return" returns 帰', async () => {
    const results = await lookupKanji('return');
    
    expect(results.length).toBeGreaterThan(0);
    const kanjiResult = results.find(r => r.kanji === '帰');
    expect(kanjiResult).toBeDefined();
  }, 10000);

  test('Case 5: Compound word 掃除 returns both kanji', async () => {
    const results = await lookupKanji('掃除');
    
    expect(results.length).toBeGreaterThan(0);
    const souKanji = results.find(r => r.kanji === '掃');
    expect(souKanji).toBeDefined();
    expect(souKanji.components).toContain('帚');
  }, 10000);

  test('Case 6: Related kanji share components', async () => {
    const results = await lookupKanji('掃');
    
    expect(results).toHaveLength(1);
    expect(results[0].kanji).toBe('掃');
    expect(results[0].related_kanji).toBeDefined();
    // Should show other kanji with same components
    expect(results[0].related_kanji.length).toBeGreaterThan(0);
  }, 10000);

  test('Case 7: Results include source IDs', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].source_ids).toBeDefined();
    expect(results[0].source_ids.kanjidic).toBeDefined();
    expect(results[0].source_ids.unicode).toBeDefined();
  }, 10000);

  test('Case 8: Multiple kanji in input', async () => {
    const results = await lookupKanji('帰還');
    
    expect(results.length).toBe(2);
    expect(results.map(r => r.kanji)).toContain('帰');
    expect(results.map(r => r.kanji)).toContain('還');
  }, 10000);

  test('Case 9: Kanji with radical info', async () => {
    const results = await lookupKanji('送');
    
    expect(results).toHaveLength(1);
    expect(results[0].radical).toBe('⻌');
    expect(results[0].related_kanji).toContain('帰'); // Same radical
  }, 10000);

  test('Case 10: JLPT and Joyo info included', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].jlpt_level).toBe(3);
    expect(results[0].joyo_rank).toBeDefined();
  }, 10000);

  test('Case 11: Romaji with different readings', async () => {
    const results = await lookupKanji('sou');
    
    expect(results.length).toBeGreaterThan(0);
    // Should return kanji that match this reading
  }, 10000);

  test('Case 12: English word with multiple meanings', async () => {
    const results = await lookupKanji('send');
    
    expect(results.length).toBeGreaterThan(0);
    const souKanji = results.find(r => r.kanji === '送');
    expect(souKanji).toBeDefined();
  }, 10000);

  test('Case 13: Stroke count accuracy', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].stroke_count).toBe(10);
  }, 10000);

  test('Case 14: Onyomi readings in katakana', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].onyomi).toBeDefined();
    expect(results[0].onyomi.length).toBeGreaterThan(0);
  }, 10000);

  test('Case 15: Kunyomi readings with okurigana markers', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].kunyomi).toBeDefined();
    expect(results[0].kunyomi.length).toBeGreaterThan(0);
  }, 10000);

  test('Case 16: Example words include reading and gloss', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].example_words).toBeDefined();
    expect(results[0].example_words.length).toBeGreaterThan(0);
    expect(results[0].example_words[0].word).toBeDefined();
    expect(results[0].example_words[0].reading).toBeDefined();
    expect(results[0].example_words[0].gloss).toBeDefined();
  }, 10000);

  test('Case 17: Related kanji by radical', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].related_kanji).toContain('還');
    expect(results[0].related_kanji).toContain('送');
  }, 10000);

  test('Case 18: Components list', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].components).toBeDefined();
    expect(results[0].components.length).toBeGreaterThan(0);
  }, 10000);

  test('Case 19: Frequency ranking', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].frequency).toBeDefined();
    expect(typeof results[0].frequency).toBe('number');
  }, 10000);

  test('Case 20: Grade level for educational kanji', async () => {
    const results = await lookupKanji('帰');
    
    expect(results[0].grade).toBe(2);
  }, 10000);

  test('Case 21: Empty query returns empty results', async () => {
    const results = await lookupKanji('');
    
    expect(results).toEqual([]);
  }, 10000);

  test('Case 22: Unknown input returns empty results', async () => {
    const results = await lookupKanji('xyz123');
    
    expect(results).toEqual([]);
  }, 10000);
});
