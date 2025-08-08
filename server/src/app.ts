import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { specs } from './config/swagger';
import eventRoutes from './routes/events';
import storyRoutes from './routes/stories';
import uploadRoutes from './routes/upload';
import raceRoutes from './routes/races';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(limiter);

// CORS configuration for frontend - Allow multiple development URLs
const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:3000', // React dev server
  'http://localhost:5174', // Vite alternative
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, be more permissive with localhost origins
    if (process.env.NODE_ENV !== 'production') {
      if (origin && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
        return callback(null, true);
      }
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Swagger Documentation
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'East Down Yacht Club API Documentation',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    }
  }));
  
  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  
  logger.info('Swagger UI available at /api-docs');
}

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check the health status of the API server
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                   description: Health status of the server
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-04-15T10:30:00.000Z"
 *                   description: Current server timestamp
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                   description: API version
 *               required:
 *                 - status
 *                 - timestamp
 *                 - version
 *             examples:
 *               healthy:
 *                 summary: Healthy server response
 *                 value:
 *                   status: "healthy"
 *                   timestamp: "2024-04-15T10:30:00.000Z"
 *                   version: "1.0.0"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/races', raceRoutes);

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    port: PORT
  });
});

export default app;