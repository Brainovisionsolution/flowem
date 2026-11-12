import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { parseCookies } from './middleware/cookieParser.js';
import { env } from './config/env.js';

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-API-Key', 'X-FlowEM-Signature']
  }));
  app.use(parseCookies);
  app.use(express.text({ type: 'text/plain', limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(requestLogger);

  // Mount API Router
  app.use('/api', apiRouter);

  // Serve static assets from public folder if present (Docker / Production build)
  const publicDir = path.resolve('public');
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(publicDir, 'index.html'));
    });
  } else {
    // 404 Handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: `Endpoint ${req.method} ${req.originalUrl} not found`
      });
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

