# Wordle Score Calculator

A web application that calculates scores from Wordle share text. Built with Express, TypeScript, EJS, and Tailwind CSS.

## Features

- Parse Wordle share text (extracts box emojis automatically)
- **Normalize box variations** - automatically converts gray/white squares to black squares
- Calculate scores based on box colors and attempt count
- **Animated score display** with exciting CSS effects
- Display detailed score breakdown with running totals (expandable)
- Generate sample Wordle results for testing
- Copy results to clipboard

## Scoring System

The scoring system uses a "higher is better" approach where:
- **Perfect score**: 100 points (all green boxes on first guess)
- **Failure score**: 0 points (did not complete the wordle)

### Box Points
- ⬛ Black box: 2 points (letter not in word)
  - Note: Gray/white squares (⬜), black circles (⚫), and brown squares (🟫) are automatically normalized to black boxes
- 🟨 Yellow box: 1 point (letter in word, wrong position)
- 🟩 Green box: 0 points (letter in word, correct position)

### Penalties
- **Per-guess penalty**: (guessNumber - 1) × 2
  - Guess 1: 0 penalty
  - Guess 2: 2 penalty
  - Guess 3: 4 penalty
  - Guess 4: 6 penalty
  - Guess 5: 8 penalty
  - Guess 6: 10 penalty
- **Failure penalty**: 10 points if Wordle is not completed

### Final Score Calculation
```
rawScore = boxTotal + totalPenalty
finalScore = |100 - rawScore|
```

## Installation

```bash
npm install
```

## Development

```bash
# Start development server with auto-reload
npm run dev

# Build TypeScript
npm run build

# Watch CSS changes
npm run watch:css
```

## Production

```bash
# Build the project
npm run build

# Build CSS (required before starting)
npx tailwindcss -i ./public/css/input.css -o ./public/css/output.css --minify

# Start server
npm start
```

## Project Structure

```
wordle-score/
├── dist/              # Compiled JavaScript
├── public/           # Static files (CSS, JS)
│   └── css/
├── routes/           # Express routes
│   └── index.ts
├── utils/            # Business logic
│   └── wordleScorer.ts
├── views/            # EJS templates
│   ├── layout.ejs
│   └── index.ejs
├── types/            # TypeScript type definitions
├── server.ts         # Express server setup
└── package.json
```

## API

### GET /
Renders the homepage with the score calculator form.

### POST /score
Processes Wordle share text and calculates the score.

**Request Body:**
```json
{
  "wordleText": "⬛🟨🟩⬛🟨\n🟨🟩🟨🟩🟩\n🟩🟩🟩🟩🟩"
}
```

**Response:** Renders the results page with score breakdown.

## Deployment

The project includes a `render.yaml` configuration for deployment on Render.com.

## License

ISC

