import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './src/routes/auth.js';
import bookingRoutes from './src/routes/bookings.js';
import feedbackRoutes from './src/routes/feedback.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL, { dbName: 'glamstudio' })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

app.get('/', (_, res) => {
  res.json({ status: 'ok', service: 'GlamStudio API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/feedback', feedbackRoutes);

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
