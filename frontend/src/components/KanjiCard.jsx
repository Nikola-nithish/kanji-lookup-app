import { useState } from 'react';
import './KanjiCard.css';

function KanjiCard({ data }) {
  const [activeTab, setActiveTab] = useState('overview');

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert('JSON copied to clipboard!');
  };

  const downloadSVG = () => {
    if (!data.stroke_order_svg) return;
    
    const blob = new Blob([data.stroke_order_svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.kanji}_stroke_order.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="kanji-card">
      <div className="kanji-header">
        <div className="kanji-char">{data.kanji}</div>
        <div className="kanji-actions">
          <button onClick={copyJSON} className="action-btn" title="Copy JSON">
            📋 JSON
          </button>
          {data.stroke_order_svg && (
            <button onClick={downloadSVG} className="action-btn" title="Download SVG">
              ⬇️ SVG
            </button>
          )}
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'stroke-order' ? 'active' : ''}`}
          onClick={() => setActiveTab('stroke-order')}
        >
          Stroke Order
        </button>
        <button
          className={`tab ${activeTab === 'compounds' ? 'active' : ''}`}
          onClick={() => setActiveTab('compounds')}
        >
          Compounds
        </button>
        <button
          className={`tab ${activeTab === 'related' ? 'active' : ''}`}
          onClick={() => setActiveTab('related')}
        >
          Related
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Stroke Count:</span>
                <span className="info-value">{data.stroke_count}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Radical:</span>
                <span className="info-value">{data.radical}</span>
              </div>
              {data.jlpt_level && (
                <div className="info-item">
                  <span className="info-label">JLPT Level:</span>
                  <span className="info-value">N{data.jlpt_level}</span>
                </div>
              )}
              {data.joyo_rank && (
                <div className="info-item">
                  <span className="info-label">Jōyō Rank:</span>
                  <span className="info-value">{data.joyo_rank}</span>
                </div>
              )}
              {data.grade && (
                <div className="info-item">
                  <span className="info-label">Grade:</span>
                  <span className="info-value">{data.grade}</span>
                </div>
              )}
              {data.frequency && (
                <div className="info-item">
                  <span className="info-label">Frequency:</span>
                  <span className="info-value">{data.frequency}</span>
                </div>
              )}
            </div>

            <div className="readings">
              <div className="reading-section">
                <h3>音読み (Onyomi)</h3>
                <div className="reading-list">
                  {data.onyomi.map((reading, idx) => (
                    <span key={idx} className="reading-tag">{reading}</span>
                  ))}
                </div>
              </div>
              <div className="reading-section">
                <h3>訓読み (Kunyomi)</h3>
                <div className="reading-list">
                  {data.kunyomi.map((reading, idx) => (
                    <span key={idx} className="reading-tag">{reading}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="meanings">
              <h3>Meanings</h3>
              <p>{data.meanings.join(', ')}</p>
            </div>

            {data.components && data.components.length > 0 && (
              <div className="components">
                <h3>Components</h3>
                <div className="component-list">
                  {data.components.map((comp, idx) => (
                    <span key={idx} className="component-tag">{comp}</span>
                  ))}
                </div>
              </div>
            )}

            {data.source_ids && (
              <div className="source-ids">
                <h4>Source IDs</h4>
                <div className="source-list">
                  {Object.entries(data.source_ids).map(([key, value]) => (
                    <span key={key} className="source-tag">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stroke-order' && (
          <div className="stroke-order">
            {data.stroke_order_svg ? (
              <div
                className="svg-container"
                dangerouslySetInnerHTML={{ __html: data.stroke_order_svg }}
              />
            ) : (
              <p className="no-data">Stroke order not available</p>
            )}
          </div>
        )}

        {activeTab === 'compounds' && (
          <div className="compounds">
            {data.example_words && data.example_words.length > 0 ? (
              <div className="word-list">
                {data.example_words.map((word, idx) => (
                  <div key={idx} className="word-item">
                    <div className="word-main">{word.word}</div>
                    <div className="word-reading">{word.reading}</div>
                    <div className="word-gloss">{word.gloss}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No example words available</p>
            )}
          </div>
        )}

        {activeTab === 'related' && (
          <div className="related">
            {data.related_kanji && data.related_kanji.length > 0 ? (
              <div>
                <h3>Related Kanji</h3>
                <p className="related-description">
                  Kanji sharing the same radical or components
                </p>
                <div className="related-list">
                  {data.related_kanji.map((kanji, idx) => (
                    <span key={idx} className="related-kanji">{kanji}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="no-data">No related kanji available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default KanjiCard;
