import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import xml2js from 'xml2js';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/kanji.db');

// Database connection (lazy initialized)
let db = null;
let useDatabase = false;

// In-memory cache for parsed data (used when database is not available)
let kanjiData = new Map();
let vocabData = new Map();
let kanjiVGData = new Map();
let radicalIndex = new Map();
let componentIndex = new Map();

/**
 * Initialize database connection if available
 */
function initializeDatabase() {
  if (db !== null) return useDatabase;
  
  try {
    if (fs.existsSync(DB_PATH)) {
      db = new Database(DB_PATH, { readonly: true });
      useDatabase = true;
      console.log('Using SQLite database for kanji data');
    } else {
      console.log('SQLite database not found, using sample data');
      useDatabase = false;
    }
  } catch (error) {
    console.error('Error opening database:', error);
    useDatabase = false;
  }
  
  return useDatabase;
}

/**
 * Load sample kanji data (embedded for demo purposes)
 * In production, this would parse KANJIDIC2 XML
 */
export function loadKanjiData() {
  if (kanjiData.size > 0) return kanjiData;
  
  // Sample data for common kanji including 帰
  const sampleKanji = [
    {
      character: '帰',
      stroke_count: 10,
      radical: '⻌',
      components: ['尸', '𠆢', '帚'],
      onyomi: ['キ'],
      kunyomi: ['かえ.る', 'かえ.す', 'おく.る', 'とつ.ぐ'],
      meanings: ['return', 'go back', 'send back', 'restore'],
      jlpt_level: 3,
      joyo_rank: 488,
      grade: 2,
      freq: 698,
      source_ids: {
        kanjidic: '5E30',
        unicode: 'U+5E30'
      }
    },
    {
      character: '還',
      stroke_count: 16,
      radical: '⻌',
      components: ['⻌', '雚'],
      onyomi: ['カン', 'ゲン'],
      kunyomi: ['かえ.る'],
      meanings: ['return', 'give back'],
      jlpt_level: 2,
      joyo_rank: 1423,
      grade: 8,
      freq: 1500,
      source_ids: {
        kanjidic: '9084',
        unicode: 'U+9084'
      }
    },
    {
      character: '送',
      stroke_count: 9,
      radical: '⻌',
      components: ['⻌', '关'],
      onyomi: ['ソウ'],
      kunyomi: ['おく.る'],
      meanings: ['send', 'escort', 'see off'],
      jlpt_level: 4,
      joyo_rank: 415,
      grade: 3,
      freq: 421,
      source_ids: {
        kanjidic: '9001',
        unicode: 'U+9001'
      }
    },
    {
      character: '掃',
      stroke_count: 11,
      radical: '手',
      components: ['手', '帚'],
      onyomi: ['ソウ'],
      kunyomi: ['は.く'],
      meanings: ['sweep', 'clean'],
      jlpt_level: 2,
      joyo_rank: 1156,
      grade: 8,
      freq: 2035,
      source_ids: {
        kanjidic: '6383',
        unicode: 'U+6383'
      }
    },
    {
      character: '箒',
      stroke_count: 14,
      radical: '竹',
      components: ['竹', '帚'],
      onyomi: ['ソウ'],
      kunyomi: ['ほうき'],
      meanings: ['broom'],
      jlpt_level: null,
      joyo_rank: null,
      grade: null,
      freq: null,
      source_ids: {
        kanjidic: '7B92',
        unicode: 'U+7B92'
      }
    }
  ];
  
  sampleKanji.forEach(kanji => {
    kanjiData.set(kanji.character, kanji);
    
    // Build radical index
    if (!radicalIndex.has(kanji.radical)) {
      radicalIndex.set(kanji.radical, []);
    }
    radicalIndex.get(kanji.radical).push(kanji.character);
    
    // Build component index
    kanji.components.forEach(comp => {
      if (!componentIndex.has(comp)) {
        componentIndex.set(comp, []);
      }
      componentIndex.get(comp).push(kanji.character);
    });
  });
  
  return kanjiData;
}

/**
 * Load sample vocabulary data
 * In production, this would parse JMdict
 */
