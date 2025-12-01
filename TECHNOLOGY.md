# Technology Stack Documentation

This document describes the technologies used in the Wordle Score Calculator web application and how they work together. The narrative section below uses this website as a practical example to explain how each technology functions.

## Narrative: How the Technologies Work Together

This section walks through how each technology functions in the context of the Wordle Score Calculator, using real examples from the application.

### The Request Journey: From Browser to Response

When a user visits the Wordle Score Calculator, here's what happens behind the scenes:

**1. The User Types a URL**
- The user enters `https://wordle-score.onrender.com` in their browser
- The browser sends an HTTP GET request to the server

**2. Node.js Receives the Request**
- Node.js is the runtime environment that executes JavaScript outside the browser
- In this application, Node.js runs the Express server (`server.ts`)
- Node.js listens on a port (3000 in development, or `process.env.PORT` in production) for incoming HTTP requests

**3. Express.js Routes the Request**
- Express is a web framework that simplifies HTTP request handling
- In `server.ts`, Express is configured with middleware and routes:
  ```typescript
  app.use('/', indexRouter);
  ```
- Express examines the request path (`/`) and matches it to the appropriate route handler

**4. TypeScript Provides Type Safety**
- Before the code runs, TypeScript compiles `.ts` files to `.js` files
- TypeScript ensures type safety: for example, `scoreWordle()` expects a `string` parameter
- If you tried to pass a number, TypeScript would catch the error at compile time
- In this app, `server.ts` and `routes/index.ts` are written in TypeScript, then compiled to JavaScript in the `dist/` directory

**5. The Route Handler Processes the Request**
- The route handler in `routes/index.ts` receives the request:
  ```typescript
  router.get('/', (req: Request, res: Response) => {
    res.render('index', { result: null, error: null, wordleText: '' });
  });
  ```
- This handler calls `res.render()`, which tells Express to render a template

**6. EJS Generates HTML**
- EJS (Embedded JavaScript) is a templating engine that generates HTML dynamically
- Express looks for `views/index.ejs` and processes it:
  - `<% %>` tags contain JavaScript logic that runs on the server
  - `<%= %>` tags output values (automatically escaped for security)
  - `<%- %>` tags output unescaped HTML (used for the layout body)
- In this case, the template receives `{ result: null, error: null, wordleText: '' }`
- EJS generates the HTML form, which is sent to the browser

**7. The Browser Receives HTML**
- The browser receives the HTML and begins rendering it
- It encounters a link to `/css/output.css` and requests that file

**8. Express Serves Static Files**
- Express's static middleware (`app.use(express.static(publicPath))`) serves files from the `public/` directory
- The CSS file is sent to the browser

**9. Tailwind CSS Styles the Page**
- Tailwind CSS is a utility-first framework: instead of writing custom CSS, you use pre-built classes
- For example, `bg-gray-800` sets the background color, `text-orange-500` sets text color
- Tailwind scans the EJS templates for class names and generates only the CSS needed
- The generated CSS is in `public/css/output.css`

### Processing a Wordle Score Submission

When a user submits a Wordle score, the flow demonstrates server-side processing:

**1. Form Submission**
- The user fills in the textarea with Wordle boxes (⬛🟨🟩⬛🟨, etc.)
- Clicking "Calculate Score" submits a POST request to `/score`

**2. Express Parses the Request Body**
- Express middleware (`express.urlencoded()`) parses the form data
- The data becomes available as `req.body.wordleText`

**3. The Route Handler Validates Input**
- In `routes/index.ts`, the POST handler checks if `wordleText` exists and is not empty
- This is server-side validation: even if JavaScript is disabled, the server validates input

**4. TypeScript Business Logic Processes the Data**
- The handler calls `scoreWordle(wordleText)` from `utils/wordleScorer.ts`
- This function is written in TypeScript with strong typing:
  ```typescript
  export function scoreWordle(shareText: string): ScoreResult
  ```
- The function signature guarantees it returns a `ScoreResult` object with specific properties
- TypeScript ensures type safety: if the function tried to return a string instead, it would fail at compile time

**5. The Scoring Algorithm Works**
- The `scoreWordle()` function:
  - Extracts box patterns using character iteration
  - Normalizes gray boxes (⬜, ⚫) to black boxes (⬛)
  - Groups boxes into rows of 5
  - Calculates scores: box points (⬛=2, 🟨=1, 🟩=0) + guess penalties + failure penalty
  - Transforms the score: `Math.abs(100 - rawScore)` so higher is better
