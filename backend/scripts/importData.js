import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/kanji.db');
const JMDICT_PATH = path.join(__dirname, '../data/jmdict-eng-3.6.1+20251208123023.json');
const KANJIVG_PATH = path.join(__dirname, '../data/kanjivg');

// 214 Kangxi Radicals with stroke counts and meanings
const KANGXI_RADICALS = [
  // 1 stroke
  { radical: '一', stroke_count: 1, meaning: 'one', readings: 'いち' },
  { radical: '丨', stroke_count: 1, meaning: 'line', readings: 'ぼう、たてぼう' },
  { radical: '丶', stroke_count: 1, meaning: 'dot', readings: 'てん' },
  { radical: '丿', stroke_count: 1, meaning: 'slash', readings: 'の、へつ' },
  { radical: '乙', stroke_count: 1, meaning: 'second', readings: 'おつ' },
  { radical: '亅', stroke_count: 1, meaning: 'hook', readings: 'はねぼう' },
  // 2 strokes
  { radical: '二', stroke_count: 2, meaning: 'two', readings: 'に' },
  { radical: '亠', stroke_count: 2, meaning: 'lid', readings: 'なべぶた' },
  { radical: '人', stroke_count: 2, meaning: 'person', readings: 'ひと、にんべん' },
  { radical: '儿', stroke_count: 2, meaning: 'legs', readings: 'ひとあし、にんにょう' },
  { radical: '入', stroke_count: 2, meaning: 'enter', readings: 'いる、いりがしら' },
  { radical: '八', stroke_count: 2, meaning: 'eight', readings: 'はち' },
  { radical: '冂', stroke_count: 2, meaning: 'open box', readings: 'けいがまえ、まきがまえ' },
  { radical: '冖', stroke_count: 2, meaning: 'cover', readings: 'わかんむり' },
  { radical: '冫', stroke_count: 2, meaning: 'ice', readings: 'にすい' },
  { radical: '几', stroke_count: 2, meaning: 'table', readings: 'つくえ' },
  { radical: '凵', stroke_count: 2, meaning: 'receptacle', readings: 'かんにょう、うけばこ' },
  { radical: '刀', stroke_count: 2, meaning: 'knife', readings: 'かたな' },
  { radical: '力', stroke_count: 2, meaning: 'power', readings: 'ちから' },
  { radical: '勹', stroke_count: 2, meaning: 'wrap', readings: 'つつみがまえ' },
  { radical: '匕', stroke_count: 2, meaning: 'spoon', readings: 'ひ' },
  { radical: '匚', stroke_count: 2, meaning: 'box', readings: 'はこがまえ' },
  { radical: '匸', stroke_count: 2, meaning: 'hiding enclosure', readings: 'かくしがまえ' },
  { radical: '十', stroke_count: 2, meaning: 'ten', readings: 'じゅう' },
  { radical: '卜', stroke_count: 2, meaning: 'divination', readings: 'ぼく、うらない' },
  { radical: '卩', stroke_count: 2, meaning: 'seal', readings: 'ふしづくり' },
  { radical: '厂', stroke_count: 2, meaning: 'cliff', readings: 'がんだれ' },
  { radical: '厶', stroke_count: 2, meaning: 'private', readings: 'む' },
  { radical: '又', stroke_count: 2, meaning: 'again', readings: 'また' },
  // 3 strokes
  { radical: '口', stroke_count: 3, meaning: 'mouth', readings: 'くち' },
  { radical: '囗', stroke_count: 3, meaning: 'enclosure', readings: 'くにがまえ' },
  { radical: '土', stroke_count: 3, meaning: 'earth', readings: 'つち' },
  { radical: '士', stroke_count: 3, meaning: 'scholar', readings: 'さむらい' },
  { radical: '夂', stroke_count: 3, meaning: 'go', readings: 'ふゆがしら、ちかんむり' },
  { radical: '夊', stroke_count: 3, meaning: 'go slowly', readings: 'すいにょう' },
  { radical: '夕', stroke_count: 3, meaning: 'evening', readings: 'ゆうべ' },
  { radical: '大', stroke_count: 3, meaning: 'big', readings: 'だい' },
  { radical: '女', stroke_count: 3, meaning: 'woman', readings: 'おんな' },
  { radical: '子', stroke_count: 3, meaning: 'child', readings: 'こ' },
  { radical: '宀', stroke_count: 3, meaning: 'roof', readings: 'うかんむり' },
  { radical: '寸', stroke_count: 3, meaning: 'inch', readings: 'すん' },
  { radical: '小', stroke_count: 3, meaning: 'small', readings: 'しょう、ちいさい' },
  { radical: '尢', stroke_count: 3, meaning: 'lame', readings: 'だいのまげあし、おうにょう' },
  { radical: '尸', stroke_count: 3, meaning: 'corpse', readings: 'しかばね' },
  { radical: '屮', stroke_count: 3, meaning: 'sprout', readings: 'てつ' },
  { radical: '山', stroke_count: 3, meaning: 'mountain', readings: 'やま' },
  { radical: '巛', stroke_count: 3, meaning: 'river', readings: 'かわ、まがりがわ' },
  { radical: '工', stroke_count: 3, meaning: 'work', readings: 'こう' },
  { radical: '己', stroke_count: 3, meaning: 'oneself', readings: 'おのれ' },
  { radical: '巾', stroke_count: 3, meaning: 'turban', readings: 'はば' },
  { radical: '干', stroke_count: 3, meaning: 'dry', readings: 'ほす、かん' },
  { radical: '幺', stroke_count: 3, meaning: 'short thread', readings: 'いとがしら' },
  { radical: '广', stroke_count: 3, meaning: 'dotted cliff', readings: 'まだれ' },
  { radical: '廴', stroke_count: 3, meaning: 'long stride', readings: 'えんにょう' },
  { radical: '廾', stroke_count: 3, meaning: 'arch', readings: 'にじゅうあし、こまぬき' },
  { radical: '弋', stroke_count: 3, meaning: 'shoot', readings: 'しきがまえ' },
  { radical: '弓', stroke_count: 3, meaning: 'bow', readings: 'ゆみ' },
  { radical: '彐', stroke_count: 3, meaning: 'snout', readings: 'けいがしら' },
  { radical: '彡', stroke_count: 3, meaning: 'bristle', readings: 'さんづくり' },
  { radical: '彳', stroke_count: 3, meaning: 'step', readings: 'ぎょうにんべん' },
  // 4 strokes
  { radical: '心', stroke_count: 4, meaning: 'heart', readings: 'こころ、りっしんべん' },
  { radical: '戈', stroke_count: 4, meaning: 'halberd', readings: 'ほこづくり、かのほこ' },
  { radical: '戶', stroke_count: 4, meaning: 'door', readings: 'と、とだれ、とかんむり' },
  { radical: '手', stroke_count: 4, meaning: 'hand', readings: 'て' },
  { radical: '支', stroke_count: 4, meaning: 'branch', readings: 'し、えだ' },
  { radical: '攴', stroke_count: 4, meaning: 'rap', readings: 'ぼくづくり、ぼくにょう' },
  { radical: '文', stroke_count: 4, meaning: 'script', readings: 'ぶん' },
  { radical: '斗', stroke_count: 4, meaning: 'dipper', readings: 'とます' },
  { radical: '斤', stroke_count: 4, meaning: 'axe', readings: 'おのづくり' },
  { radical: '方', stroke_count: 4, meaning: 'square', readings: 'ほう' },
  { radical: '无', stroke_count: 4, meaning: 'not', readings: 'なし' },
  { radical: '日', stroke_count: 4, meaning: 'sun', readings: 'ひ、にち' },
  { radical: '曰', stroke_count: 4, meaning: 'say', readings: 'ひらび、いわく' },
  { radical: '月', stroke_count: 4, meaning: 'moon', readings: 'つき' },
  { radical: '木', stroke_count: 4, meaning: 'tree', readings: 'き' },
  { radical: '欠', stroke_count: 4, meaning: 'lack', readings: 'あくび' },
  { radical: '止', stroke_count: 4, meaning: 'stop', readings: 'とめる' },
  { radical: '歹', stroke_count: 4, meaning: 'death', readings: 'がつへん、がつ、かばねへん' },
  { radical: '殳', stroke_count: 4, meaning: 'weapon', readings: 'ほこづくり、るまた' },
  { radical: '毋', stroke_count: 4, meaning: 'do not', readings: 'なかれ、はは' },
  { radical: '比', stroke_count: 4, meaning: 'compare', readings: 'くらべる' },
  { radical: '毛', stroke_count: 4, meaning: 'fur', readings: 'け' },
  { radical: '氏', stroke_count: 4, meaning: 'clan', readings: 'うじ' },
  { radical: '気', stroke_count: 4, meaning: 'steam', readings: 'きがまえ' },
  { radical: '水', stroke_count: 4, meaning: 'water', readings: 'みず' },
  { radical: '火', stroke_count: 4, meaning: 'fire', readings: 'ひ、ひへん' },
  { radical: '爪', stroke_count: 4, meaning: 'claw', readings: 'つめ、つめがしら' },
  { radical: '父', stroke_count: 4, meaning: 'father', readings: 'ちち' },
  { radical: '爻', stroke_count: 4, meaning: 'trigram', readings: 'こう' },
  { radical: '爿', stroke_count: 4, meaning: 'split wood', readings: 'しょうへん' },
  { radical: '片', stroke_count: 4, meaning: '片', readings: 'かた' },
  { radical: '牙', stroke_count: 4, meaning: 'fang', readings: 'きば、が' },
  { radical: '牛', stroke_count: 4, meaning: 'cow', readings: 'うし' },
  { radical: '犬', stroke_count: 4, meaning: 'dog', readings: 'いぬ' },
  // 5 strokes
  { radical: '玄', stroke_count: 5, meaning: 'profound', readings: 'げん' },
  { radical: '玉', stroke_count: 5, meaning: 'jade', readings: 'たま' },
  { radical: '瓜', stroke_count: 5, meaning: 'melon', readings: 'うり' },
  { radical: '瓦', stroke_count: 5, meaning: 'tile', readings: 'かわら' },
  { radical: '甘', stroke_count: 5, meaning: 'sweet', readings: 'あまい' },
  { radical: '生', stroke_count: 5, meaning: 'life', readings: 'いきる、うまれる' },
  { radical: '用', stroke_count: 5, meaning: 'use', readings: 'もちいる' },
  { radical: '田', stroke_count: 5, meaning: 'field', readings: 'た' },
  { radical: '疋', stroke_count: 5, meaning: 'bolt of cloth', readings: 'ひき' },
  { radical: '疒', stroke_count: 5, meaning: 'sickness', readings: 'やまいだれ' },
  { radical: '癶', stroke_count: 5, meaning: 'dotted tent', readings: 'はつがしら' },
  { radical: '白', stroke_count: 5, meaning: 'white', readings: 'しろ' },
  { radical: '皮', stroke_count: 5, meaning: 'skin', readings: 'けがわ' },
  { radical: '皿', stroke_count: 5, meaning: 'dish', readings: 'さら' },
  { radical: '目', stroke_count: 5, meaning: 'eye', readings: 'め' },
  { radical: '矛', stroke_count: 5, meaning: 'spear', readings: 'ほこ' },
  { radical: '矢', stroke_count: 5, meaning: 'arrow', readings: 'や' },
  { radical: '石', stroke_count: 5, meaning: 'stone', readings: 'いし' },
  { radical: '示', stroke_count: 5, meaning: 'spirit', readings: 'しめす' },
  { radical: '禸', stroke_count: 5, meaning: 'track', readings: 'ぐうのあし' },
  { radical: '禾', stroke_count: 5, meaning: 'grain', readings: 'のぎ' },
  { radical: '穴', stroke_count: 5, meaning: 'cave', readings: 'あな' },
  { radical: '立', stroke_count: 5, meaning: 'stand', readings: 'たつ' },
  // 6 strokes
  { radical: '竹', stroke_count: 6, meaning: 'bamboo', readings: 'たけ' },
  { radical: '米', stroke_count: 6, meaning: 'rice', readings: 'こめ' },
  { radical: '糸', stroke_count: 6, meaning: 'thread', readings: 'いと' },
  { radical: '缶', stroke_count: 6, meaning: 'jar', readings: 'ほとぎ、かん、ふ' },
  { radical: '网', stroke_count: 6, meaning: 'net', readings: 'あみがしら' },
  { radical: '羊', stroke_count: 6, meaning: 'sheep', readings: 'ひつじ' },
  { radical: '羽', stroke_count: 6, meaning: 'feather', readings: 'はね' },
  { radical: '老', stroke_count: 6, meaning: 'old', readings: 'おいる、おいかんむり' },
  { radical: '而', stroke_count: 6, meaning: 'and', readings: 'しこうして' },
  { radical: '耒', stroke_count: 6, meaning: 'plow', readings: 'すき、らいすき' },
  { radical: '耳', stroke_count: 6, meaning: 'ear', readings: 'みみ' },
  { radical: '聿', stroke_count: 6, meaning: 'brush', readings: 'ふでづくり' },
  { radical: '肉', stroke_count: 6, meaning: 'meat', readings: 'にく' },
  { radical: '臣', stroke_count: 6, meaning: 'minister', readings: 'しん' },
  { radical: '自', stroke_count: 6, meaning: 'self', readings: 'みずから' },
  { radical: '至', stroke_count: 6, meaning: 'arrive', readings: 'いたる' },
  { radical: '臼', stroke_count: 6, meaning: 'mortar', readings: 'うす' },
  { radical: '舌', stroke_count: 6, meaning: 'tongue', readings: 'した' },
  { radical: '舛', stroke_count: 6, meaning: 'oppose', readings: 'ます' },
  { radical: '舟', stroke_count: 6, meaning: 'boat', readings: 'ふね' },
  { radical: '艮', stroke_count: 6, meaning: 'stopping', readings: 'うしとら、こん' },
  { radical: '色', stroke_count: 6, meaning: 'color', readings: 'いろ' },
  { radical: '艸', stroke_count: 6, meaning: 'grass', readings: 'くさ' },
  { radical: '虍', stroke_count: 6, meaning: 'tiger', readings: 'とらがしら' },
  { radical: '虫', stroke_count: 6, meaning: 'insect', readings: 'むし' },
  { radical: '血', stroke_count: 6, meaning: 'blood', readings: 'ち' },
  { radical: '行', stroke_count: 6, meaning: 'go', readings: 'ぎょう、ゆきがまえ' },
  { radical: '衣', stroke_count: 6, meaning: 'clothes', readings: 'ころも' },
  { radical: '襾', stroke_count: 6, meaning: 'cover', readings: 'にし、おおいかんむり' },
  // 7 strokes
  { radical: '見', stroke_count: 7, meaning: 'see', readings: 'みる' },
  { radical: '角', stroke_count: 7, meaning: 'horn', readings: 'つの' },
  { radical: '言', stroke_count: 7, meaning: 'speech', readings: 'ことば、ごんべん' },
  { radical: '谷', stroke_count: 7, meaning: 'valley', readings: 'たに' },
  { radical: '豆', stroke_count: 7, meaning: 'bean', readings: 'まめ' },
  { radical: '豕', stroke_count: 7, meaning: 'pig', readings: 'いのこ、ぶた' },
  { radical: '豸', stroke_count: 7, meaning: 'badger', readings: 'むじな' },
  { radical: '貝', stroke_count: 7, meaning: 'shell', readings: 'かい' },
  { radical: '赤', stroke_count: 7, meaning: 'red', readings: 'あか' },
  { radical: '走', stroke_count: 7, meaning: 'run', readings: 'はしる' },
  { radical: '足', stroke_count: 7, meaning: 'foot', readings: 'あし' },
  { radical: '身', stroke_count: 7, meaning: 'body', readings: 'み' },
  { radical: '車', stroke_count: 7, meaning: 'cart', readings: 'くるま' },
  { radical: '辛', stroke_count: 7, meaning: 'bitter', readings: 'からい' },
  { radical: '辰', stroke_count: 7, meaning: 'morning', readings: 'たつ' },
  { radical: '辵', stroke_count: 7, meaning: 'walk', readings: 'しんにょう、しんにゅう' },
  { radical: '邑', stroke_count: 7, meaning: 'city', readings: 'おおざと' },
  { radical: '酉', stroke_count: 7, meaning: 'wine', readings: 'とり、ひよみのとり' },
  { radical: '釆', stroke_count: 7, meaning: 'distinguish', readings: 'のごめ' },
  { radical: '里', stroke_count: 7, meaning: 'village', readings: 'さと' },
  // 8 strokes
  { radical: '金', stroke_count: 8, meaning: 'metal', readings: 'かね' },
  { radical: '長', stroke_count: 8, meaning: 'long', readings: 'ながい' },
  { radical: '門', stroke_count: 8, meaning: 'gate', readings: 'もん' },
  { radical: '阜', stroke_count: 8, meaning: 'mound', readings: 'こざと' },
  { radical: '隶', stroke_count: 8, meaning: 'slave', readings: 'れいづくり' },
  { radical: '隹', stroke_count: 8, meaning: 'bird', readings: 'ふるとり' },
  { radical: '雨', stroke_count: 8, meaning: 'rain', readings: 'あめ' },
  { radical: '青', stroke_count: 8, meaning: 'blue', readings: 'あお' },
  { radical: '非', stroke_count: 8, meaning: 'wrong', readings: 'あらず' },
  // 9 strokes
  { radical: '面', stroke_count: 9, meaning: 'face', readings: 'めん' },
  { radical: '革', stroke_count: 9, meaning: 'leather', readings: 'かわ' },
  { radical: '韋', stroke_count: 9, meaning: 'tanned leather', readings: 'なめしがわ' },
  { radical: '韭', stroke_count: 9, meaning: 'leek', readings: 'にら' },
  { radical: '音', stroke_count: 9, meaning: 'sound', readings: 'おと' },
  { radical: '頁', stroke_count: 9, meaning: 'leaf', readings: 'おおがい' },
  { radical: '風', stroke_count: 9, meaning: 'wind', readings: 'かぜ' },
  { radical: '飛', stroke_count: 9, meaning: 'fly', readings: 'とぶ' },
  { radical: '食', stroke_count: 9, meaning: 'eat', readings: 'しょく' },
  { radical: '首', stroke_count: 9, meaning: 'neck', readings: 'くび' },
  { radical: '香', stroke_count: 9, meaning: 'fragrant', readings: 'かおり' },
  // 10 strokes
  { radical: '馬', stroke_count: 10, meaning: 'horse', readings: 'うま' },
  { radical: '骨', stroke_count: 10, meaning: 'bone', readings: 'ほね' },
  { radical: '高', stroke_count: 10, meaning: 'tall', readings: 'たかい' },
  { radical: '髟', stroke_count: 10, meaning: 'hair', readings: 'かみがしら' },
  { radical: '鬥', stroke_count: 10, meaning: 'fight', readings: 'とうがまえ、たたかいがまえ' },
  { radical: '鬯', stroke_count: 10, meaning: 'sacrificial wine', readings: 'ちょう' },
  { radical: '鬲', stroke_count: 10, meaning: 'cauldron', readings: 'れき' },
  { radical: '鬼', stroke_count: 10, meaning: 'ghost', readings: 'おに' },
  // 11 strokes
  { radical: '魚', stroke_count: 11, meaning: 'fish', readings: 'うお、さかな' },
  { radical: '鳥', stroke_count: 11, meaning: 'bird', readings: 'とり' },
  { radical: '鹵', stroke_count: 11, meaning: 'salt', readings: 'ろ' },
  { radical: '鹿', stroke_count: 11, meaning: 'deer', readings: 'しか' },
  { radical: '麦', stroke_count: 11, meaning: 'wheat', readings: 'むぎ' },
  { radical: '麻', stroke_count: 11, meaning: 'hemp', readings: 'あさ' },
  // 12 strokes
  { radical: '黄', stroke_count: 12, meaning: 'yellow', readings: 'き、きいろ' },
  { radical: '黍', stroke_count: 12, meaning: 'millet', readings: 'きび' },
  { radical: '黒', stroke_count: 12, meaning: 'black', readings: 'くろ' },
  { radical: '黹', stroke_count: 12, meaning: 'embroidery', readings: 'ふしづくり、ぬいとり' },
  // 13 strokes
  { radical: '黽', stroke_count: 13, meaning: 'frog', readings: 'べん、かえる' },
  { radical: '鼎', stroke_count: 13, meaning: 'tripod', readings: 'かなえ' },
  { radical: '鼓', stroke_count: 13, meaning: 'drum', readings: 'つづみ' },
  { radical: '鼠', stroke_count: 13, meaning: 'rat', readings: 'ねずみ' },
  // 14 strokes
  { radical: '鼻', stroke_count: 14, meaning: 'nose', readings: 'はな' },
  { radical: '齊', stroke_count: 14, meaning: 'even', readings: 'せい' },
  // 15 strokes
  { radical: '歯', stroke_count: 15, meaning: 'tooth', readings: 'は' },
  // 16 strokes
  { radical: '竜', stroke_count: 16, meaning: 'dragon', readings: 'りゅう' },
  { radical: '亀', stroke_count: 16, meaning: 'turtle', readings: 'かめ' },
  // 17 strokes
  { radical: '龠', stroke_count: 17, meaning: 'flute', readings: 'やく' }
];