export function loadVocabData() {
  if (vocabData.size > 0) return vocabData;
  
  const sampleVocab = [
    {
      word: '帰る',
      reading: 'かえる',
      gloss: 'to return; to go back; to come back; to go home',
      kanji: ['帰'],
      pos: ['v5r', 'vi'],
      source_ids: {
        jmdict: '1375620'
      }
    },
    {
      word: '帰す',
      reading: 'かえす',
      gloss: 'to send back; to return; to dismiss',
      kanji: ['帰'],
      pos: ['v5s', 'vt'],
      source_ids: {
        jmdict: '1375630'
      }
    },
    {
      word: '帰国',
      reading: 'きこく',
      gloss: 'return to one\'s country; repatriation',
      kanji: ['帰', '国'],
      pos: ['n', 'vs'],
      source_ids: {
        jmdict: '1375650'
      }
    },
    {
      word: '帰宅',
      reading: 'きたく',
      gloss: 'returning home',
      kanji: ['帰', '宅'],
      pos: ['n', 'vs'],
      source_ids: {
        jmdict: '1375680'
      }
    },
    {
      word: '送る',
      reading: 'おくる',
      gloss: 'to send; to dispatch; to forward',
      kanji: ['送'],
      pos: ['v5r', 'vt'],
      source_ids: {
        jmdict: '1596690'
      }
    },
    {
      word: '掃除',
      reading: 'そうじ',
      gloss: 'cleaning; sweeping',
      kanji: ['掃', '除'],
      pos: ['n', 'vs'],
      source_ids: {
        jmdict: '1370520'
      }
    },
    {
      word: '掃く',
      reading: 'はく',
      gloss: 'to sweep; to brush',
      kanji: ['掃'],
      pos: ['v5k', 'vt'],
      source_ids: {
        jmdict: '1370510'
      }
    }
  ];
  
  sampleVocab.forEach(vocab => {
    const key = vocab.word;
    if (!vocabData.has(key)) {
      vocabData.set(key, []);
    }
    vocabData.get(key).push(vocab);
    
    // Also index by reading
    const readingKey = vocab.reading;
    if (!vocabData.has(readingKey)) {
      vocabData.set(readingKey, []);
    }
    vocabData.get(readingKey).push(vocab);
  });
  
  return vocabData;
}

/**
 * Load sample KanjiVG data
 * In production, this would parse KanjiVG SVG files
 */
export function loadKanjiVGData() {
  if (kanjiVGData.size > 0) return kanjiVGData;
  
  // Sample SVG stroke order data
  const sampleSVG = {
    '帰': `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_05e30" style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;">
<g id="kvg:05e30">
<path id="kvg:05e30-s1" d="M22.5,20.75c2.75,0.62,5.25,0.5,8,0.25c9.25-0.88,32.88-3.62,45-4.25c2.75-0.14,5.5-0.12,8.25,0.5"/>
<path id="kvg:05e30-s2" d="M40,22c0.88,0.88,1.38,2,1.5,3.25c0.75,7.5,1.25,13.5,1.75,19"/>
<path id="kvg:05e30-s3" d="M62,20.5c-0.5,1.25-0.88,2.25-1.38,3.75c-0.88,2.62-1.5,10.12-2.12,15.25"/>
<path id="kvg:05e30-s4" d="M15.25,46.5c3,0.62,5.88,0.38,8.5,0.12c11.25-1.12,43.88-4.12,58.25-4.75c2.88-0.12,5.62,0,8.5,0.62"/>
<path id="kvg:05e30-s5" d="M53.25,46.75c0.88,0.88,1.25,2,1.25,3.5c0,7.5-0.12,27.88-0.12,37.5"/>
<path id="kvg:05e30-s6" d="M25.75,61.5c2.88,0.88,6,0.62,8.88,0.38c9.62-0.75,27.5-2.5,37.62-3c2.75-0.12,5.5-0.12,8.25,0.5"/>
<path id="kvg:05e30-s7" d="M18.75,78c3.12,0.88,6.5,0.62,9.5,0.38c12.88-1,44.88-3.12,59.25-3.75c3-0.12,6,0,9,0.62"/>
<path id="kvg:05e30-s8" d="M54.5,78.5c0.12,1,0,1.88-0.38,2.88c-2.25,6-9.75,15.75-21.12,22.38"/>
<path id="kvg:05e30-s9" d="M54,81c5.88,4.12,20.75,14.75,27.5,18.88c2.25,1.38,4.5,2.25,7,2.75"/>
</g>
</g>
<g id="kvg:StrokeNumbers_05e30" style="font-size:8;fill:#808080">
<text transform="matrix(1 0 0 1 16 21)">1</text>
<text transform="matrix(1 0 0 1 33 30)">2</text>
<text transform="matrix(1 0 0 1 54 28)">3</text>
<text transform="matrix(1 0 0 1 8 47)">4</text>
<text transform="matrix(1 0 0 1 46 55)">5</text>
<text transform="matrix(1 0 0 1 19 62)">6</text>
<text transform="matrix(1 0 0 1 11 79)">7</text>
<text transform="matrix(1 0 0 1 38 87)">8</text>
<text transform="matrix(1 0 0 1 62 88)">9</text>
</g>
</svg>`,
    '送': '<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109"><g style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;"><path d="M25,20c2,1,4,0.5,6,0.25c8-1,30-3.5,40-4c2-0.1,4,0.5,5.5,1.25"/><path d="M40,22c0.5,1,1,2,1,3.5c0,7.5,0,14,0,19.5"/><path d="M15,48c3,0.5,6,0.5,9,0.25c15-1.25,45-4,60-4.5c2.5-0.1,5,0.25,7.5,0.75"/><path d="M52,48c0.5,1,1,2,1,3.5c0,15-0.5,32-0.5,38.5"/><path d="M53,76c8,5,20,15,26 18.5"/></g></svg>',
    '掃': '<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109"><g style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;"><path d="M15,25c2,1,4,0.5,6,0.25c10-1.25,35-3.5,45-4c2-0.1,4,0.5,5.5,1.25"/><path d="M25,28c0.5,1,1,2,1,3.5c0,10,0,18,0,25"/><path d="M12,56c3,0.5,6,0.5,9,0.25c18-1.5,50-4,65-4.5c2.5-0.1,5,0.25,7.5,0.75"/></g></svg>'
  };
  
  Object.entries(sampleSVG).forEach(([char, svg]) => {
    kanjiVGData.set(char, svg);
  });
  
  return kanjiVGData;
}

