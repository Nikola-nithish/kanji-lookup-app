# Kanji Lookup App

A searchable kanji lookup web application with morphological analysis and stroke order visualization. Search by kanji character, conjugated Japanese words, romaji, or English meanings.

## Features

- **Multi-input Search**: Query by:
  - Direct kanji characters (e.g., 帰)
  - Conjugated/inflected Japanese words (e.g., 帰られました)
  - Romaji (e.g., kaeru)
  - English glosses (e.g., "return")

- **Comprehensive Kanji Information**:
  - Stroke order diagrams (SVG format)
  - Stroke count and radical information
  - Onyomi (音読み) and Kunyomi (訓読み) readings
  - English meanings
  - JLPT level and Jōyō ranking
  - Grade level and frequency data
  - Component decomposition

- **Example Vocabulary**:
  - Compound words and native expressions
  - Each with word, reading, and English gloss

- **Related Kanji**:
  - Kanji sharing the same radical
  - Kanji with similar components
  - Visually similar kanji

- **Export Options**:
  - Download stroke order SVGs
  - Copy kanji data as JSON

## Tech Stack

### Backend
- **Node.js** with Express
- **Kuromoji.js** for Japanese morphological analysis
- **wanakana.js** for romaji to kana conversion
- **xml2js** for parsing data sources

### Frontend
- **React 18** with hooks
- **Vite** for fast development and building
- Responsive CSS design (mobile-first)

### Data Sources
- **KANJIDIC2**: Kanji metadata (readings, meanings, JLPT level)
- **JMdict**: Japanese-English dictionary data
- **KanjiVG**: Stroke order vector graphics

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/Nikola-nithish/kanji-lookup-app.git
cd kanji-lookup-app
```

2. **Install backend dependencies**:
```bash
cd backend
npm install
```

3. **Install frontend dependencies**:
```bash
cd ../frontend
npm install
```

4. **Start the backend server** (from `backend/` directory):
```bash
npm start
# Server runs on http://localhost:3001
```

5. **Start the frontend dev server** (from `frontend/` directory):
```bash
npm run dev
# App runs on http://localhost:5173
```

6. **Access the app**: Open http://localhost:5173 in your browser

### Using Docker

Run both frontend and backend with Docker Compose:

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Documentation

### GET /api/lookup

Search for kanji by query string.

**Query Parameters**:
- `q` (required): Search query (kanji, kana, romaji, or English)

**Example Requests**:
```bash
# Direct kanji
curl "http://localhost:3001/api/lookup?q=帰"

# Conjugated verb
curl "http://localhost:3001/api/lookup?q=帰られました"

# Romaji
curl "http://localhost:3001/api/lookup?q=kaeru"

# English
curl "http://localhost:3001/api/lookup?q=return"
```

**Response Format**:
```json
{
  "query": "帰",
  "results": [
    {
      "kanji": "帰",
      "stroke_order_svg": "<svg>...</svg>",
      "stroke_count": 10,
      "radical": "⻌",
      "components": ["尸", "𠆢", "帚"],
      "onyomi": ["キ"],
      "kunyomi": ["かえ.る", "かえ.す", "おく.る", "とつ.ぐ"],
      "meanings": ["return", "go back", "send back", "restore"],
      "jlpt_level": 3,
      "joyo_rank": 488,
      "grade": 2,
      "frequency": 698,
      "example_words": [
        {
          "word": "帰る",
          "reading": "かえる",
          "gloss": "to return; to go back; to come back; to go home"
        }
      ],
      "related_kanji": ["還", "送"],
      "source_ids": {
        "kanjidic": "5E30",
        "unicode": "U+5E30"
      }
    }
  ]
}
```

### GET /api/health

Health check endpoint.

**Response**:
```json
{
  "status": "ok"
}
```

### GET /api/radicals

Get all radicals grouped by stroke count, or filter by specific stroke count.

**Query Parameters**:
- `strokes` (optional): Filter by stroke count (1-28)

**Example Requests**:
```bash
# Get all radicals
curl "http://localhost:3001/api/radicals"

# Get radicals with 3 strokes
curl "http://localhost:3001/api/radicals?strokes=3"
```

**Response Format** (all radicals):
```json
{
  "radicals": {
    "1": [
      {
        "radical": "一",
        "stroke_count": 1,
        "meaning": "one",
        "readings": "いち"
      }
    ],
    "3": [
      {
        "radical": "口",
        "stroke_count": 3,
        "meaning": "mouth",
        "readings": "くち"
      }
    ]
  }
}
```

**Response Format** (filtered by strokes):
```json
{
  "stroke_count": 3,
  "radicals": [
    {
      "radical": "口",
      "stroke_count": 3,
      "meaning": "mouth",
      "readings": "くち"
    },
    {
      "radical": "土",
      "stroke_count": 3,
      "meaning": "earth",
      "readings": "つち"
    }
  ]
}
```

### GET /api/radicals/:radical/kanji

Get all kanji that contain a specific radical.

**Path Parameters**:
- `radical` (required): The radical character (e.g., 口, 手, ⻌)

**Example Request**:
```bash
# Get all kanji with radical 手 (hand)
curl "http://localhost:3001/api/radicals/手/kanji"
```

**Response Format**:
```json
{
  "radical": "手",
  "count": 3,
  "kanji": [
    {
      "character": "掃",
      "stroke_count": 11,
      "radical": "手",
      "grade": 8,
      "jlpt_level": 2,
      "frequency": 2035,
      "onyomi": ["ソウ"],
      "kunyomi": ["は.く"],
      "meanings": ["sweep", "clean"],
      "components": ["手", "帚"]
    }
  ]
}
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

