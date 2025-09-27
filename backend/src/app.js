// backend/src/app.js

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.route.js';
import authRoutes from './routes/authRoutes.js';
import cropDetectionRoutes from './routes/cropDetection.route.js';
import diseaseDetectionRoutes from "./routes/diseaseDetection.route.js";
import diseaseDetailsRoutes from "./routes/diseaseDetails.route.js";

import connectDB from '../config/db.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`Backend: ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes);
app.use('/api', cropDetectionRoutes);
app.use("/api", diseaseDetectionRoutes);
app.use("/api", diseaseDetailsRoutes);



// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Backend: Uncaught error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;
