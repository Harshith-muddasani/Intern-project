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
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/altar-styles', altarStyleRoutes);
app.use('/offerings', offeringRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandler);

export default app; 