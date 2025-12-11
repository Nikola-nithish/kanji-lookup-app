import express from 'express';
import cors from 'cors';
import { lookupKanji } from './services/kanjiService.js';
import radicalsRouter from './routes/radicals.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API endpoint for kanji lookup
app.get('/api/lookup', async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const results = await lookupKanji(query);
    
    res.json({
      query,
      results
    });
  } catch (error) {
    console.error('Error processing lookup:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Radicals routes
app.use('/api/radicals', radicalsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
