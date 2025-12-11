import { useState } from 'react';
import SearchBox from './components/SearchBox';
import KanjiCard from './components/KanjiCard';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const response = await fetch(`/api/lookup?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🈴 Kanji Lookup</h1>
        <p className="subtitle">Search by kanji, kana, romaji, or English</p>
      </header>

      <main className="app-main">
        <SearchBox onSearch={handleSearch} />

        {loading && <div className="loading">Searching...</div>}
        
        {error && (
          <div className="error">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (
          <div className="no-results">
            <p>No results found for "{query}"</p>
          </div>
        )}

        <div className="results">
          {results.map((kanji, index) => (
            <KanjiCard key={`${kanji.kanji}-${index}`} data={kanji} />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        <p>Data sources: KANJIDIC2, JMdict, KanjiVG</p>
      </footer>
    </div>
  );
}

export default App;
