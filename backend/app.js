import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import altarStyleRoutes from './routes/altarStyleRoutes.js';
import offeringRoutes from './routes/offeringRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sharingRoutes from './routes/sharingRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));

app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/altar-styles', altarStyleRoutes);
app.use('/offerings', offeringRoutes);
app.use('/admin', adminRoutes);
app.use('/api', sharingRoutes);

console.log('✓ All routes registered including sharing routes');

app.use(errorHandler);

export default app; 