/**
 * Get kanji information by character
 */
export function getKanjiInfo(character) {
  if (!character || typeof character !== 'string') return null;
  
  initializeDatabase();
  
  // Try database first if it exists and has data
  if (useDatabase && db) {
    try {
      const stmt = db.prepare(`
        SELECT character, stroke_count, radical, grade, jlpt_level, frequency,
               onyomi, kunyomi, meanings, components
        FROM kanji
        WHERE character = ?
      `);
      const row = stmt.get(character);
      
      if (row) {
        return {
          character: row.character,
          stroke_count: row.stroke_count,
          radical: row.radical,
          grade: row.grade,
          jlpt_level: row.jlpt_level,
          freq: row.frequency,
          onyomi: row.onyomi ? JSON.parse(row.onyomi) : [],
          kunyomi: row.kunyomi ? JSON.parse(row.kunyomi) : [],
          meanings: row.meanings ? JSON.parse(row.meanings) : [],
          components: row.components ? JSON.parse(row.components) : [],
          source_ids: {
            unicode: `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`
          }
        };
      }
      
      // No result from database, fall back to sample data
    } catch (error) {
      console.error('Error fetching kanji info from database:', error);
    }
  }
  
  // Fallback to sample data
  if (kanjiData.size === 0) loadKanjiData();
  return kanjiData.get(character);
}

/**
 * Get vocabulary containing a specific kanji
 */
export function getVocabForKanji(character) {
  if (vocabData.size === 0) loadVocabData();
  
  const results = [];
  for (const [key, vocabList] of vocabData) {
    vocabList.forEach(vocab => {
      if (vocab.kanji && vocab.kanji.includes(character)) {
        results.push(vocab);
      }
    });
  }
  
  // Remove duplicates
  return [...new Map(results.map(v => [v.word, v])).values()];
}

/**
 * Get vocabulary by reading (kana)
 */
export function getVocabByReading(reading) {
  if (vocabData.size === 0) loadVocabData();
  return vocabData.get(reading) || [];
}

/**
 * Get vocabulary by word
 */
export function getVocabByWord(word) {
  if (vocabData.size === 0) loadVocabData();
  return vocabData.get(word) || [];
}

/**
 * Search vocabulary by English gloss
 */
export function searchVocabByGloss(englishTerm) {
  if (vocabData.size === 0) loadVocabData();
  
  const results = [];
  const searchTerm = englishTerm.toLowerCase();
  
  for (const [key, vocabList] of vocabData) {
    vocabList.forEach(vocab => {
      if (vocab.gloss && vocab.gloss.toLowerCase().includes(searchTerm)) {
        results.push(vocab);
      }
    });
  }
  
  // Remove duplicates
  return [...new Map(results.map(v => [v.word, v])).values()];
}

/**
 * Get stroke order SVG for a kanji
 */
