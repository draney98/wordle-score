import express, { Request, Response } from 'express';
import { scoreWordle } from '../utils/wordleScorer';

const router = express.Router();

/**
 * GET / - Homepage
 * Renders the main page with the Wordle score calculator form.
 */
router.get('/', (req: Request, res: Response) => {
  res.render('index', { result: null, error: null, wordleText: '' });
});

/**
 * POST /score - Process Wordle text and calculate score
 * Accepts Wordle share text, calculates the score, and renders results.
 * 
 * @throws Renders error page if input is invalid or scoring fails
 */
router.post('/score', (req: Request, res: Response) => {
  try {
    const { wordleText } = req.body;
    
    // Validate input
    if (!wordleText || typeof wordleText !== 'string' || wordleText.trim() === '') {
      return res.render('index', {
        result: null,
        error: 'Please provide Wordle share text',
        wordleText: wordleText || ''
      });
    }
    
    // Calculate score
    const result = scoreWordle(wordleText);
    res.render('index', { result, error: null, wordleText: '' });
  } catch (error) {
    // Handle scoring errors gracefully
    const errorMessage = error instanceof Error ? error.message : 'Invalid Wordle format';
    res.render('index', {
      result: null,
      error: errorMessage,
      wordleText: req.body.wordleText || ''
    });
  }
});

export default router;

