import wanakana from 'wanakana';
import kuromoji from 'kuromoji';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let tokenizer = null;

// Initialize Kuromoji tokenizer
export async function initializeTokenizer() {
  if (tokenizer) return tokenizer;
  
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: join(__dirname, '../../node_modules/kuromoji/dict') })
      .build((err, tok) => {
        if (err) {
          reject(err);
        } else {
          tokenizer = tok;
          resolve(tokenizer);
        }
      });
  });
}

/**
 * Convert romaji to hiragana/katakana
 */
export function romajiToKana(text) {
  return wanakana.toHiragana(text);
}

/**
 * Check if text is romaji (contains only ASCII letters and some symbols)
 */
export function isRomaji(text) {
  return /^[a-zA-Z\s\-']+$/.test(text);
}

/**
 * Check if text contains kanji characters
 */
export function containsKanji(text) {
  return /[\u4e00-\u9faf\u3400-\u4dbf]/.test(text);
}

/**
 * Check if text is hiragana/katakana only
 */
export function isKana(text) {
  return /^[\u3040-\u309f\u30a0-\u30ff]+$/.test(text);
}

/**
 * Extract kanji characters from text
 */
export function extractKanji(text) {
  const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/g;
  return text.match(kanjiRegex) || [];
}

/**
 * Normalize fullwidth/halfwidth characters
 */
export function normalizeWidth(text) {
  // Convert fullwidth ASCII to halfwidth
  return text.replace(/[\uff01-\uff5e]/g, (ch) => {
    return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
  });
}

/**
 * Use morphological analysis to get dictionary form of conjugated words
 */
export async function getDictionaryForm(text) {
  if (!tokenizer) {
    await initializeTokenizer();
  }
  
  const tokens = tokenizer.tokenize(text);
  const dictionaryForms = tokens.map(token => token.basic_form || token.surface_form);
  
  return {
    tokens,
    dictionaryForms,
    uniqueForms: [...new Set(dictionaryForms)]
  };
}

/**
 * Normalize input text for lookup
 */
export async function normalizeInput(text) {
  // Normalize width
  let normalized = normalizeWidth(text);
  
  // If it's romaji, convert to hiragana
  if (isRomaji(normalized)) {
    normalized = romajiToKana(normalized);
  }
  
  // Extract kanji characters
  const kanjiChars = extractKanji(normalized);
  
  // Get dictionary forms if text contains Japanese
  let dictionaryInfo = null;
  if (containsKanji(normalized) || isKana(normalized)) {
    dictionaryInfo = await getDictionaryForm(normalized);
  }
  
  return {
    original: text,
    normalized,
    kanjiChars,
    dictionaryInfo,
    isRomaji: isRomaji(text),
    containsKanji: containsKanji(normalized),
    isKana: isKana(normalized)
  };
}