export function getStrokeOrderSVG(character) {
  if (!character || typeof character !== 'string') return null;
  
  initializeDatabase();
  
  if (useDatabase && db) {
    try {
      const stmt = db.prepare('SELECT svg_data FROM kanjivg WHERE character = ?');
      const row = stmt.get(character);
      if (row) return row.svg_data;
      // No result from database, fall back to sample data
    } catch (error) {
      console.error('Error fetching SVG from database:', error);
    }
  }
  
  // Fallback to sample data
  if (kanjiVGData.size === 0) loadKanjiVGData();
  return kanjiVGData.get(character);
}

/**
 * Get related kanji by radical
 */
export function getRelatedByRadical(radical) {
  if (!radical || typeof radical !== 'string') return [];
  
  initializeDatabase();
  
  if (useDatabase && db) {
    try {
      const stmt = db.prepare('SELECT character FROM kanji WHERE radical = ?');
      const rows = stmt.all(radical);
      if (rows.length > 0) {
        return rows.map(row => row.character);
      }
      // No results from database, fall back to sample data
    } catch (error) {
      console.error('Error fetching kanji by radical from database:', error);
    }
  }
  
  // Fallback to sample data
  if (kanjiData.size === 0) loadKanjiData();
  return radicalIndex.get(radical) || [];
}

/**
 * Get related kanji by component
 */
export function getRelatedByComponent(component) {
  if (!component || typeof component !== 'string') return [];
  
  if (kanjiData.size === 0) loadKanjiData();
  return componentIndex.get(component) || [];
}

/**
 * Get radicals by stroke count
 */
export function getRadicalsByStrokeCount(strokeCount) {
  if (typeof strokeCount !== 'number' || strokeCount < 1) return [];
  
  initializeDatabase();
  
  if (useDatabase && db) {
    try {
      const stmt = db.prepare('SELECT radical, stroke_count, meaning, readings FROM radicals WHERE stroke_count = ? ORDER BY radical');
      const rows = stmt.all(strokeCount);
      return rows;
    } catch (error) {
      console.error('Error fetching radicals by stroke count from database:', error);
    }
  }
  
  // Fallback: no sample radical data available
  return [];
}

/**
 * Get all radicals grouped by stroke count
 */
export function getAllRadicals() {
  initializeDatabase();
  
  if (useDatabase && db) {
    try {
      const stmt = db.prepare('SELECT radical, stroke_count, meaning, readings FROM radicals ORDER BY stroke_count, radical');
      const rows = stmt.all();
      
      // Group by stroke count
      const grouped = {};
      for (const row of rows) {
        if (!grouped[row.stroke_count]) {
          grouped[row.stroke_count] = [];
        }
        grouped[row.stroke_count].push(row);
      }
      
      return grouped;
    } catch (error) {
      console.error('Error fetching all radicals from database:', error);
    }
  }
  
  // Fallback: no sample radical data available
  return {};
}

/**
 * Get all kanji containing a specific radical
 */
export function getKanjiByRadical(radical) {
  if (!radical || typeof radical !== 'string') return [];
  
  initializeDatabase();
  
  if (useDatabase && db) {
    try {
      const stmt = db.prepare(`
        SELECT character, stroke_count, radical, grade, jlpt_level, frequency, 
               onyomi, kunyomi, meanings, components
        FROM kanji 
        WHERE radical = ?
        ORDER BY frequency
      `);
      const rows = stmt.all(radical);
      
      if (rows.length > 0) {
        // Parse JSON fields
        return rows.map(row => ({
          character: row.character,
          stroke_count: row.stroke_count,
          radical: row.radical,
          grade: row.grade,
          jlpt_level: row.jlpt_level,
          frequency: row.frequency,
          onyomi: row.onyomi ? JSON.parse(row.onyomi) : [],
          kunyomi: row.kunyomi ? JSON.parse(row.kunyomi) : [],
          meanings: row.meanings ? JSON.parse(row.meanings) : [],
          components: row.components ? JSON.parse(row.components) : []
        }));
      }
      // No results from database, fall back to sample data
    } catch (error) {
      console.error('Error fetching kanji by radical from database:', error);
    }
  }
  
  // Fallback to sample data
  const relatedChars = getRelatedByRadical(radical);
  return relatedChars.map(char => {
    const info = getKanjiInfo(char);
    return info || { character: char };
  }).filter(k => k !== null);
}

/**
 * Initialize all data
 */
export function initializeData() {
  initializeDatabase();
  
  if (useDatabase) {
    console.log('Using SQLite database');
  } else {
    loadKanjiData();
    loadVocabData();
    loadKanjiVGData();
    console.log(`Loaded ${kanjiData.size} kanji, ${vocabData.size} vocab entries, ${kanjiVGData.size} stroke order diagrams`);
  }
}