- This demonstrates pure TypeScript/JavaScript logic with no framework dependencies

**6. EJS Renders the Results**
- The route handler calls `res.render('index', { result, error: null, wordleText: '' })`
- EJS processes `views/index.ejs` again, but this time with a `result` object
- The template uses conditional logic:
  ```ejs
  <% if (typeof result !== 'undefined' && result) { %>
    <!-- Display results -->
  <% } %>
  ```
- EJS generates HTML with the score, breakdown, and animations

**7. The Response is Sent**
- Express sends the complete HTML to the browser
- The browser renders the results page

### Client-Side Interactivity

After the page loads, JavaScript in the browser handles user interactions:

**1. DOMContentLoaded Event**
- The browser fires this event when the HTML is fully loaded
- JavaScript in `views/index.ejs` listens for this event:
  ```javascript
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize functionality
  });
  ```

**2. Event Listeners**
- JavaScript attaches event listeners to buttons:
  ```javascript
  copyButton.addEventListener('click', function() {
    // Handle copy action
  });
  ```
- When the user clicks "Copy Result", the listener function runs

**3. Browser APIs**
- The application uses the Clipboard API:
  ```javascript
  navigator.clipboard.writeText(formattedText)
  ```
- This is a browser API, not part of JavaScript itself
- It allows web pages to interact with the user's clipboard

**4. DOM Manipulation**
- JavaScript can show/hide elements:
  ```javascript
  inputFormSection.style.display = 'none';
  ```
- This dynamically changes the page without a server round-trip

### CSS and Styling

**1. Tailwind CSS Utility Classes**
- Instead of writing custom CSS, the HTML uses utility classes:
  ```html
  <div class="bg-gray-800 rounded-lg shadow-lg p-6">
  ```
- `bg-gray-800` = background color
- `rounded-lg` = border radius
- `shadow-lg` = box shadow
- `p-6` = padding

**2. Tailwind Build Process**
- During build, Tailwind scans the EJS templates
- It finds all class names used (like `bg-gray-800`, `text-orange-500`)
- It generates only the CSS needed for those classes
- This keeps the CSS file small (only ~15KB instead of hundreds of KB)

**3. Custom Animations**
- Custom CSS animations are defined in `public/css/input.css`:
  ```css
  @keyframes scoreReveal {
    0% { opacity: 0; transform: scale(0.5); }
    100% { opacity: 1; transform: scale(1); }
  }
  ```
- These are combined with Tailwind's utility classes
- The result is a small, optimized CSS file with custom animations

### Layout System

**1. Express EJS Layouts**
- The layout system prevents code duplication
- `views/layout.ejs` contains the common structure (navigation, footer)
- Individual pages (like `index.ejs`) only contain their unique content
- The `<%- body %>` tag in the layout is replaced with the page content

**2. How It Works**
- When Express renders `index.ejs`, it first processes the layout
- The page content is inserted where `<%- body %>` appears
- This means the navigation and footer are consistent across all pages

### Build and Deployment

**1. Development Build**
- TypeScript files are compiled: `tsc` reads `tsconfig.json` and compiles `.ts` to `.js`
- CSS is generated: `tailwindcss` watches `input.css` and generates `output.css`
- The server runs with `nodemon`, which restarts on file changes

**2. Production Build**
- All TypeScript is compiled to JavaScript in `dist/`
- CSS is minified (removes whitespace, comments)
- Only production dependencies are needed at runtime (TypeScript isn't needed)

**3. Path Resolution**
- In development, `server.ts` is in the root directory
- In production, `server.js` is in `dist/`
- The code checks `__dirname.includes('dist')` to adjust paths:
  ```typescript
  const viewsPath = __dirname.includes('dist')
    ? path.join(__dirname, '..', 'views')  // Production: go up one level
    : path.join(__dirname, 'views');       // Development: same level
  ```

### Why These Technologies?

**Node.js**: Allows JavaScript to run on the server, enabling full-stack JavaScript development.

**Express**: Simplifies HTTP request handling, routing, and middleware management.

**TypeScript**: Catches errors at compile time, provides better IDE support, and makes code more maintainable.

**EJS**: Enables server-side HTML generation with dynamic data, keeping the application simple without a complex frontend framework.

**Tailwind CSS**: Speeds up styling with utility classes, generates only needed CSS, and keeps styles consistent.

**Express EJS Layouts**: Reduces code duplication and maintains consistent page structure.

Together, these technologies create a simple, maintainable, and performant web application that processes Wordle scores efficiently.

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