/**
 * Create database schema
 */
function createSchema(db) {
  console.log('Creating database schema...');
  
  // Kanji table
  db.exec(`
    CREATE TABLE IF NOT EXISTS kanji (
      character TEXT PRIMARY KEY,
      stroke_count INTEGER,
      radical TEXT,
      grade INTEGER,
      jlpt_level INTEGER,
      frequency INTEGER,
      onyomi TEXT,
      kunyomi TEXT,
      meanings TEXT,
      components TEXT
    )
  `);
  
  // Radicals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS radicals (
      radical TEXT PRIMARY KEY,
      stroke_count INTEGER NOT NULL,
      meaning TEXT,
      readings TEXT
    )
  `);
  
  // JMdict entries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS jmdict_entries (
      ent_seq INTEGER PRIMARY KEY,
      kanji_elements TEXT,
      reading_elements TEXT,
      senses TEXT
    )
  `);
  
  // KanjiVG table
  db.exec(`
    CREATE TABLE IF NOT EXISTS kanjivg (
      character TEXT PRIMARY KEY,
      svg_data TEXT
    )
  `);
  
  // Create indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_kanji_radical ON kanji(radical);
    CREATE INDEX IF NOT EXISTS idx_kanji_stroke_count ON kanji(stroke_count);
    CREATE INDEX IF NOT EXISTS idx_radicals_stroke_count ON radicals(stroke_count);
  `);
  
  console.log('Schema created successfully');
}

/**
 * Import radicals data
 */
function importRadicals(db) {
  console.log('Importing radicals...');
  
  const insert = db.prepare(`
    INSERT OR REPLACE INTO radicals (radical, stroke_count, meaning, readings)
    VALUES (?, ?, ?, ?)
  `);
  
  const insertMany = db.transaction((radicals) => {
    for (const radical of radicals) {
      insert.run(
        radical.radical,
        radical.stroke_count,
        radical.meaning,
        radical.readings
      );
    }
  });
  
  insertMany(KANGXI_RADICALS);
  
  console.log(`Imported ${KANGXI_RADICALS.length} radicals`);
}

/**
 * Import JMdict data from JSON file
 */
function importJMdict(db) {
  console.log('Checking for JMdict data...');
  
  if (!fs.existsSync(JMDICT_PATH)) {
    console.log('JMdict file not found. Skipping JMdict import.');
    console.log(`Expected location: ${JMDICT_PATH}`);
    return;
  }
  
  console.log('Reading JMdict JSON file...');
  const jmdictData = JSON.parse(fs.readFileSync(JMDICT_PATH, 'utf8'));
  
  const insert = db.prepare(`
    INSERT OR REPLACE INTO jmdict_entries (ent_seq, kanji_elements, reading_elements, senses)
    VALUES (?, ?, ?, ?)
  `);
  
  console.log('Importing JMdict entries...');
  let count = 0;
  
  const insertMany = db.transaction((entries) => {
    for (const entry of entries) {
      if (!entry || !entry.ent_seq) continue;
      
      insert.run(
        entry.ent_seq,
        JSON.stringify(entry.k_ele || []),
        JSON.stringify(entry.r_ele || []),
        JSON.stringify(entry.sense || [])
      );
      count++;
      
      if (count % 10000 === 0) {
        console.log(`Imported ${count} entries...`);
      }
    }
  });
  
  if (Array.isArray(jmdictData.words)) {
    insertMany(jmdictData.words);
  } else {
    console.log('JMdict data format not recognized. Expected { words: [...] }');
  }
  
  console.log(`Imported ${count} JMdict entries`);
}

/**
 * Import KanjiVG data from SVG files
 */
function importKanjiVG(db) {
  console.log('Checking for KanjiVG data...');
  
  if (!fs.existsSync(KANJIVG_PATH)) {
    console.log('KanjiVG directory not found. Skipping KanjiVG import.');
    console.log(`Expected location: ${KANJIVG_PATH}`);
    return;
  }
  
  console.log('Reading KanjiVG SVG files...');
  const files = fs.readdirSync(KANJIVG_PATH).filter(f => f.endsWith('.svg'));
  
  const insert = db.prepare(`
    INSERT OR REPLACE INTO kanjivg (character, svg_data)
    VALUES (?, ?)
  `);
  
  console.log('Importing KanjiVG entries...');
  let count = 0;
  
  const insertMany = db.transaction((files) => {
    for (const file of files) {
      // Extract kanji character from filename (e.g., 05e30.svg -> U+5E30)
      const match = file.match(/^([0-9a-f]+)\.svg$/i);
      if (!match) continue;
      
      const codepoint = parseInt(match[1], 16);
      const character = String.fromCodePoint(codepoint);
      const svgData = fs.readFileSync(path.join(KANJIVG_PATH, file), 'utf8');
      
      insert.run(character, svgData);
      count++;
      
      if (count % 1000 === 0) {
        console.log(`Imported ${count} KanjiVG entries...`);
      }
    }
  });
  
  insertMany(files);
  
  console.log(`Imported ${count} KanjiVG entries`);
}

/**
 * Main import function
 */
function main() {
  console.log('Starting data import...');
  console.log(`Database path: ${DB_PATH}`);
  
  // Create data directory if it doesn't exist
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Open database connection
  const db = new Database(DB_PATH);
  
  try {
    // Enable WAL mode for better concurrency
    db.pragma('journal_mode = WAL');
    
    // Create schema
    createSchema(db);
    
    // Import data
    importRadicals(db);
    importJMdict(db);
    importKanjiVG(db);
    
    console.log('Data import completed successfully!');
    console.log(`Database created at: ${DB_PATH}`);
  } catch (error) {
    console.error('Error during import:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, createSchema, importRadicals, importJMdict, importKanjiVG };
