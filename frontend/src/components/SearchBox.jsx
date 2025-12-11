import { useState } from 'react';
import './SearchBox.css';

function SearchBox({ onSearch }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleClear = () => {
    setInput('');
    onSearch('');
  };

  return (
    <div className="search-box">
      <form onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Try: 帰, 帰られました, kaeru, or 'return'"
            className="search-input"
            autoFocus
          />
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
              aria-label="Clear"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBox;
