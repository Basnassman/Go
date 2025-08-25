import express from 'express';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import pagesRouter from './routes/pages.js';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// pass env to templates
app.use((req, res, next) => {
  res.locals.SITE = {
      cluster: process.env.PUBLIC_SOLANA_CLUSTER || 'devnet',
          merchant: process.env.MERCHANT_ADDRESS || ''
            };
              next();
              });

              app.use('/', pagesRouter);

              // 404
              app.use((req, res) => {
                res.status(404).render('layout', { title: '404 Not Found', body: '<div class="max-w-3xl mx-auto p-8"><h1 class="text-3xl font-bold mb-2">404</h1><p>Page not found.</p></div>' });
                });

                app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));