export interface ScoreResult {
  attempts: number;
  guesses: string[];
  boxScores: number[];
  boxTotal: number;
  guessPenalties: number[];
  totalPenalty: number;
  failurePenalty: number;
  totalScore: number;
  originalText: string;
}

/**
 * Point values for each box type in Wordle scoring.
 * Higher values indicate worse performance (more points = worse score).
 */
const BOX_SCORES: Record<string, number> = {
  '⬛': 2, // Black box (letter not in word)
  '🟨': 1, // Yellow box (letter in word, wrong position)
  '🟩': 0, // Green box (letter in word, correct position)
};

/**
 * Valid box emoji characters for Wordle.
 */
const VALID_BOXES = ['⬛', '🟨', '🟩'] as const;

/**
 * Valid total box counts (5 boxes per guess, 1-6 guesses allowed).
 */
const VALID_TOTALS = [5, 10, 15, 20, 25, 30] as const;

/**
 * Wordle completion pattern (all green boxes).
 */
const COMPLETION_PATTERN = '🟩🟩🟩🟩🟩';

/**
 * Constants for scoring calculation.
 */
const SCORING_CONSTANTS = {
  BOXES_PER_GUESS: 5,
  MAX_GUESSES: 6,
  FAILURE_PENALTY: 10,
  PERFECT_SCORE_BASE: 100,
} as const;

/**
 * Normalizes box emoji characters to standard Wordle format.
 * Gray/white squares are converted to black squares.
 * @param char - The character to normalize
 * @returns Normalized box character or null if not a valid box
 */
function normalizeBoxChar(char: string): string | null {
  // Black box variations (normalize to ⬛)
  if (char === '⬛' || char === '⬜' || char === '⚫' || char === '🟫') {
    return '⬛';
  }
  // Yellow box
  if (char === '🟨') {
    return '🟨';
  }
  // Green box
  if (char === '🟩') {
    return '🟩';
  }
  return null;
}

/**
 * Extracts box emojis from the input text, ignoring all other characters.
 * Normalizes gray/white squares to black squares.
 * @param shareText - The Wordle share text containing box emojis
 * @returns Array of normalized box emoji characters
 */
function extractBoxes(shareText: string): string[] {
  const boxes: string[] = [];
  for (const char of shareText) {
    const normalized = normalizeBoxChar(char);
    if (normalized !== null) {
      boxes.push(normalized);
    }
  }
  return boxes;
}

/**
 * Validates that the total number of boxes is valid for Wordle (5, 10, 15, 20, 25, or 30).
 * @param boxCount - Total number of boxes found
 * @throws Error if box count is invalid
 */
function validateBoxCount(boxCount: number): void {
  if (boxCount === 0) {
    throw new Error('Invalid Wordle format: No box patterns found');
  }
  if (!VALID_TOTALS.includes(boxCount as typeof VALID_TOTALS[number])) {
    throw new Error(
      `Invalid Wordle format: Found ${boxCount} boxes total, but must be one of: ${VALID_TOTALS.join(', ')} (1-6 guesses)`
    );
  }
}

/**
 * Groups boxes into rows of 5 (Wordle standard: 5 boxes per guess).
 * @param boxes - Array of box emoji characters
 * @returns Array of strings, each containing exactly 5 boxes
 */
function groupBoxesIntoRows(boxes: string[]): string[] {
  const rows: string[] = [];
  for (let i = 0; i < boxes.length; i += SCORING_CONSTANTS.BOXES_PER_GUESS) {
    const row = boxes.slice(i, i + SCORING_CONSTANTS.BOXES_PER_GUESS).join('');
    rows.push(row);
  }
  return rows;
}

/**
 * Calculates the score for a single guess based on box colors.
 * @param guess - String of 5 box emojis representing one guess
 * @returns Score for this guess (higher = worse)
 */
function calculateBoxScore(guess: string): number {
  let score = 0;
  for (const char of guess) {
    const boxScore = BOX_SCORES[char];
    if (boxScore !== undefined) {
      score += boxScore;
    }
  }
  return score;
}

/**
 * Calculates the penalty for a guess based on attempt number.
 * @param guessNumber - The attempt number (1-based)
 * @returns Penalty points (0 for first guess, increasing for later guesses)
 */
function calculateGuessPenalty(guessNumber: number): number {
  return guessNumber > 1 ? (guessNumber - 1) * 2 : 0;
}

/**
 * Checks if the Wordle was completed successfully (last guess is all green).
 * @param lastGuess - The last guess string
 * @returns True if completed successfully
 */
function isWordleCompleted(lastGuess: string): boolean {
  return lastGuess === COMPLETION_PATTERN;
}

/**
 * Transforms the raw score (lower is better) into final score (higher is better).
 * Formula: |100 - rawScore|
 * @param rawScore - Raw score where lower is better
 * @returns Final score where higher is better (0-100)
 */
function transformScore(rawScore: number): number {
  return Math.abs(SCORING_CONSTANTS.PERFECT_SCORE_BASE - rawScore);
}

/**
 * Scores a Wordle game from share text.
 * 
 * Scoring system:
 * - Black boxes (⬛): 2 points each
 * - Yellow boxes (🟨): 1 point each
 * - Green boxes (🟩): 0 points each
 * - Penalty: (guessNumber - 1) × 2 for guesses 2-6
 * - Failure penalty: 10 points if not completed
 * - Final score: |100 - rawScore| (higher is better)
 * 
 * @param shareText - Wordle share text containing box emojis
 * @returns ScoreResult with detailed scoring breakdown
 * @throws Error if input format is invalid
 */
export function scoreWordle(shareText: string): ScoreResult {
  // Extract and validate boxes
  const allBoxes = extractBoxes(shareText);
  validateBoxCount(allBoxes.length);
  
  // Group into rows
  const boxLines = groupBoxesIntoRows(allBoxes);
  const attempts = boxLines.length;
  
  // Calculate scores for each guess
  const boxScores: number[] = [];
  const guessPenalties: number[] = [];
  let boxTotal = 0;
  let totalPenalty = 0;
  
  for (let guessIndex = 0; guessIndex < boxLines.length; guessIndex++) {
    const guess = boxLines[guessIndex];
    const guessNumber = guessIndex + 1;
    
    // Calculate box score and penalty for this guess
    const lineScore = calculateBoxScore(guess);
    const penalty = calculateGuessPenalty(guessNumber);
    
    boxScores.push(lineScore);
    guessPenalties.push(penalty);
    boxTotal += lineScore;
    totalPenalty += penalty;
  }
  
  // Check completion and apply failure penalty
  const lastGuess = boxLines[boxLines.length - 1];
  const isCompleted = isWordleCompleted(lastGuess);
  const failurePenalty = isCompleted ? 0 : SCORING_CONSTANTS.FAILURE_PENALTY;
  const finalPenalty = totalPenalty + failurePenalty;
  
  // Calculate and transform final score
  const rawScore = boxTotal + finalPenalty;
  const totalScore = transformScore(rawScore);
  
  return {
    attempts,
    guesses: boxLines,
    boxScores,
    boxTotal,
    guessPenalties,
    totalPenalty: finalPenalty,
    failurePenalty,
    totalScore,
    originalText: shareText,
  };
}

