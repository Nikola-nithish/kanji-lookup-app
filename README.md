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

## Sample Data

The current implementation includes embedded sample data for demonstration purposes. For production use:

1. **Download data files**:
   - KANJIDIC2: http://www.edrdg.org/kanjidic/kanjidic2.xml.gz
   - JMdict: http://ftp.edrdg.org/pub/Nihongo/JMdict.gz
   - KanjiVG: https://github.com/KanjiVG/kanjivg/releases

2. **Extract files** to the `backend/data/` directory

3. **Update data service** to parse XML files instead of using embedded data

## Project Structure

```
kanji-lookup-app/
├── backend/
│   ├── server.js              # Express server
│   ├── services/
│   │   ├── normalization.js   # Input normalization
│   │   ├── dataService.js     # Data loading and indexing
│   │   └── kanjiService.js    # Main lookup logic
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
