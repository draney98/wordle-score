import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import indexRouter from './routes/index';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure view engine
// In production (dist/), views are in parent directory; in dev, they're in current directory
const viewsPath = __dirname.includes('dist') 
  ? path.join(__dirname, '..', 'views')
  : path.join(__dirname, 'views');
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// In production (dist/), public is in parent directory; in dev, it's in current directory
const publicPath = __dirname.includes('dist')
  ? path.join(__dirname, '..', 'public')
  : path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Routes
app.use('/', indexRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

