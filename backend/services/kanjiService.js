import { normalizeInput, extractKanji } from './normalization.js';
import {
  initializeData,
  getKanjiInfo,
  getVocabForKanji,
  getVocabByReading,
  getVocabByWord,
  searchVocabByGloss,
  getStrokeOrderSVG,
  getRelatedByRadical,
  getRelatedByComponent
} from './dataService.js';

// Initialize data on module load
initializeData();

/**
 * Build kanji result object with all metadata
 */
function buildKanjiResult(character, kanjiInfo) {
  if (!kanjiInfo) return null;
  
  // Get stroke order SVG
  const strokeOrderSVG = getStrokeOrderSVG(character);
  
  // Get example words
  const vocabList = getVocabForKanji(character);
  const exampleWords = vocabList.slice(0, 10).map(vocab => ({
    word: vocab.word,
    reading: vocab.reading,
    gloss: vocab.gloss
  }));
  
  // Get related kanji
  const relatedByRadical = getRelatedByRadical(kanjiInfo.radical)
    .filter(k => k !== character)
    .slice(0, 5);
  
  const relatedByComponents = new Set();
  kanjiInfo.components.forEach(comp => {
    const related = getRelatedByComponent(comp);
    related.forEach(k => {
      if (k !== character) {
        relatedByComponents.add(k);
      }
    });
  });
  
  return {
    kanji: character,
    stroke_order_svg: strokeOrderSVG || null,
    stroke_count: kanjiInfo.stroke_count,
    radical: kanjiInfo.radical,
    components: kanjiInfo.components,
    onyomi: kanjiInfo.onyomi,
    kunyomi: kanjiInfo.kunyomi,
    meanings: kanjiInfo.meanings,
    jlpt_level: kanjiInfo.jlpt_level,
    joyo_rank: kanjiInfo.joyo_rank,
    grade: kanjiInfo.grade,
    frequency: kanjiInfo.freq,
    example_words: exampleWords,
    related_kanji: [...new Set([...relatedByRadical, ...relatedByComponents])].slice(0, 10),
    source_ids: kanjiInfo.source_ids
  };
}

/**
 * Main lookup function
 */
export async function lookupKanji(query) {
  const normalized = await normalizeInput(query);
  const results = [];
  const seenKanji = new Set();
  
  // Case 1: Direct kanji character(s) in input
  if (normalized.kanjiChars.length > 0) {
    for (const char of normalized.kanjiChars) {
      if (!seenKanji.has(char)) {
        const kanjiInfo = getKanjiInfo(char);
        const result = buildKanjiResult(char, kanjiInfo);
        if (result) {
          results.push(result);
          seenKanji.add(char);
        }
      }
    }
  }
  
  // Case 2: Lookup from dictionary forms (conjugated verbs/adjectives)
  if (normalized.dictionaryInfo) {
    for (const dictionaryForm of normalized.dictionaryInfo.uniqueForms) {
      // Look up vocabulary by dictionary form
      const vocab = getVocabByWord(dictionaryForm);
      
      vocab.forEach(v => {
        if (v.kanji) {
          v.kanji.forEach(char => {
            if (!seenKanji.has(char)) {
              const kanjiInfo = getKanjiInfo(char);
              const result = buildKanjiResult(char, kanjiInfo);
              if (result) {
                results.push(result);
                seenKanji.add(char);
              }
            }
          });
        }
      });
    }
  }
  
  // Case 3: Kana lookup (hiragana/katakana from romaji or direct kana input)
  if (normalized.isKana || normalized.isRomaji) {
    const vocabByReading = getVocabByReading(normalized.normalized);
    
    vocabByReading.forEach(v => {
      if (v.kanji) {
        v.kanji.forEach(char => {
          if (!seenKanji.has(char)) {
            const kanjiInfo = getKanjiInfo(char);
            const result = buildKanjiResult(char, kanjiInfo);
            if (result) {
              results.push(result);
              seenKanji.add(char);
            }
          }
        });
      }
    });
  }
  
  // Case 4: English gloss search
  // Check if input looks like English (only ASCII letters and spaces)
  if (/^[a-zA-Z\s]+$/.test(query)) {
    const vocabByGloss = searchVocabByGloss(query);
    
    vocabByGloss.forEach(v => {
      if (v.kanji) {
        v.kanji.forEach(char => {
          if (!seenKanji.has(char)) {
            const kanjiInfo = getKanjiInfo(char);
            const result = buildKanjiResult(char, kanjiInfo);
            if (result) {
              results.push(result);
              seenKanji.add(char);
            }
          }
        });
      }
    });
  }
  
  return results;
}
