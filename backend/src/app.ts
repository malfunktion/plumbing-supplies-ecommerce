import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import setupRoutes from './routes/setup';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/setup', setupRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export the app for use in server.ts
export default app;