The test suite includes:
- **Normalization tests**: Romaji to kana conversion, conjugation handling
- **Lookup correctness**: 20+ test cases covering various input types
- **Integration tests**: API endpoint testing

Test cases validate the acceptance criteria:
- `帰られました` → returns `帰` with complete metadata
- `kaeru` → returns `帰` and homonyms
- `掃除` → returns `掃` with related kanji sharing components

## Data Sources and Licenses

This application uses the following open data sources:

### KANJIDIC2
- **Description**: Comprehensive kanji character dictionary
- **Source**: [EDRDG/JMdict Project](http://www.edrdg.org/wiki/index.php/KANJIDIC_Project)
- **License**: Creative Commons Attribution-ShareAlike 3.0
- **Usage**: Kanji metadata, readings, meanings, JLPT levels

### JMdict
- **Description**: Japanese-multilingual dictionary
- **Source**: [EDRDG/JMdict Project](http://www.edrdg.org/jmdict/j_jmdict.html)
- **License**: Creative Commons Attribution-ShareAlike 3.0
- **Usage**: Vocabulary, word readings, English glosses

### KanjiVG
- **Description**: Kanji stroke order vector graphics
- **Source**: [KanjiVG Project](https://kanjivg.tagaini.net/)
- **License**: Creative Commons Attribution-ShareAlike 3.0
- **Usage**: Stroke order diagrams

### Kuromoji
- **Description**: Japanese morphological analyzer
- **Source**: [Kuromoji.js](https://github.com/takuyaa/kuromoji.js)
- **License**: Apache License 2.0
- **Usage**: Text tokenization and dictionary form extraction

## Database Setup (Optional - Recommended for Full Functionality)

The application works with embedded sample data (5 kanji) out of the box. For full kanji lookup functionality with thousands of kanji and vocabulary:

### 1. Download Data Files

Download these open-source Japanese language data files:

- **JMdict** (Japanese-English dictionary):
  - URL: http://ftp.edrdg.org/pub/Nihongo/JMdict_e_examp.gz
  - Extract to get the JSON version: `jmdict-eng-3.6.1+20251208123023.json`
  - Alternative: Use the official JMdict releases

- **KanjiVG** (Stroke order diagrams):
  - URL: https://github.com/KanjiVG/kanjivg/releases
  - Download and extract the release
  - You need the folder containing `.svg` files (e.g., `kanjivg-20220427`)

### 2. Place Data Files

Create the data directory and place files:

```bash
cd backend
mkdir -p data

# Place your files:
# - data/jmdict-eng-3.6.1+20251208123023.json
# - data/kanjivg/ (folder with .svg files)
```

### 3. Run Import Script

Import the data into SQLite database:

```bash
cd backend
node scripts/importData.js
```

This will:
- Create `backend/data/kanji.db` SQLite database
- Import all 214 Kangxi radicals with stroke counts
- Parse and import JMdict vocabulary data (if available)
- Import KanjiVG stroke order diagrams (if available)

**Note**: The import script gracefully handles missing data files. It will always import the radicals, and skip JMdict/KanjiVG if files are not present.

### 4. Restart the Server

The application automatically detects the database and uses it:

```bash
npm start
```

You'll see: `Using SQLite database for kanji data` in the logs.

### Fallback Behavior

If the database doesn't exist, the app automatically falls back to sample data (5 kanji). This ensures the application always works, even without the full dataset.

## Project Structure

```
kanji-lookup-app/
├── backend/
│   ├── server.js              # Express server
│   ├── routes/
│   │   └── radicals.js        # Radical search API routes
│   ├── services/
│   │   ├── normalization.js   # Input normalization
│   │   ├── dataService.js     # Data loading and indexing (SQLite + fallback)
│   │   └── kanjiService.js    # Main lookup logic
│   ├── scripts/
│   │   └── importData.js      # Database import script
│   ├── data/
│   │   └── kanji.db           # SQLite database (created after import)
│   ├── tests/
│   │   ├── normalization.test.js
│   │   └── kanjiService.test.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBox.jsx
│   │   │   └── KanjiCard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Development

### Adding New Kanji Data

Edit `backend/services/dataService.js` and add entries to the `sampleKanji` array:

```javascript
{
  character: '新',
  stroke_count: 13,
  radical: '斤',
  components: ['立', '木', '斤'],
  onyomi: ['シン'],
  kunyomi: ['あたら.しい', 'あら.た', 'あら-', 'にい-'],
  meanings: ['new', 'fresh', 'novel'],
  jlpt_level: 4,
  joyo_rank: 68,
  // ... other fields
}
```

### Running Linters

Backend:
```bash
cd backend
npm run lint
```

Frontend:
```bash
cd frontend
npm run lint
```

## CI/CD

The project includes GitHub Actions workflow for:
- Running tests on pull requests
- Building Docker images
- Code quality checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Electronic Dictionary Research and Development Group (EDRDG) for KANJIDIC2 and JMdict
- KanjiVG project for stroke order data
- Kuromoji.js contributors for morphological analysis tools

## Support

For issues, questions, or contributions, please open an issue on GitHub.
