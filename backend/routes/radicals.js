import express from 'express';
import { getAllRadicals, getRadicalsByStrokeCount, getKanjiByRadical } from '../services/dataService.js';

const router = express.Router();

/**
 * GET /api/radicals
 * Get all radicals grouped by stroke count, or filter by stroke count
 * Query params:
 *   - strokes: (optional) Filter by stroke count (1-28)
 */
router.get('/', (req, res) => {
  try {
    const strokesParam = req.query.strokes;
    
    if (strokesParam) {
      const strokes = parseInt(strokesParam, 10);
      
      if (isNaN(strokes) || strokes < 1 || strokes > 28) {
        return res.status(400).json({
          error: 'Invalid stroke count',
          message: 'Stroke count must be a number between 1 and 28'
        });
      }
      
      const radicals = getRadicalsByStrokeCount(strokes);
      
      return res.json({
        stroke_count: strokes,
        radicals
      });
    }
    
    // Return all radicals grouped by stroke count
    const allRadicals = getAllRadicals();
    
    res.json({
      radicals: allRadicals
    });
  } catch (error) {
    console.error('Error fetching radicals:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/radicals/:radical/kanji
 * Get all kanji that contain a specific radical
 */
router.get('/:radical/kanji', (req, res) => {
  try {
    const radical = req.params.radical;
    
    if (!radical) {
      return res.status(400).json({
        error: 'Radical parameter is required'
      });
    }
    
    const kanji = getKanjiByRadical(radical);
    
    res.json({
      radical,
      count: kanji.length,
      kanji
    });
  } catch (error) {
    console.error('Error fetching kanji by radical:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

export default router;
