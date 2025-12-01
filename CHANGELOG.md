# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-12-01

### Added
- Initial release of Wordle Score Calculator
- Parse Wordle share text and extract box emojis
- Calculate scores based on box colors (black=2, yellow=1, green=0)
- Per-guess penalty system (2 points per additional guess)
- Failure penalty (10 points if Wordle not completed)
- Score transformation (|100 - rawScore| for higher-is-better display)
- Detailed score breakdown with running totals
- Generate sample Wordle results
- Copy results to clipboard
- Responsive dark theme UI with Tailwind CSS
- **Animated score display** with CSS animations (3D reveal, pulsing glow, gradient effects)
- **Expandable details section** for score breakdown
- **Box normalization** - automatically converts gray/white squares (⬜), black circles (⚫), and brown squares (🟫) to black squares (⬛)

### Fixed
- Gray/white boxes now properly normalized to black boxes for consistent scoring
- Improved contrast on score display for better readability

### Technical
- Express.js server with TypeScript
- EJS templating with layouts
- Input validation (5, 10, 15, 20, 25, or 30 boxes)
- Error handling for invalid inputs
- Deployment configuration for Render.com
- Custom CSS animations and transitions

