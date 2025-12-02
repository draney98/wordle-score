import { scoreWordle } from './wordleScorer';

describe('scoreWordle', () => {
  describe('valid inputs', () => {
    it('should score a perfect game (all green on first guess)', () => {
      const result = scoreWordle('🟩🟩🟩🟩🟩');
      
      expect(result.attempts).toBe(1);
      expect(result.totalScore).toBe(100);
      expect(result.boxTotal).toBe(0);
      expect(result.totalPenalty).toBe(0);
      expect(result.failurePenalty).toBe(0);
    });

    it('should score a 3-guess game correctly', () => {
      const input = '⬛🟨🟩⬛🟨\n🟨🟩🟨🟩🟩\n🟩🟩🟩🟩🟩';
      const result = scoreWordle(input);
      
      expect(result.attempts).toBe(3);
      expect(result.guesses.length).toBe(3);
      expect(result.boxScores.length).toBe(3);
      expect(result.guessPenalties).toEqual([0, 2, 4]);
      expect(result.failurePenalty).toBe(0);
    });

    it('should apply failure penalty when not completed', () => {
      const input = '⬛⬛⬛⬛⬛\n⬛⬛⬛⬛⬛';
      const result = scoreWordle(input);
      
      expect(result.failurePenalty).toBe(10);
      expect(result.totalPenalty).toBeGreaterThan(10);
    });

    it('should handle input with extra text', () => {
      const input = 'Wordle 123 3/6\n\n⬛🟨🟩⬛🟨\n🟨🟩🟨🟩🟩\n🟩🟩🟩🟩🟩';
      const result = scoreWordle(input);
      
      expect(result.attempts).toBe(3);
      expect(result.guesses.length).toBe(3);
    });

    it('should extract header line when input starts with "Wordle"', () => {
      const input = 'Wordle 1,000 6/6\n\n🟨⬛⬛⬛⬛\n🟨⬛🟩🟨⬛\n🟩⬛⬛⬛🟩\n🟨🟩🟩🟩🟩\n🟩🟩🟨🟩🟨\n🟩🟩🟩🟩🟩';
      const result = scoreWordle(input);
      
      expect(result.headerLine).toBe('Wordle 1,000 6/6');
      expect(result.attempts).toBe(6);
    });

    it('should not extract header line when input does not start with "Wordle"', () => {
      const input = '⬛🟨🟩⬛🟨\n🟨🟩🟨🟩🟩\n🟩🟩🟩🟩🟩';
      const result = scoreWordle(input);
      
      expect(result.headerLine).toBeUndefined();
      expect(result.attempts).toBe(3);
    });

    it('should normalize gray/white squares to black squares', () => {
      const input = '⬜⬜⬜⬜⬜\n🟩🟩🟩🟩🟩';
      const result = scoreWordle(input);
      
      // Gray squares should be normalized to black and scored as 2 points each
      expect(result.boxScores[0]).toBe(10); // 5 gray boxes × 2 points = 10
      expect(result.guesses[0]).toBe('⬛⬛⬛⬛⬛'); // Should be normalized to black
      expect(result.attempts).toBe(2);
    });

    it('should normalize other black box variations', () => {
      const input = '⚫🟫⬜⬛🟨\n🟩🟩🟩🟩🟩';
      const result = scoreWordle(input);
      
      // All variations should be normalized to black squares
      expect(result.guesses[0]).toBe('⬛⬛⬛⬛🟨');
      // 4 black boxes (normalized) = 8 points, 1 yellow = 1 point, total = 9
      expect(result.boxScores[0]).toBe(9); // 4×2 + 1×1 = 9
    });
  });

  describe('invalid inputs', () => {
    it('should throw error for empty input', () => {
      expect(() => scoreWordle('')).toThrow('No box patterns found');
    });

    it('should throw error for invalid box count', () => {
      expect(() => scoreWordle('⬛🟨🟩')).toThrow('must be one of: 5, 10, 15, 20, 25, 30');
    });

    it('should throw error for too many boxes', () => {
      const input = '⬛'.repeat(35);
      expect(() => scoreWordle(input)).toThrow('must be one of: 5, 10, 15, 20, 25, 30');
    });
  });

  describe('score transformation', () => {
    it('should transform perfect score to 100', () => {
      const result = scoreWordle('🟩🟩🟩🟩🟩');
      expect(result.totalScore).toBe(100);
    });

    it('should transform high raw score to low final score', () => {
      const result = scoreWordle('⬛⬛⬛⬛⬛\n⬛⬛⬛⬛⬛');
      // High raw score should result in low final score
      expect(result.totalScore).toBeLessThan(100);
    });
  });
});

