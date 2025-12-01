# Technology Stack Documentation

This document describes the technologies used in the Wordle Score Calculator web application and how they work together.

## Overview

The Wordle Score Calculator is a full-stack web application built with Node.js, Express, TypeScript, EJS templating, and Tailwind CSS. It processes Wordle share text, calculates scores using a custom algorithm, and displays results with an animated UI.

## Backend Technologies

### Node.js
- **Version**: Compatible with Node.js 20+
- **Role**: JavaScript runtime environment that executes server-side code
- **Usage**: Runs the Express server and handles HTTP requests

### Express.js
- **Version**: ^4.18.2
- **Role**: Web application framework for Node.js
- **Usage**: 
  - Handles HTTP routing (GET `/`, POST `/score`)
  - Serves static files (CSS, JavaScript)
  - Processes form submissions
  - Renders EJS templates

### TypeScript
- **Version**: ^5.3.3
- **Role**: Typed superset of JavaScript that compiles to plain JavaScript
- **Usage**:
  - Provides type safety for server-side code
  - Compiles to JavaScript in the `dist/` directory
  - Enables better IDE support and error detection
- **Configuration**: `tsconfig.json` defines compilation settings (target ES2020, CommonJS modules)

### Express EJS Layouts
- **Version**: ^2.5.1
- **Role**: Layout system for EJS templates
- **Usage**: Provides a base layout (`views/layout.ejs`) that wraps all page content, reducing code duplication

## Frontend Technologies

### EJS (Embedded JavaScript)
- **Version**: ^3.1.9
- **Role**: Templating engine that generates HTML dynamically
- **Usage**:
  - `views/layout.ejs`: Base layout with navigation and footer
  - `views/index.ejs`: Main page with form, results display, and client-side JavaScript
  - Server-side rendering: Express renders EJS templates with data (results, errors)
  - Template syntax: `<% %>` for logic, `<%= %>` for output, `<%- %>` for unescaped HTML

### Tailwind CSS
- **Version**: ^3.4.0
- **Role**: Utility-first CSS framework
- **Usage**:
  - Provides utility classes for styling (e.g., `bg-gray-800`, `text-orange-500`)
  - Custom animations defined in `public/css/input.css`
  - Build process: Tailwind scans `views/**/*.ejs` and `public/**/*.html` for class usage
  - Output: Generates minified CSS in `public/css/output.css`
- **Configuration**: `tailwind.config.js` defines content paths and theme settings

### PostCSS & Autoprefixer
- **Versions**: ^8.4.32, ^10.4.16
- **Role**: CSS processing tools
- **Usage**: PostCSS processes Tailwind CSS, Autoprefixer adds vendor prefixes

## Build Process

### Development
1. **TypeScript Compilation**: `tsc` compiles `.ts` files to JavaScript in `dist/`
2. **CSS Generation**: `tailwindcss` watches `input.css` and generates `output.css`
3. **Server**: `nodemon` watches for changes and restarts the server using `ts-node`

### Production
1. **Install Dependencies**: `npm install --include=dev` (includes devDependencies for TypeScript)
2. **TypeScript Build**: `npm run build` compiles TypeScript to `dist/`
3. **CSS Build**: `npm run build:css` generates minified CSS
4. **Start Server**: `node dist/server.js` runs the compiled JavaScript

## Application Architecture

### Request Flow
1. **User submits form** → POST request to `/score`
2. **Express route handler** (`routes/index.ts`) receives request
3. **Wordle scorer** (`utils/wordleScorer.ts`) processes input:
   - Extracts box patterns (⬛, 🟨, 🟩)
   - Calculates scores (box points, penalties, failure penalty)
   - Transforms final score (abs(100 - rawScore))
4. **EJS template** renders results with calculated data
5. **HTML response** sent to browser with embedded CSS and JavaScript

### File Structure
```
wordle-score/
├── dist/              # Compiled JavaScript (generated)
├── public/            # Static files
│   └── css/
│       ├── input.css  # Tailwind source + custom animations
│       └── output.css # Generated CSS (gitignored)
├── routes/            # Express route handlers
│   └── index.ts       # Main routes (GET /, POST /score)
├── utils/             # Business logic
│   └── wordleScorer.ts # Scoring algorithm
├── views/             # EJS templates
│   ├── layout.ejs     # Base layout
│   └── index.ejs      # Main page
├── types/             # TypeScript type definitions
│   └── express-ejs-layouts.d.ts
├── server.ts          # Express server setup
├── tsconfig.json      # TypeScript configuration
├── tailwind.config.js # Tailwind configuration
└── package.json       # Dependencies and scripts
```

## Key Features

### Client-Side JavaScript
- **Form handling**: Hides/shows form and results sections
- **Copy to clipboard**: Uses Clipboard API to copy formatted results
- **Sample generation**: Generates random Wordle patterns for testing
- **Expandable sections**: Toggles detailed breakdown and scoring system

### Server-Side Logic
- **Input validation**: Checks for valid Wordle format (5, 10, 15, 20, 25, or 30 boxes)
- **Box normalization**: Converts gray/white squares to black squares
- **Score calculation**: Golf-style scoring (lower raw score = better, then transformed)
- **Error handling**: Graceful error messages for invalid input

## Deployment

### Render.com Configuration
- **Build Command**: `npm install --include=dev && npm run build:all`
- **Start Command**: `npm start` (runs `node dist/server.js`)
- **Environment**: Node.js production environment
- **Static Files**: Served from `public/` directory via Express static middleware

### Path Resolution
The application handles different paths for development vs production:
- **Development**: Files are in the same directory as `server.ts`
- **Production**: Compiled `server.js` is in `dist/`, so paths adjust to parent directory
- **Solution**: Dynamic path resolution based on `__dirname.includes('dist')`

## Dependencies Summary

### Production Dependencies
- `express`: Web framework
- `ejs`: Templating engine
- `express-ejs-layouts`: Layout system

### Development Dependencies
- `typescript`: TypeScript compiler
- `@types/express`, `@types/node`: TypeScript type definitions
- `tailwindcss`, `postcss`, `autoprefixer`: CSS processing
- `nodemon`, `ts-node`: Development tooling

## Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Features used**:
  - ES2020 JavaScript features
  - Clipboard API (for copy functionality)
  - CSS Grid and Flexbox
  - CSS Animations and Transitions

## Security Considerations

- **Input validation**: Server-side validation of Wordle format
- **XSS protection**: EJS escapes output by default (`<%= %>`)
- **No database**: Stateless application, no data persistence
- **Static file serving**: Express serves files from `public/` directory only

